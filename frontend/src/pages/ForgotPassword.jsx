import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold shadow-sm mb-3">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Reset Password</h2>
          <p className="text-xs text-muted-foreground mt-1">We'll send you recovery instructions</p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-xl">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                If an account exists for <span className="font-semibold text-foreground">{email}</span>, a recovery link has been dispatched.
              </p>
              <Link to="/login" className="inline-block text-xs text-primary font-semibold hover:underline">
                Return to Login
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center text-xs text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
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
