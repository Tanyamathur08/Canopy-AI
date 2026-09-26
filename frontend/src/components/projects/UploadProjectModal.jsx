import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  FolderArchive
} from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";

export const UploadProjectModal = ({ isOpen, onClose }) => {
  const { uploadProject } = useProject();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("python");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedProject, setUploadedProject] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".zip") && !selectedFile.name.endsWith(".tar.gz")) {
      setError("Please select a compressed codebase archive (.zip)");
      return;
    }
    setError(null);
    setFile(selectedFile);
    if (!name) {
      setName(selectedFile.name.replace(/\.zip|\.tar\.gz$/i, "").replace(/[-_]/g, " "));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a ZIP codebase to upload from your laptop");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const proj = await uploadProject(file, name, description, language);
      setUploadedProject(proj);
    } catch (err) {
      setError(err.message || "Failed to upload and index codebase archive.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    setDescription("");
    setError(null);
    setUploadedProject(null);
    onClose();
  };

  const handleOpenWorkspace = () => {
    if (uploadedProject) {
      navigate(`/projects/${uploadedProject.id}/code`);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-content-primary">Upload Project from Laptop</h2>
              <p className="text-[11px] text-content-muted">Ingest and AST-index any local codebase (.zip)</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {uploadedProject ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-primary">Project Successfully Seeded!</h3>
                <p className="text-xs text-content-secondary mt-1">
                  "{uploadedProject.name}" has been safely extracted, parsed into AST symbols, and embedded in ChromaDB.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-border bg-surface-subtle text-xs font-semibold text-content-primary hover:bg-surface-base transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={handleOpenWorkspace}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <span>Open in IDE Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : file
                    ? "border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10"
                    : "border-border hover:border-emerald-400 bg-surface-base"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".zip,.tar.gz"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center">
                      <FolderArchive className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-xs text-content-primary break-all">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-content-muted font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB — Click to choose different file
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-surface-subtle text-content-muted flex items-center justify-center">
                      <UploadCloud className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-content-primary">
                        Click to upload ZIP archive
                      </span>
                      <span className="text-xs text-content-muted"> or drag & drop</span>
                    </div>
                    <p className="text-[10px] text-content-muted">
                      Supports .zip files from your laptop with path-traversal protection
                    </p>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-content-primary mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Microservice"
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-primary mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Backend API codebase"
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-primary mb-1">
                    Primary Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript / Node.js</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-border bg-surface-subtle hover:bg-surface-base text-content-primary text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file || !name}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${uploading ? "animate-spin" : ""}`} />
                  <span>{uploading ? "Uploading & Indexing..." : "Upload & Parse Codebase"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProjectModal;
