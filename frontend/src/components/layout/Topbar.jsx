import React, { useState } from "react";
import { Search, Command, ChevronDown, Check, FolderGit2, Sun, Moon } from "lucide-react";
import { useProject } from "../../contexts/ProjectContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { CommandPalette } from "./CommandPalette";

export const Topbar = () => {
  const { projects, activeProject, setActiveProject } = useProject();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border bg-surface-elevated/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shadow-2xs">
        {/* Left: Project Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-elevated hover:bg-surface-subtle text-xs font-semibold text-content-primary transition-all shadow-2xs"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="max-w-[150px] truncate">
              {activeProject ? activeProject.name : "Select Project"}
            </span>
            <ChevronDown className="w-3 h-3 text-content-muted ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-surface-elevated border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-content-muted tracking-wider border-b border-border/50">
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
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 text-content-primary transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-semibold truncate">{p.name}</span>
                      <span className="text-[10px] text-content-muted capitalize">
                        {p.primary_language || "python"} · {p.file_count || 0} files
                      </span>
                    </div>
                    {activeProject?.id === p.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-border bg-surface-base hover:bg-surface-subtle text-xs text-content-muted hover:text-content-primary transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-content-muted group-hover:text-emerald-600 transition-colors" />
              <span>Search repository, symbols, or ask AI...</span>
            </div>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-mono text-content-muted shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Operational Status, Theme Toggle & Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Canopy RAG & Graph: Online</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-border bg-surface-elevated hover:bg-surface-subtle text-content-secondary hover:text-content-primary transition-all shadow-2xs"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-emerald-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

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
