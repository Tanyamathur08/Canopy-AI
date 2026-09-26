import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { CanopyLogo } from "../components/common/CanopyLogo";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="mb-4 hover:opacity-90 transition-opacity">
            <CanopyLogo size="lg" showText={false} />
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-content-primary">Reset Password</h2>
          <p className="text-xs text-content-secondary mt-1">We'll send you recovery instructions</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface-elevated shadow-lg">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <p className="text-xs text-content-secondary">
                If an account exists for <span className="font-semibold text-content-primary">{email}</span>, a recovery link has been dispatched.
              </p>
              <Link to="/login" className="inline-block text-xs text-primary font-semibold hover:underline">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1.5">Email address</label>
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

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-accent-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center text-xs text-content-muted">
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
