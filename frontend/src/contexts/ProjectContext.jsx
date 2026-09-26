import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeFilePath, setActiveFilePath] = useState("auth/security.py");
  const [isIndexing, setIsIndexing] = useState(false);

  const refreshProjects = async () => {
    try {
      const list = await api.get("/projects");
      setProjects(list);
      if (list.length > 0 && !activeProject) {
        setActiveProject(list[0]);
      }
    } catch {
      const defaultProj = {
        id: "demo-project-id",
        name: "Demo Microservice",
        description: "Enterprise authentication, user entities, and payment processing service",
        primary_language: "python",
        index_status: "COMPLETED",
        file_count: 6,
        chunk_count: 14,
        last_indexed_at: new Date().toISOString()
      };
      setProjects([defaultProj]);
      if (!activeProject) {
        setActiveProject(defaultProj);
      }
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const createDemoProject = async () => {
    setIsIndexing(true);
    try {
      const proj = await api.post("/projects", {
        name: "Demo Microservice",
        description: "Production enterprise authentication and payment service",
        source_type: "DEMO"
      });
      await refreshProjects();
      setActiveProject(proj);
      setIsIndexing(false);
      return proj;
    } catch {
      const fallback = {
        id: "demo-project-id",
        name: "Demo Microservice",
        description: "Production enterprise authentication and payment service",
        primary_language: "python",
        index_status: "COMPLETED",
        file_count: 6,
        chunk_count: 14
      };
      setActiveProject(fallback);
      setProjects((prev) => [fallback, ...prev]);
      setIsIndexing(false);
      return fallback;
    }
  };

  const createProject = async (data) => {
    setIsIndexing(true);
    try {
      const proj = await api.post("/projects", data);
      await refreshProjects();
      setActiveProject(proj);
      setIsIndexing(false);
      return proj;
    } catch (err) {
      setIsIndexing(false);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        currentProject: activeProject,
        setActiveProject,
        activeFilePath,
        setActiveFilePath,
        refreshProjects,
        createDemoProject,
        createProject,
        isIndexing
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
