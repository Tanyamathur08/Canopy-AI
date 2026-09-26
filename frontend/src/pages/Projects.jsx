import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  Plus,
  RefreshCw,
  Code2,
  X
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";

export const Projects = () => {
  const { projects, activeProject, setActiveProject, createProject, createDemoProject, refreshProjects } = useProject();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("DEMO");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (sourceType === "DEMO") {
        await createDemoProject();
      } else {
        await createProject({
          name,
          description,
          source_type: sourceType,
          github_url: sourceType === "GITHUB" ? githubUrl : undefined
        });
      }
      setModalOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      alert(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects & Workspaces</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your connected codebases, repository sources, and indexing state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshProjects()}
            className="p-2 rounded-lg border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh projects"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const isCurrent = activeProject?.id === project.id;
          return (
            <div
              key={project.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                isCurrent
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card/70 hover:border-border/80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground truncate max-w-[170px]">{project.name}</h3>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {project.repository?.source_type || "DEMO"}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Indexed
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description || "Microservice repository with AST symbols and vector embeddings."}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-background/60 border border-border/60 text-[11px] font-mono">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Files</span>
                    <span className="font-semibold text-foreground">{project.file_count || 6}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Chunks</span>
                    <span className="font-semibold text-foreground">{project.chunk_count || 14}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveProject(project);
                    navigate(`/projects/${project.id}/code`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs border border-primary/20 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Open IDE</span>
                </button>

                <button
                  onClick={() => {
                    setActiveProject(project);
                    navigate(`/projects/${project.id}/chat`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground font-semibold text-xs transition-colors"
                >
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-foreground mb-1">Create New Workspace</h3>
            <p className="text-xs text-muted-foreground mb-5">Connect or upload a new codebase for AI analysis</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Payment Microservice"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Source Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "DEMO", label: "Demo Repo" },
                    { id: "GITHUB", label: "GitHub" },
                    { id: "ZIP", label: "Upload ZIP" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSourceType(s.id)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        sourceType === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {sourceType === "GITHUB" && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">GitHub Repository URL</label>
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/org/repo"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this repository do?"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs text-foreground font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {loading ? "Indexing Codebase..." : "Create & Index"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
