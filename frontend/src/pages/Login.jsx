import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

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
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold shadow-sm mb-3">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Sign in to CodeMind AI</h2>
          <p className="text-xs text-muted-foreground mt-1">Autonomous Codebase Intelligence Platform</p>
        </div>

        {/* Demo Fast-Pass Banner */}
        <div className="mb-5 p-3 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-muted-foreground font-medium">Interviewing or reviewing?</span>
          </div>
          <button
            onClick={handleQuickDemo}
            className="px-2.5 py-1 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            1-Click Demo
          </button>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Continue with Demo Account</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
