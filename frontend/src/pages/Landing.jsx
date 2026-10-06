import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  BotMessageSquare,
  Network,
  Code2,
  TestTube2,
  ArrowRight,
  Sparkles,
  Cpu,
  Database,
  CheckCircle2,
  Play,
  Leaf,
  Layers,
  ShieldAlert,
  GitBranch
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import { CanopyLogo } from "../components/common/CanopyLogo";

export const Landing = () => {
  const navigate = useNavigate();
  const { quickFillDemo } = useAuth();
  const { createDemoProject } = useProject();

  const handleLaunchDemo = async () => {
    await quickFillDemo();
    await createDemoProject();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-500/20 selection:text-amber-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/80 px-6 h-16 flex items-center justify-between shadow-xs">
        <Link to="/" className="flex items-center gap-2">
          <CanopyLogo size="md" showText={true} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-content-secondary">
          <a href="#features" className="hover:text-primary transition-colors">Ecosystem Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Grows</a>
          <a href="#technology" className="hover:text-primary transition-colors">Architecture</a>
          <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-elevated hover:bg-surface-subtle text-xs font-medium text-content-primary transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Launch Live Demo</span>
          </button>
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Code Branching Canopy Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-300 dark:border-amber-600/40 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-6 shadow-2xs">
          <GitBranch className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>AI Codebase Intelligence & Code Branching Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-content-primary max-w-4xl leading-[1.15]">
          Cultivate & Understand Any Codebase With{" "}
          <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
            Canopy AI Intelligence
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-content-secondary max-w-2xl leading-relaxed font-normal">
          From git commit roots to branching code canopies, <strong>Canopy AI</strong> weaves semantic AST retrieval, knowledge graphs, and agent reasoning into a luminous, high-velocity developer ecosystem.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-accent-hover text-white text-sm font-semibold shadow-md shadow-amber-600/20 transition-all"
          >
            <span>Start Exploring Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLaunchDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface-subtle text-content-primary text-sm font-semibold transition-all shadow-xs"
          >
            <Play className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>Explore Demo Microservice</span>
          </button>
        </div>

        {/* Hero Interactive IDE Mockup (Bright Theme) */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border border-border bg-surface-elevated shadow-xl overflow-hidden text-left">
          {/* Window Chrome */}
          <div className="h-10 bg-surface-subtle border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-mono text-content-muted">
                canopy-workspace / auth / security.py
              </span>
            </div>
            <div className="flex items-center gap-3 text-2xs font-mono text-content-muted">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-sans font-semibold">
                ● AST Knowledge Tree Active
              </span>
            </div>
          </div>

          {/* IDE 3-Pane Preview */}
          <div className="grid grid-cols-12 h-84 font-mono text-xs">
            {/* Tree Branch Nav */}
            <div className="col-span-3 border-r border-border bg-surface-subtle/50 p-3 space-y-1.5 select-none">
              <div className="text-[10px] uppercase font-bold text-content-muted tracking-wider mb-2">
                Knowledge Roots
              </div>
              <div className="text-content-muted text-2xs flex items-center gap-1.5 pl-1">
                <span>📁</span> <span>auth/</span>
              </div>
              <div className="bg-emerald-100 text-emerald-900 font-semibold rounded px-2 py-1 flex items-center gap-1.5 text-2xs border border-emerald-300">
                <Leaf className="w-3 h-3 text-emerald-700" />
                <span>security.py</span>
              </div>
              <div className="text-content-muted text-2xs flex items-center gap-1.5 pl-1">
                <span>📁</span> <span>services/</span>
              </div>
              <div className="text-content-secondary text-2xs flex items-center gap-1.5 pl-4">
                <span>📄</span> <span>user_service.py</span>
              </div>
              <div className="text-content-secondary text-2xs flex items-center gap-1.5 pl-4">
                <span>📄</span> <span>payment_service.py</span>
              </div>
              <div className="text-content-muted text-2xs flex items-center gap-1.5 pl-1">
                <span>📁</span> <span>tests/</span>
              </div>
            </div>

            {/* Code Body */}
            <div className="col-span-5 p-4 bg-surface-elevated overflow-hidden leading-relaxed text-content-secondary border-r border-border">
              <div className="text-content-muted italic"># Canopy AI Grounded AST Chunk [Lines 14-28]</div>
              <div><span className="text-emerald-700 font-bold">def</span> <span className="text-teal-700 font-bold">verify_token</span>(token: <span className="text-amber-700">str</span>):</div>
              <div className="pl-4 text-content-muted">"""Validates signature & unpacks claims."""</div>
              <div className="pl-4"><span className="text-emerald-700 font-bold">try</span>:</div>
              <div className="pl-8">payload = jwt.decode(token, SECRET_KEY)</div>
              <div className="pl-8"><span className="text-emerald-700 font-bold">return</span> TokenPayload(**payload)</div>
              <div className="pl-4"><span className="text-emerald-700 font-bold">except</span> JWTError <span className="text-emerald-700 font-bold">as</span> exc:</div>
              <div className="pl-8"><span className="text-emerald-700 font-bold">raise</span> CredentialsException()</div>
            </div>

            {/* Agent Live Thought Stream */}
            <div className="col-span-4 p-4 bg-emerald-50/40 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Canopy Agent Reasoning</span>
                </div>
                <div className="space-y-1 text-2xs font-mono">
                  <div className="p-1.5 rounded bg-surface-elevated border border-emerald-200 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Scanned AST for verify_token</span>
                  </div>
                  <div className="p-1.5 rounded bg-surface-elevated border border-emerald-200 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Traversed 4 callers in Neo4j</span>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                    <span>Synthesizing verified explanation...</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-content-muted font-sans italic border-t border-emerald-200 pt-2">
                "Token verification uses standard HMAC-SHA256 with 2-level dependency callers in UserService."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border bg-surface-subtle/50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
              Engineered for Deep Code Ecosystem Intelligence
            </h2>
            <p className="mt-2 text-sm text-content-secondary">
              Beyond superficial token matching — Canopy AI grounds every answer in deterministic AST parsing, ChromaDB semantic vectors, and Neo4j call graph topologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Semantic Code Search",
                desc: "Search your entire repository using natural language. Matches AST symbols, docstrings, and syntax signatures with dense embeddings.",
                icon: Search
              },
              {
                title: "RAG-Powered Understanding",
                desc: "Retrieve precise semantic code chunks before generating answers with ChromaDB vector search and deterministic fallback.",
                icon: Database
              },
              {
                title: "Neo4j Dependency Canopy",
                desc: "Explore relationships between files, classes, and functions with interactive call hierarchies and blast-radius risk calculations.",
                icon: Network
              },
              {
                title: "Agentic LangGraph Reasoning",
                desc: "Multi-step autonomous agents select tools, inspect source trees, and synthesize verified explanations over real-time SSE streams.",
                icon: Cpu
              },
              {
                title: "Monaco Code Explorer",
                desc: "Navigate your repository in a bright, clean developer workspace equipped with Monaco Editor and contextual AI code actions.",
                icon: Code2
              },
              {
                title: "Pytest Suite Automation",
                desc: "Generate idiomatic Pytest cases, run test suites in sandbox runners, and stream terminal logs directly inside the browser.",
                icon: TestTube2
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-border bg-surface-elevated hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-content-primary mb-2">{feature.title}</h3>
                    <p className="text-xs text-content-secondary leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 border-t border-border px-6 bg-surface-elevated">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
              Autonomous Ingestion & Indexing Pipeline
            </h2>
            <p className="mt-2 text-sm text-content-secondary">
              From repository ingestion to agentic reasoning in six deterministic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {[
              { step: "01", title: "Plant Codebase", desc: "Connect GitHub repository, upload a ZIP codebase, or initialize with the built-in reference microservice." },
              { step: "02", title: "Harvest File Tree", desc: "Scan repository tree, filter build artifacts, and prepare AST parser queues with safety traversal guards." },
              { step: "03", title: "Grow Knowledge Graph", desc: "Extract AST symbols, functions, classes, and generate embeddings for ChromaDB and Neo4j call graphs." },
              { step: "04", title: "Converse With Agent", desc: "Interact with the LangGraph agent to ask architectural questions, trace data flows, and explore bugs." },
              { step: "05", title: "Explore Canopy Topologies", desc: "Navigate interactive node-link dependency graphs and calculate change blast-radius risks." },
              { step: "06", title: "Audit & Cultivate", desc: "Review AST static security findings, detect code smells, and synthesize regression Pytest suites." },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-2xl border border-border bg-surface-subtle/50 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <div>
                  <span className="text-emerald-700 font-bold text-sm tracking-wider">{item.step}</span>
                  <h4 className="font-bold text-content-primary text-xs mt-2 mb-1.5 font-sans">{item.title}</h4>
                  <p className="text-content-secondary leading-relaxed text-[11px] font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 border-t border-border bg-surface-subtle/40 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-content-muted mb-8">
            Powered by Production-Grade Software Technologies
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-xs text-content-primary">
            {["Python 3.11+", "FastAPI", "React 19", "JavaScript (ES6+)", "LangGraph", "Google Gemini", "ChromaDB", "Neo4j", "PostgreSQL", "Docker", "Pytest"].map((tech) => (
              <div key={tech} className="px-3.5 py-1.5 rounded-lg border border-border bg-surface-elevated shadow-2xs font-semibold hover:border-emerald-300 transition-colors">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 text-center text-xs text-content-muted bg-surface-elevated">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CanopyLogo size="sm" showText={true} />
            <span className="text-content-muted">— AI Codebase Assistant</span>
          </div>
          <div>Portfolio project engineered for senior software engineering & AI interviews.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
