import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderGit2,
  FileCode,
  Layers,
  Network,
  BotMessageSquare,
  ShieldAlert,
  Plus,
  ExternalLink,
  CheckCircle2,
  Server,
  UploadCloud
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import { UploadProjectModal } from "../components/projects/UploadProjectModal";

export const Dashboard = () => {
  const { user } = useAuth();
  const { projects, activeProject, setActiveProject } = useProject();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const pid = activeProject?.id || "demo-project-id";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {user?.full_name?.split(" ")[0] || "Developer"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Here's what's happening across your codebases and AI index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs transition-all"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Upload Project</span>
          </button>
          <Link
            to="/projects"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            to={`/projects/${pid}/code`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface-elevated hover:bg-surface-subtle text-content-primary text-xs font-semibold shadow-2xs transition-all"
          >
            <span>Open IDE Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Projects", value: projects.length || 1, icon: FolderGit2, color: "text-blue-400" },
          { label: "Files Indexed", value: activeProject?.file_count || 6, icon: FileCode, color: "text-indigo-400" },
          { label: "Code Chunks", value: activeProject?.chunk_count || 14, icon: Layers, color: "text-purple-400" },
          { label: "Dependencies", value: 12, icon: Network, color: "text-emerald-400" },
          { label: "AI Queries", value: 24, icon: BotMessageSquare, color: "text-amber-400" },
          { label: "Issues Detected", value: 3, icon: ShieldAlert, color: "text-rose-400" },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-4 rounded-xl border border-border bg-card/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-xl font-bold font-mono text-foreground mt-3">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Projects & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-primary" />
              <span>Connected Repositories</span>
            </h2>
            <Link to="/projects" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-border bg-card/70 hover:border-primary/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{project.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase">
                      {project.primary_language || "python"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {project.description || "Microservice repository indexed for semantic search and dependency queries."}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1">
                    <span>{project.file_count || 6} files</span>
                    <span>{project.chunk_count || 14} AST chunks</span>
                    <span>Indexed 2 min ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      navigate(`/projects/${project.id}/code`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs border border-primary/20 transition-colors"
                  >
                    Open Code
                  </button>
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      navigate(`/projects/${project.id}/chat`);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground font-medium text-xs transition-colors"
                  >
                    Ask AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Activity & System Status */}
        <div className="space-y-6">
          {/* Recent AI Activity */}
          <div className="p-5 rounded-xl border border-border bg-card/60 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <BotMessageSquare className="w-4 h-4 text-primary" />
              <span>Recent AI Activity</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {[
                { title: "Analyzed authentication flow", time: "5m ago", type: "RAG & AST" },
                { title: "Generated Pytest suite for UserService", time: "22m ago", type: "Code Gen" },
                { title: "Found 12 references to payment_service", time: "1h ago", type: "Call Graph" },
                { title: "Explained API request lifecycle", time: "3h ago", type: "LangGraph" },
              ].map((act, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-background/60 border border-border/60">
                  <div className="text-[11px] font-sans font-medium text-foreground">{act.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span className="text-primary/90">{act.type}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="p-5 rounded-xl border border-border bg-card/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>System Infrastructure</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "FastAPI REST Gateway", status: "Operational" },
                { name: "PostgreSQL Database", status: "Operational" },
                { name: "ChromaDB Vector Store", status: "Operational" },
                { name: "Neo4j Knowledge Graph", status: "Operational" },
                { name: "Gemini Reasoning Engine", status: "Connected" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                  <span className="text-muted-foreground text-[11px]">{s.name}</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UploadProjectModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
