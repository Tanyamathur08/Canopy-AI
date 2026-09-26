import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BotMessageSquare,
  FolderGit2,
  Code2,
  Network,
  ShieldAlert,
  TestTube2,
  Settings,
  X
} from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { activeProject } = useProject();
  const pid = activeProject?.id || "demo-project-id";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { title: "Ask AI Assistant", desc: "Interact with the LangGraph codebase agent", icon: BotMessageSquare, path: `/projects/${pid}/chat` },
    { title: "Semantic Code Search", desc: "Query repository vectors in ChromaDB", icon: Search, path: `/projects/${pid}/search` },
    { title: "Code Explorer", desc: "Browse files and inspect Monaco editor", icon: Code2, path: `/projects/${pid}/code` },
    { title: "Dependency Graph", desc: "Explore Neo4j call & import topology", icon: Network, path: `/projects/${pid}/dependencies` },
    { title: "Codebase Security & Quality", desc: "Review AST audits & architecture patterns", icon: ShieldAlert, path: `/projects/${pid}/analysis` },
    { title: "Pytest Suite & Generator", desc: "Generate fixtures and run isolated tests", icon: TestTube2, path: `/projects/${pid}/tests` },
    { title: "Manage Projects", desc: "Switch repository or upload new codebase", icon: FolderGit2, path: "/projects" },
    { title: "System Settings", desc: "Configure AI providers, models, and ignore rules", icon: Settings, path: "/settings" },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search codebase... (Esc to close)"
            className="w-full py-3.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => {
                    navigate(action.path);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-accent/60 transition-colors group"
                >
                  <div className="p-2 rounded-md bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-foreground">{action.title}</span>
                    <span className="text-[11px] text-muted-foreground truncate">{action.desc}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigation</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">↓</kbd>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Execute</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
