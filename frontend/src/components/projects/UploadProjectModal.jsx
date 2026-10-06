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
  FolderArchive,
  GitBranch,
  Globe,
  Terminal,
  Layers,
  Laptop
} from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";

export const UploadProjectModal = ({ isOpen, onClose }) => {
  const { uploadProject, createProject } = useProject();
  const navigate = useNavigate();

  // Mode: "laptop" or "github"
  const [sourceMode, setSourceMode] = useState("laptop");

  // Laptop file state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // GitHub state
  const [githubUrl, setGithubUrl] = useState("");
  const [branch, setBranch] = useState("main");

  // Common fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("python");

  // UI state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedProject, setUploadedProject] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".zip") && !selectedFile.name.endsWith(".tar.gz")) {
      setError("Please select a compressed codebase archive (.zip or .tar.gz)");
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

  // Handle GitHub URL input and auto-extract project name & suggested language
  const handleGithubUrlChange = (val) => {
    setGithubUrl(val);
    setError(null);

    // Auto-detect repo name if user hasn't typed a custom name yet
    const trimmed = val.trim().replace(/\/+$/, "");
    const parts = trimmed.split("/");
    if (parts.length >= 2) {
      const repoName = parts[parts.length - 1].replace(/\.git$/i, "");
      if (repoName && (!name || name === "fastapi" || name === "flask" || name === "express" || name === "gin")) {
        setName(repoName);
      }
    }
  };

  // Popular open-source presets
  const applyPreset = (preset) => {
    setGithubUrl(preset.url);
    setName(preset.name);
    setDescription(preset.desc);
    setLanguage(preset.lang);
    setBranch("main");
    setError(null);
  };

  const PRESETS = [
    {
      name: "fastapi",
      url: "https://github.com/fastapi/fastapi",
      lang: "python",
      desc: "FastAPI modern high-performance web framework"
    },
    {
      name: "flask",
      url: "https://github.com/pallets/flask",
      lang: "python",
      desc: "Flask lightweight WSGI web application framework"
    },
    {
      name: "express",
      url: "https://github.com/expressjs/express",
      lang: "javascript",
      desc: "Fast, unopinionated, minimalist web framework for Node.js"
    },
    {
      name: "gin",
      url: "https://github.com/gin-gonic/gin",
      lang: "go",
      desc: "Gin HTTP web framework written in Go"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (sourceMode === "laptop") {
      if (!file) {
        setError("Please select a ZIP codebase to upload from your laptop");
        return;
      }
      setUploading(true);
      try {
        const proj = await uploadProject(file, name, description, language);
        setUploadedProject(proj);
      } catch (err) {
        setError(err.message || "Failed to upload and index codebase archive.");
      } finally {
        setUploading(false);
      }
    } else {
      // GitHub mode
      if (!githubUrl || !githubUrl.trim()) {
        setError("Please enter a valid GitHub repository URL");
        return;
      }
      let formattedUrl = githubUrl.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://github.com/${formattedUrl}`;
      }
      setUploading(true);
      try {
        const proj = await createProject({
          name: name || formattedUrl.split("/").pop().replace(".git", ""),
          description: description || `Cloned from ${formattedUrl}`,
          source_type: "GITHUB",
          github_url: formattedUrl,
          primary_language: language
        });
        setUploadedProject(proj);
      } catch (err) {
        setError(err.message || "Failed to clone and index repository from GitHub.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleClose = () => {
    setFile(null);
    setGithubUrl("");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Card River Line Accent */}
        <div className="w-full h-[2px] river-stream-line opacity-90" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {sourceMode === "laptop" ? (
                <UploadCloud className="w-5 h-5" />
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-content-primary">
                {sourceMode === "laptop" ? "Upload Project from Laptop" : "Import Project from GitHub"}
              </h2>
              <p className="text-[11px] text-content-muted">
                {sourceMode === "laptop"
                  ? "Ingest and AST-index any local codebase (.zip)"
                  : "Directly clone and index any GitHub repository"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {uploadedProject ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-primary">Project Successfully Seeded!</h3>
                <p className="text-xs text-content-secondary mt-1">
                  "{uploadedProject.name}" has been parsed into AST symbols, vectorized in ChromaDB, and woven into call graphs.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-border bg-surface-subtle text-xs font-semibold text-content-primary hover:bg-surface-base transition-colors cursor-pointer"
                >
                  Done
                </button>
                <button
                  onClick={handleOpenWorkspace}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>Open in IDE Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Source Mode Switcher Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-border select-none">
                <button
                  type="button"
                  onClick={() => {
                    setSourceMode("laptop");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sourceMode === "laptop"
                      ? "bg-surface-elevated text-content-primary shadow-xs border border-border"
                      : "text-content-muted hover:text-content-primary"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Upload from Laptop (.zip)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSourceMode("github");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sourceMode === "github"
                      ? "bg-surface-elevated text-content-primary shadow-xs border border-border"
                      : "text-content-muted hover:text-content-primary"
                  }`}
                >
                  {/* GitHub SVG */}
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Clone from GitHub</span>
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ===== TAB 1: LAPTOP ZIP UPLOAD ===== */}
              {sourceMode === "laptop" && (
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
                        <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
              )}

              {/* ===== TAB 2: GITHUB REPO INGEST ===== */}
              {sourceMode === "github" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-content-primary mb-1.5">
                      GitHub Repository URL
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-content-muted">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        required={sourceMode === "github"}
                        value={githubUrl}
                        onChange={(e) => handleGithubUrlChange(e.target.value)}
                        placeholder="https://github.com/fastapi/fastapi"
                        className="w-full pl-9 pr-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset Starters Pills */}
                  <div className="pt-0.5">
                    <span className="text-[10px] font-mono text-content-muted block mb-1.5">
                      Or test with popular open-source repositories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="px-2.5 py-1 rounded-lg border border-border bg-surface-base hover:bg-emerald-500/10 hover:border-emerald-500/30 text-content-secondary hover:text-content-primary text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <GitBranch className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields: Project Name, Description & Language */}
              <div className="grid grid-cols-1 gap-3 pt-1">
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
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
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
                    placeholder="e.g. Backend API codebase with authentication"
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-primary mb-1">
                    Primary Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript / Node.js</option>
                    <option value="typescript">TypeScript</option>
                    <option value="go">Go</option>
                    <option value="java">Java</option>
                    <option value="rust">Rust</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-border bg-surface-subtle hover:bg-surface-base text-content-primary text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    uploading ||
                    (sourceMode === "laptop" && (!file || !name)) ||
                    (sourceMode === "github" && (!githubUrl || !name))
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${uploading ? "animate-spin" : ""}`} />
                  <span>
                    {uploading
                      ? sourceMode === "github"
                        ? "Cloning & Indexing Codebase..."
                        : "Uploading & Indexing..."
                      : sourceMode === "github"
                      ? "Clone & Ingest from GitHub"
                      : "Upload & Parse Codebase"}
                  </span>
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
