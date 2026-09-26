import React, { useState } from "react";
import { Search, Command, ChevronDown, Check, FolderGit2 } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import { CommandPalette } from "./CommandPalette";

export const Topbar = () => {
  const { projects, activeProject, setActiveProject } = useProject();
  const { user } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border bg-card/40 backdrop-blur-md px-4 flex items-center justify-between z-20">
        {/* Left: Project Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/80 hover:bg-accent/40 text-xs font-medium text-foreground transition-all shadow-sm"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold max-w-[150px] truncate">
              {activeProject ? activeProject.name : "Select Project"}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider border-b border-border/50">
                Workspaces ({projects.length})
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-accent/50 text-foreground transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {p.primary_language || "python"} · {p.file_count || 0} files
                      </span>
                    </div>
                    {activeProject?.id === p.id && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-border/80 bg-background/60 hover:bg-background text-xs text-muted-foreground transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                Search repository, symbols, or ask AI...
              </span>
            </div>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted/60 border border-border/60 text-[10px] font-mono text-muted-foreground">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Operational Status & Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI RAG & Graph: Online</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-border/80">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
              {user?.full_name ? user.full_name[0].toUpperCase() : "A"}
            </div>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
};

export default Topbar;
