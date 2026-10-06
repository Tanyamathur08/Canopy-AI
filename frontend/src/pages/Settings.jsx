import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Settings as SettingsIcon,
  Sliders,
  Cpu,
  Database,
  Key,
  Shield,
  Save,
  CheckCircle2,
  Trash2,
  FileCode,
  Sparkles,
  Info,
  Sun,
  Moon
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Model & Agent Settings
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.2);
  const [topKChunks, setTopKChunks] = useState(5);
  const [geminiApiKey, setGeminiApiKey] = useState("");

  // Ignore patterns
  const [ignorePatterns, setIgnorePatterns] = useState(
    ".git\nnode_modules\n__pycache__\n.venv\nenv\ndist\nbuild\n*.pyc\n*.log"
  );

  // Status
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "codemind_settings",
      JSON.stringify({
        selectedModel,
        temperature,
        topKChunks,
        ignorePatterns
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearCache = () => {
    if (window.confirm("Clear local cache and agent memory session state?")) {
      sessionStorage.clear();
      alert("Local session cache cleared.");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-surface-base text-content-primary p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border-base pb-4">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-accent-primary" />
            <h1 className="text-xl font-semibold text-content-primary">System & Agent Preferences</h1>
          </div>
          <p className="text-xs text-content-muted mt-1">
            Configure Google Gemini LLM reasoning models, RAG vector retrieval top-K, and indexing rules. Understand your codebase. Not just your code.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-sm"
        >
          {savedSuccess ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {savedSuccess ? "Saved Settings" : "Save Changes"}
        </button>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* User Profile Card */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5">
          <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-accent-primary" />
            User Identity & Session
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs text-content-muted font-medium mb-1">Full Name</label>
              <div className="bg-surface-base border border-border-base rounded px-3 py-2 text-xs font-medium text-content-primary">
                {user?.full_name || "Demo Engineer"}
              </div>
            </div>
            <div>
              <label className="block text-2xs text-content-muted font-medium mb-1">Email Address</label>
              <div className="bg-surface-base border border-border-base rounded px-3 py-2 text-xs font-mono text-content-secondary">
                {user?.email || "demo@codemind.ai"}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance & Theme Section */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5">
          <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-accent-primary" />
            Interface Theme & Appearance
          </h2>
          <p className="text-xs text-content-muted mb-4">
            Personalize your workspace palette. Choose between Warm Parchment Light mode or Sunset Amber & Bronze Dark mode.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                theme === "light"
                  ? "border-amber-600 bg-amber-500/10 shadow-sm ring-2 ring-amber-500/20"
                  : "border-border-base bg-surface-base hover:border-border-hover"
              }`}
            >
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-content-primary">Warm Parchment (Light)</span>
                  {theme === "light" && (
                    <span className="px-2 py-0.5 rounded-full text-3xs font-semibold bg-amber-600 text-white">Active</span>
                  )}
                </div>
                <p className="text-2xs text-content-muted mt-1 leading-relaxed">
                  Warm alabaster and sand palette with radiant copper and sunset amber accents. Soft on the eyes in daylight.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                theme === "dark"
                  ? "border-amber-500 bg-amber-500/10 shadow-sm ring-2 ring-amber-500/20"
                  : "border-border-base bg-surface-base hover:border-border-hover"
              }`}
            >
              <div className="p-2.5 rounded-lg bg-stone-900 text-amber-400 shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-content-primary">Sunset Amber & Bronze (Dark)</span>
                  {theme === "dark" && (
                    <span className="px-2 py-0.5 rounded-full text-3xs font-semibold bg-amber-600 text-white">Active</span>
                  )}
                </div>
                <p className="text-2xs text-content-muted mt-1 leading-relaxed">
                  Deep dark mahogany slate with radiant warm copper and golden amber illumination. Premium nocturnal development.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* AI Model & Reasoning Engine */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-accent-primary" />
            Gemini Agent Configuration
          </h2>

          <div className="space-y-4">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Primary Foundation Model
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedModel("gemini-1.5-pro")}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedModel === "gemini-1.5-pro"
                      ? "border-accent-primary bg-accent-primary/10"
                      : "border-border-base bg-surface-base hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-content-primary">
                      gemini-1.5-pro
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-3xs font-mono bg-accent-primary/20 text-accent-primary">
                      Recommended
                    </span>
                  </div>
                  <p className="text-2xs text-content-muted mt-1.5">
                    2M context window. Optimized for complex cross-file code reasoning, refactors, and graph path tracing.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedModel("gemini-1.5-flash")}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedModel === "gemini-1.5-flash"
                      ? "border-accent-primary bg-accent-primary/10"
                      : "border-border-base bg-surface-base hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-content-primary">
                      gemini-1.5-flash
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-3xs font-mono bg-surface-subtle text-content-muted">
                      High Speed
                    </span>
                  </div>
                  <p className="text-2xs text-content-muted mt-1.5">
                    Sub-second time-to-first-token. High throughput for rapid query answering and instant code search.
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-content-secondary mb-1">
                <span>Sampling Temperature: <span className="font-mono text-accent-primary">{temperature}</span></span>
                <span className="text-2xs text-content-muted font-mono">0.0 (Strict Code) — 1.0 (Creative)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-accent-primary bg-surface-base cursor-pointer"
              />
            </div>

            {/* Top-K Retrieval Chunks */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-content-secondary mb-1">
                <span>RAG Retrieval Depth (Top-K Chunks): <span className="font-mono text-accent-primary">{topKChunks}</span></span>
                <span className="text-2xs text-content-muted font-mono">1 – 20 Semantic Units</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={topKChunks}
                onChange={(e) => setTopKChunks(parseInt(e.target.value))}
                className="w-full accent-accent-primary bg-surface-base cursor-pointer"
              />
            </div>

            {/* Gemini API Key Override */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1">
                Custom Gemini API Key (Optional)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
                  <input
                    type="password"
                    placeholder="AIzaSy... (leave blank to use server environment default)"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full bg-surface-base border border-border-base rounded pl-9 pr-3 py-1.5 text-xs text-content-primary font-mono focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
              <p className="text-2xs text-content-muted mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Canopy AI includes a built-in deterministic fallback for 100% offline functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Indexing Rules & Ignore Patterns */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5 space-y-3">
          <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-accent-primary" />
            File Ingestion & Ignore Filters
          </h2>
          <p className="text-xs text-content-muted">
            Glob patterns excluded during repository indexing to prevent vector database pollution.
          </p>
          <textarea
            rows={5}
            value={ignorePatterns}
            onChange={(e) => setIgnorePatterns(e.target.value)}
            className="w-full bg-surface-base border border-border-base rounded p-3 text-xs font-mono text-content-secondary focus:outline-none focus:border-accent-primary leading-relaxed"
          />
        </div>

        {/* Database & Storage Status */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5">
          <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-accent-primary" />
            Backend Infrastructure Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-surface-base border border-border-base rounded p-3">
              <div className="text-2xs text-content-muted font-medium">Relational DB</div>
              <div className="text-xs font-mono font-semibold text-content-primary mt-1">SQLite / PostgreSQL</div>
              <div className="text-3xs text-emerald-400 mt-0.5">● Connected (WAL mode)</div>
            </div>
            <div className="bg-surface-base border border-border-base rounded p-3">
              <div className="text-2xs text-content-muted font-medium">Vector Store</div>
              <div className="text-xs font-mono font-semibold text-content-primary mt-1">ChromaDB Persistent</div>
              <div className="text-3xs text-emerald-400 mt-0.5">● Active (Cosine Sim)</div>
            </div>
            <div className="bg-surface-base border border-border-base rounded p-3">
              <div className="text-2xs text-content-muted font-medium">Property Graph</div>
              <div className="text-xs font-mono font-semibold text-content-primary mt-1">Neo4j Engine</div>
              <div className="text-3xs text-emerald-400 mt-0.5">● In-Memory / Bolt</div>
            </div>
          </div>
        </div>

        {/* Session Maintenance */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-content-primary">Clear Local Session & UI Cache</h3>
            <p className="text-2xs text-content-muted mt-0.5">
              Reset cached AST file trees, active tabs, and temporary conversation states.
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
