import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Leaf } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import { CanopyLogo } from "../components/common/CanopyLogo";

export const Login = () => {
  const [email, setEmail] = useState("demo@codemind.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { createDemoProject } = useProject();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to authenticate. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      await login("demo@codemind.ai", "password123");
      await createDemoProject();
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="mb-4 hover:opacity-90 transition-opacity">
            <CanopyLogo size="lg" showText={false} />
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-content-primary">
            Sign in to Canopy AI
          </h2>
          <p className="text-xs text-content-secondary mt-1">
            AI Codebase Intelligence Platform
          </p>
        </div>

        {/* Demo Fast-Pass Banner */}
        <div className="mb-5 p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/80 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-900 font-medium">Interviewing or reviewing?</span>
          </div>
          <button
            onClick={handleQuickDemo}
            className="px-3 py-1 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            1-Click Demo
          </button>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl border border-border bg-surface-elevated shadow-lg">
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-content-primary mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-content-primary">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-content-muted hover:text-content-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-accent-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-lg border border-border bg-surface-subtle hover:bg-emerald-50 text-content-primary font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Explore as Guest (1-Click)</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center text-xs text-content-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
