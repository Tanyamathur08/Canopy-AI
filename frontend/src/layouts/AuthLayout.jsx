import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
