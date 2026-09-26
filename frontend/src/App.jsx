import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";

// Layouts
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";

// Authenticated Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import CodeExplorer from "./pages/CodeExplorer";
import AIChat from "./pages/AIChat";
import SemanticSearch from "./pages/SemanticSearch";
import Dependencies from "./pages/Dependencies";
import Analysis from "./pages/Analysis";
import Tests from "./pages/Tests";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Authentication Flow (wrapped in AuthLayout) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Onboarding Wizard */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Main Application Workspace (wrapped in AppLayout) */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />

              {/* Project-specific IDE tooling */}
              <Route path="/projects/:projectId/code" element={<ProjectWorkspace />} />
              <Route path="/projects/:projectId/workspace" element={<ProjectWorkspace />} />
              <Route path="/projects/:projectId/explorer" element={<CodeExplorer />} />
              <Route path="/projects/:projectId/chat" element={<AIChat />} />
              <Route path="/projects/:projectId/search" element={<SemanticSearch />} />
              <Route path="/projects/:projectId/dependencies" element={<Dependencies />} />
              <Route path="/projects/:projectId/analysis" element={<Analysis />} />
              <Route path="/projects/:projectId/tests" element={<Tests />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
