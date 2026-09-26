import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Terminal,
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
  Play
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/80 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 text-primary font-bold shadow-sm">
            <Terminal className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-semibold text-base tracking-tight text-foreground flex items-center gap-1.5">
            CodeMind <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-primary/20 text-primary rounded border border-primary/30">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#technology" className="hover:text-foreground transition-colors">Architecture</a>
          <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-accent/40 text-xs font-medium text-foreground transition-all shadow-sm"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Launch Live Demo</span>
          </button>
          <Link
            to="/register"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agentic AI & RAG Software Engineering Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-[1.15]">
          Understand Any Codebase With <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          An agentic software engineering assistant that performs AST semantic search, traces Neo4j dependency topologies, and reasons over code with LangGraph & Google Gemini.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLaunchDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-accent/60 text-foreground text-sm font-semibold transition-all shadow-sm"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>View Demo</span>
          </button>
        </div>

        {/* Hero Visual: Realistic IDE Workspace Mockup */}
        <div className="mt-14 w-full rounded-2xl border border-border/80 bg-card/90 shadow-2xl overflow-hidden text-left flex flex-col">
          <div className="h-10 bg-secondary/70 border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-muted-foreground">codemind-workspace — auth/security.py</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> ChromaDB Synced</span>
              <span>Neo4j Graph Active</span>
            </div>
          </div>

          <div className="grid grid-cols-12 min-h-[380px] text-xs">
            {/* Left: File Tree */}
            <div className="col-span-3 border-r border-border bg-sidebar/50 p-3 font-mono">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Explorer</div>
              <div className="space-y-1 text-muted-foreground">
                <div className="text-foreground flex items-center gap-1.5 font-medium">▼ app/</div>
                <div className="pl-3 space-y-1">
                  <div className="text-foreground flex items-center gap-1.5 font-medium">▼ auth/</div>
                  <div className="pl-3 text-primary flex items-center gap-1 font-semibold bg-primary/10 rounded px-1 py-0.5">
                    ● security.py
                  </div>
                  <div className="pl-3 hover:text-foreground">router.py</div>
                  <div className="text-foreground flex items-center gap-1.5 font-medium">▼ services/</div>
                  <div className="pl-3 hover:text-foreground">user_service.py</div>
                  <div className="pl-3 hover:text-foreground">payment_service.py</div>
                  <div className="hover:text-foreground">main.py</div>
                </div>
              </div>
            </div>

            {/* Center: Code View */}
            <div className="col-span-5 bg-background/80 p-4 font-mono overflow-x-auto text-[11px] leading-relaxed">
              <div className="text-muted-foreground flex gap-4">
                <span className="text-border select-none">12</span>
                <span className="text-purple-400">def</span> <span className="text-blue-400">verify_password</span>(plain_password: <span className="text-amber-300">str</span>, hashed: <span className="text-amber-300">str</span>) -&gt; <span className="text-amber-300">bool</span>:
              </div>
              <div className="text-muted-foreground flex gap-4">
                <span className="text-border select-none">13</span>
                <span className="text-muted-foreground">    salt_hex, key_hex = hashed.split(":")</span>
              </div>
              <div className="text-muted-foreground flex gap-4">
                <span className="text-border select-none">14</span>
                <span className="text-muted-foreground">    salt = bytes.fromhex(salt_hex)</span>
              </div>
              <div className="text-muted-foreground flex gap-4">
                <span className="text-border select-none">15</span>
                <span className="text-muted-foreground">    key = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100_000)</span>
              </div>
              <div className="text-muted-foreground flex gap-4 bg-primary/10 border-l-2 border-primary pl-1 -ml-1">
                <span className="text-border select-none">16</span>
                <span className="text-primary font-bold">    return hmac.compare_digest(key, bytes.fromhex(key_hex))</span>
              </div>
              <div className="text-muted-foreground flex gap-4 mt-4">
                <span className="text-border select-none">20</span>
                <span className="text-purple-400">def</span> <span className="text-blue-400">generate_access_token</span>(user_id: <span className="text-amber-300">str</span>, email: <span className="text-amber-300">str</span>):
              </div>
              <div className="text-muted-foreground flex gap-4">
                <span className="text-border select-none">21</span>
                <span className="text-muted-foreground">    expire = datetime.now(timezone.utc) + timedelta(minutes=60)</span>
              </div>
            </div>

            {/* Right: Agent Reasoning Panel */}
            <div className="col-span-4 border-l border-border bg-secondary/30 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BotMessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-xs text-foreground">LangGraph Agent Response</span>
                </div>
                <div className="p-2.5 rounded-lg bg-card border border-border/80 text-[11px] leading-relaxed text-muted-foreground space-y-2">
                  <p className="text-foreground font-medium">
                    "Authentication is implemented using salted PBKDF2-HMAC-SHA256 and verified through constant-time comparison."
                  </p>
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1">
                      Cited Sources:
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono text-[10px]">
                      auth/security.py:12-16
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Grounded in AST
                </span>
                <span>Latency: 280ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border bg-card/20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Engineered for Deep Code Intelligence
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Beyond simple token matching — CodeMind combines AST parsers, semantic vector search, and graph traversal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Code Search",
                desc: "Search your entire repository using natural language. Matches AST symbols, docstrings, and syntax signatures.",
                icon: Search
              },
              {
                title: "RAG-Powered Understanding",
                desc: "Retrieve relevant code before generating answers with ChromaDB vector search and semantic chunking.",
                icon: Database
              },
              {
                title: "Dependency Intelligence",
                desc: "Understand relationships between files, classes, and functions with Neo4j property graphs.",
                icon: Network
              },
              {
                title: "Agentic Analysis",
                desc: "LangGraph agents select tools and investigate problems through autonomous multi-step reasoning.",
                icon: Cpu
              },
              {
                title: "Code Explorer",
                desc: "Navigate your repository using an integrated developer workspace with Monaco code editor.",
                icon: Code2
              },
              {
                title: "Test Generation",
                desc: "Generate and analyze Pytest tests with isolated sandboxed execution.",
                icon: TestTube2
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 border-t border-border px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Autonomous Ingestion & Indexing Pipeline
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From repository connection to agentic reasoning in six deterministic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {[
              { step: "01", title: "Connect Repository", desc: "Connect GitHub repository, upload a ZIP codebase, or load the built-in demo repository." },
              { step: "02", title: "Index Codebase", desc: "Scan repository tree, filter build artifacts, and prepare AST parser queues." },
              { step: "03", title: "Build Code Knowledge", desc: "Extract symbols, functions, classes, and generate embeddings for ChromaDB and Neo4j." },
              { step: "04", title: "Ask AI", desc: "Interact with the LangGraph agent to ask architectural questions and trace flows." },
              { step: "05", title: "Explore Dependencies", desc: "Navigate interactive node-link call graphs and calculate blast radius risks." },
              { step: "06", title: "Analyze & Improve", desc: "Review AST security findings, identify code smells, and generate Pytest suites." },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-xl border border-border bg-card/40 flex flex-col justify-between">
                <div>
                  <span className="text-primary font-bold text-sm tracking-wider">{item.step}</span>
                  <h4 className="font-semibold text-foreground text-xs mt-2 mb-1.5 font-sans">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-[11px] font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 border-t border-border bg-card/20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-8">
            Powered by Production-Grade Software Technologies
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-xs text-foreground">
            {["Python", "FastAPI", "React", "JavaScript", "LangChain", "LangGraph", "Gemini", "ChromaDB", "Neo4j", "PostgreSQL", "Docker", "Pytest"].map((tech) => (
              <div key={tech} className="px-3.5 py-1.5 rounded-lg border border-border bg-card/80 font-medium">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">CodeMind AI</span>
            <span>— AI Codebase Assistant</span>
          </div>
          <div>Portfolio project designed for senior software engineering interviews.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
