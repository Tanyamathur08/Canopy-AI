import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Leaf,
  Check,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, login } = useAuth();
  const { createDemoProject } = useProject();
  const navigate = useNavigate();

  // Real-time Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Real-time Password Strength Meter calculation
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-border" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass) || /[A-Z]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-teal-500", text: "text-teal-500" };
      case 4:
      default:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
    }
  };

  const strength = calculatePasswordStrength(password);
  const isConfirmMatching = confirmPassword.length > 0 && confirmPassword === password;
  const isConfirmMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Failed to create account.");
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
    <div className="w-full rounded-3xl border border-border/80 bg-surface-elevated/95 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden transition-all">
      {/* Subtle Top Card Stream Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] river-stream-line opacity-90" />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80 mb-6 select-none">
        <Link
          to="/login"
          className="flex-1 py-1.5 px-3 rounded-lg text-content-muted hover:text-content-primary font-medium text-xs text-center transition-colors"
        >
          Sign In
        </Link>
        <div className="flex-1 py-1.5 px-3 rounded-lg bg-surface-elevated text-content-primary font-bold text-xs text-center shadow-xs border border-border/60">
          Create Account
        </div>
      </div>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary">
          Join Canopy AI
        </h2>
        <p className="text-xs text-content-secondary mt-1">
          Start exploring your codebase ecosystem for free.
        </p>
      </div>

      {/* Recruiter / Reviewer Fast-Pass Banner */}
      <div className="mb-5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs">
              Reviewer Fast-Pass
            </div>
            <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 hidden sm:block">
              Skip setup with 1-click live demo
            </div>
          </div>
        </div>
        <button
          onClick={handleQuickDemo}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>1-Click Demo</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-content-primary mb-1">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full pl-9 pr-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Work Email with Format Validation */}
        <div>
          <label className="block text-xs font-semibold text-content-primary mb-1">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
              className="w-full pl-9 pr-9 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {isEmailValid && (
              <span className="absolute right-3 top-2.5 text-emerald-500 animate-fadeIn" title="Valid email format">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        {/* Password Field with Interactive Strength Meter */}
        <div>
          <label className="block text-xs font-semibold text-content-primary mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-9 pr-9 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-content-muted hover:text-content-primary cursor-pointer transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive 4-Bar Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-1.5 space-y-1 animate-fadeIn">
              <div className="flex items-center gap-1.5 h-1.5 w-full">
                <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 1 ? strength.color : "bg-border/60"}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 2 ? strength.color : "bg-border/60"}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 3 ? strength.color : "bg-border/60"}`} />
                <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 4 ? strength.color : "bg-border/60"}`} />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-content-muted">Security strength:</span>
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password with Live Matching State */}
        <div>
          <label className="block text-xs font-semibold text-content-primary mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-9 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
            {isConfirmMatching && (
              <span className="absolute right-3 top-2.5 text-emerald-500 animate-fadeIn" title="Passwords match">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>
          {isConfirmMismatch && (
            <p className="text-[10px] text-destructive mt-1 font-mono">
              Passwords do not match yet
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-1"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Planting workspace...</span>
            </div>
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Social / Developer Alternative Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="w-full border-t border-border/80" />
          <span className="absolute px-3 bg-surface-elevated text-[11px] font-mono text-content-muted">
            or continue with
          </span>
        </div>

        {/* Quick Social / Guest Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="py-2 px-3 rounded-xl border border-border bg-surface-base hover:bg-surface-subtle text-content-primary font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-2xs hover:border-emerald-500/40 cursor-pointer"
          >
            {/* Inline GitHub SVG */}
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="truncate">GitHub</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="py-2 px-3 rounded-xl border border-border bg-surface-base hover:bg-surface-subtle text-content-primary font-medium text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-emerald-500/40 cursor-pointer"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Guest Pass</span>
          </button>
        </div>
      </form>

      {/* Footer Switch */}
      <div className="mt-5 pt-4 border-t border-border/80 text-center text-xs text-content-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
