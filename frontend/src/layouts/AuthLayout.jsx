import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  GitBranch,
  Waves,
  Cpu,
  Database,
  CheckCircle2,
  Play,
  Terminal,
  Activity,
  ShieldCheck,
  Code2,
  Boxes,
  Zap,
  ArrowRight
} from "lucide-react";
import { CanopyLogo } from "../components/common/CanopyLogo";

export const AuthLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ast");
  const [selectedSymbol, setSelectedSymbol] = useState("verify_token");
  const [packetCount, setPacketCount] = useState(148);
  const [isSimulating, setIsSimulating] = useState(false);
  const [agentStep, setAgentStep] = useState(4);

  // Periodic simulated packet flow increment
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateBurst = () => {
    setIsSimulating(true);
    setPacketCount((prev) => prev + 24);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  const handleRerunAgent = () => {
    setAgentStep(1);
    setTimeout(() => setAgentStep(2), 600);
    setTimeout(() => setAgentStep(3), 1200);
    setTimeout(() => setAgentStep(4), 1800);
  };

  const symbolDetails = {
    verify_token: {
      type: "Async Function",
      file: "auth/security.py",
      depth: "AST Depth 3",
      callers: 4,
      complexity: "Cyclomatic: 2 (Clean)",
      callees: ["jwt.decode", "TokenPayload"],
      status: "Verified Safe"
    },
    TokenPayload: {
      type: "Pydantic Model",
      file: "schemas/token.py",
      depth: "AST Depth 2",
      callers: 9,
      complexity: "Strict Schema Validation",
      callees: ["BaseModel"],
      status: "Type-Checked"
    },
    SECRET_KEY: {
      type: "Configuration Constant",
      file: "core/config.py",
      depth: "AST Root Level",
      callers: 6,
      complexity: "Environment Variable (.env)",
      callees: ["os.getenv"],
      status: "Vault Guarded"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/25 selection:text-emerald-900 dark:selection:text-emerald-200 relative overflow-x-hidden">
      {/* Top Subtle Animated Flowing Stream Line */}
      <div className="w-full h-[2.5px] river-stream-line opacity-75 shrink-0" />

      {/* Atmospheric Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* ================= LEFT COLUMN: Interactive Developer Showcase ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Brand Header */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 hover:opacity-95 transition-opacity group">
                <CanopyLogo size="lg" showText={false} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                      Canopy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                      AI
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-teal-600 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Live Ecosystem
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 tracking-tight">
                    Understand your codebase. Not just your code.
                  </p>
                </div>
              </Link>

              <h1 className="mt-5 text-2xl sm:text-4xl font-extrabold tracking-tight text-content-primary leading-[1.2]">
                Architectural intelligence for developers who build at speed.
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-content-secondary max-w-xl leading-relaxed">
                Connect your repository to map Abstract Syntax Trees, trace data flow currents in real-time, and reason over your entire codebase with zero hallucinations.
              </p>
            </div>

            {/* Interactive Showcase Interactive Console */}
            <div className="rounded-2xl border border-border/80 bg-surface-elevated shadow-xl overflow-hidden text-left relative">
              {/* Console Chrome Tabs */}
              <div className="h-11 bg-surface-subtle/80 border-b border-border px-3 sm:px-4 flex items-center justify-between gap-2 select-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-[11px] font-mono text-content-muted hidden sm:inline">
                    canopy-engine // interactive-preview
                  </span>
                </div>

                {/* Interactive Feature Switcher Tabs */}
                <div className="flex items-center gap-1 bg-surface-base p-1 rounded-lg border border-border/80 text-xs font-mono">
                  <button
                    onClick={() => setActiveTab("ast")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "ast"
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30 shadow-2xs"
                        : "text-content-muted hover:text-content-primary"
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>AST Tree</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("river")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "river"
                        ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/30 shadow-2xs"
                        : "text-content-muted hover:text-content-primary"
                    }`}
                  >
                    <Waves className="w-3 h-3" />
                    <span>River Flow</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("agent")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === "agent"
                        ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/30 shadow-2xs"
                        : "text-content-muted hover:text-content-primary"
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Agent Stream</span>
                  </button>
                </div>
              </div>

              {/* Console Body Area */}
              <div className="p-4 sm:p-5 font-mono text-xs min-h-[220px] flex flex-col justify-between">
                {/* 1. AST Tree Interactive View */}
                {activeTab === "ast" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-2xs text-content-muted pb-2 border-b border-border/60">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Click any symbol to inspect real-time AST topology:
                      </span>
                      <span className="hidden sm:inline font-mono">auth/security.py:L14-28</span>
                    </div>

                    {/* Interactive Code Editor Block */}
                    <div className="p-3 rounded-lg bg-surface-base border border-border/70 text-content-secondary leading-relaxed">
                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">async def </span>
                        <button
                          onClick={() => setSelectedSymbol("verify_token")}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                            selectedSymbol === "verify_token"
                              ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 font-bold underline ring-1 ring-emerald-500"
                              : "hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 underline decoration-dotted"
                          }`}
                        >
                          verify_token
                        </button>
                        <span>(token: str):</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-content-muted">payload = jwt.decode(token, </span>
                        <button
                          onClick={() => setSelectedSymbol("SECRET_KEY")}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                            selectedSymbol === "SECRET_KEY"
                              ? "bg-teal-500/25 text-teal-800 dark:text-teal-200 font-bold underline ring-1 ring-teal-500"
                              : "hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 underline decoration-dotted"
                          }`}
                        >
                          SECRET_KEY
                        </button>
                        <span className="text-content-muted">)</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">return </span>
                        <button
                          onClick={() => setSelectedSymbol("TokenPayload")}
                          className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                            selectedSymbol === "TokenPayload"
                              ? "bg-sky-500/25 text-sky-800 dark:text-sky-200 font-bold underline ring-1 ring-sky-500"
                              : "hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 underline decoration-dotted"
                          }`}
                        >
                          TokenPayload
                        </button>
                        <span>(**payload)</span>
                      </div>
                    </div>

                    {/* Active AST Symbol Inspector Card */}
                    {selectedSymbol && symbolDetails[selectedSymbol] && (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-content-primary">{selectedSymbol}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                              {symbolDetails[selectedSymbol].type}
                            </span>
                            <span className="text-[11px] text-content-muted">{symbolDetails[selectedSymbol].file}</span>
                          </div>
                          <div className="text-[11px] text-content-muted mt-0.5">
                            {symbolDetails[selectedSymbol].depth} • Callers:{" "}
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {symbolDetails[selectedSymbol].callers} references
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          ● {symbolDetails[selectedSymbol].status}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. River Flow Live Stream View */}
                {activeTab === "river" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-2xs text-content-muted pb-1 border-b border-border/60">
                      <span className="text-teal-600 dark:text-teal-300 flex items-center gap-1.5">
                        <Waves className="w-3.5 h-3.5 animate-pulse" />
                        <span>Continuous Data Flow Stream</span>
                      </span>
                      <button
                        onClick={handleSimulateBurst}
                        disabled={isSimulating}
                        className="px-2 py-0.5 rounded bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] cursor-pointer transition-colors"
                      >
                        {isSimulating ? "Streaming..." : "⚡ Pulse Stream"}
                      </button>
                    </div>

                    {/* Flowing River Pipeline Stages */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs">
                      <div className="p-2.5 rounded-lg bg-surface-base border border-border flex flex-col justify-between">
                        <span className="text-content-muted">01. Ingress</span>
                        <span className="font-bold text-content-primary truncate">POST /auth/login</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold mt-1">0.8ms</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-base border border-border flex flex-col justify-between">
                        <span className="text-content-muted">02. AST Guard</span>
                        <span className="font-bold text-content-primary truncate">verify_token()</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold mt-1">1.2ms</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-base border border-border flex flex-col justify-between">
                        <span className="text-content-muted">03. Vector RAG</span>
                        <span className="font-bold text-content-primary truncate">ChromaDB Query</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold mt-1">2.4ms</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-base border border-border flex flex-col justify-between">
                        <span className="text-content-muted">04. Graph Call</span>
                        <span className="font-bold text-content-primary truncate">Neo4j Topo</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold mt-1">1.1ms</span>
                      </div>
                    </div>

                    {/* Subtle Animated Flowing Stream Divider */}
                    <div className="w-full river-stream-line rounded-full opacity-80" />

                    <div className="flex items-center justify-between text-2xs text-content-muted pt-1">
                      <span>Stream Throughput: 100% Trace Coverage</span>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">
                        {packetCount} active events processed
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Agent Stream Terminal View */}
                {activeTab === "agent" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-2xs text-content-muted pb-1 border-b border-border/60">
                      <span className="text-sky-600 dark:text-sky-300 flex items-center gap-1.5">
                        <Terminal className="w-3 h-3" />
                        <span>LangGraph Agent Autonomous Execution</span>
                      </span>
                      <button
                        onClick={handleRerunAgent}
                        className="px-2 py-0.5 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-[10px] cursor-pointer transition-colors"
                      >
                        Replay Reasoning
                      </button>
                    </div>

                    {/* Terminal Execution Steps */}
                    <div className="space-y-1.5 text-2xs font-mono">
                      <div className={`p-2 rounded bg-surface-base border border-border/70 flex items-center gap-2 ${agentStep >= 1 ? "opacity-100" : "opacity-40"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>[Step 1] Indexed 1,420 AST code definitions in repository tree</span>
                      </div>
                      <div className={`p-2 rounded bg-surface-base border border-border/70 flex items-center gap-2 ${agentStep >= 2 ? "opacity-100" : "opacity-40"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>[Step 2] Wove Neo4j call graph: 8,910 caller/callee relationships</span>
                      </div>
                      <div className={`p-2 rounded bg-surface-base border border-border/70 flex items-center gap-2 ${agentStep >= 3 ? "opacity-100" : "opacity-40"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>[Step 3] Vector store: Cosine similarity 0.942 on grounded AST chunks</span>
                      </div>
                      <div className={`p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200 ${agentStep >= 4 ? "opacity-100" : "opacity-40"}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span>[Ready] Synthesized verified answer with 0 token hallucination</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Proof Metric Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-border/80 bg-surface-elevated flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-content-primary">45,000+</span>
                <span className="text-[11px] text-content-muted font-medium mt-0.5">AST Symbols Parsed</span>
              </div>
              <div className="p-3 rounded-xl border border-border/80 bg-surface-elevated flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 15ms</span>
                <span className="text-[11px] text-content-muted font-medium mt-0.5">RAG Query Latency</span>
              </div>
              <div className="p-3 rounded-xl border border-border/80 bg-surface-elevated flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-teal-600 dark:text-teal-400">100%</span>
                <span className="text-[11px] text-content-muted font-medium mt-0.5">Deterministic Graph</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Interactive Form Card ================= */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Assurance Bar */}
      <footer className="border-t border-border/60 py-4 px-6 text-center text-[11px] text-content-muted bg-surface-subtle/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Deterministic AST Sandboxing • 256-Bit TLS • Zero Code Retention</span>
          </div>
          <div>Canopy AI — Understand your codebase. Not just your code.</div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
