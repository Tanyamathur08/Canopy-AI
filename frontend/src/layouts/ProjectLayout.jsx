import React from "react";
import { Outlet } from "react-router-dom";

export const ProjectLayout = () => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <Outlet />
    </div>
  );
};

export default ProjectLayout;
