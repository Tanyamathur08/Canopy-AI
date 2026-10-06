import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  BotMessageSquare,
  Search,
  Network,
  ShieldAlert,
  TestTube2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Terminal
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProject } from "../../contexts/ProjectContext";
import { CanopyLogo } from "../common/CanopyLogo";
import { cn } from "../../utils/cn";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { activeProject } = useProject();

  const pid = activeProject?.id || "demo-project-id";

  const navigationItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Projects", icon: FolderGit2, path: "/projects" },
    { label: "Code Explorer", icon: Code2, path: `/projects/${pid}/code` },
    { label: "AI Chat", icon: BotMessageSquare, path: `/projects/${pid}/chat` },
    { label: "Semantic Search", icon: Search, path: `/projects/${pid}/search` },
    { label: "Dependencies", icon: Network, path: `/projects/${pid}/dependencies` },
    { label: "Analysis", icon: ShieldAlert, path: `/projects/${pid}/analysis` },
    { label: "Tests", icon: TestTube2, path: `/projects/${pid}/tests` },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30 select-none shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-sidebar-border bg-sidebar">
        <Link to="/" className="flex items-center overflow-hidden">
          <CanopyLogo size={collapsed ? "sm" : "md"} showText={!collapsed} />
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.label}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Active Project Pill */}
      {!collapsed && activeProject && (
        <div className="mx-2 mb-3 p-2.5 rounded-lg bg-card/60 border border-border/60">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Active Project
            </span>
            <span className="text-[10px] font-mono uppercase">{activeProject.primary_language || "python"}</span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{activeProject.name}</p>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
              {user?.full_name ? user.full_name[0].toUpperCase() : "D"}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-foreground truncate">{user?.full_name || "Developer"}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.email || "demo@codemind.ai"}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
