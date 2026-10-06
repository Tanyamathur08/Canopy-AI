import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full rounded-3xl border border-border/80 bg-surface-elevated/95 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden transition-all">
      {/* Subtle Top Card Stream Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] river-stream-line opacity-90" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary">
          Reset password
        </h2>
        <p className="text-xs text-content-secondary mt-1">
          Enter your work email and we'll send you recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          </div>
          <p className="text-xs text-content-secondary">
            If an account exists for <span className="font-semibold text-content-primary">{email}</span>, a recovery link has been dispatched.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Return to Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-content-primary mb-1.5">
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
                className="w-full pl-9 pr-3 py-2 bg-surface-base border border-border rounded-xl text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-[0.99] cursor-pointer"
          >
            <span>Send Recovery Instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center text-xs text-content-muted">
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
