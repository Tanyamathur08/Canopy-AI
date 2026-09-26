import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  UploadCloud,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Check
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [sourceType, setSourceType] = useState("DEMO");
  const [githubUrl, setGithubUrl] = useState("https://github.com/fastapi/fastapi");
  const [projectName, setProjectName] = useState("My Microservice");
  const [description, setDescription] = useState("Enterprise services with authentication, user models, and payments.");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);

  const { createProject, createDemoProject } = useProject();
  const navigate = useNavigate();

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (sourceType === "DEMO") {
        await createDemoProject();
      } else {
        await createProject({
          name: projectName,
          description,
          source_type: sourceType,
          github_url: sourceType === "GITHUB" ? githubUrl : undefined
        });
      }
      setStep(3);
    } catch {
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold shadow-sm mb-3">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Welcome to CodeMind AI</h2>
          <p className="text-xs text-muted-foreground mt-1">Step {step} of 3 — Codebase Setup</p>

          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 w-12 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-2xl">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-foreground">What do you want to analyze?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Select a codebase ingestion method</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSourceType("DEMO")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "DEMO"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-background/50 hover:bg-background"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">Demo Repository</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">Instant</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Pre-bundled enterprise microservice with authentication, user models, payments, and Pytest suites.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType("GITHUB")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "GITHUB"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-background/50 hover:bg-background"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-secondary text-foreground shrink-0 mt-0.5">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground">Connect GitHub Repository</span>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Clone public or private remote repository directly into your project space.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType("ZIP")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "ZIP"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-background/50 hover:bg-background"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-secondary text-foreground shrink-0 mt-0.5">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground">Upload ZIP Archive</span>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      Upload compressed local project archive with automated dependency discovery.
                    </p>
                  </div>
                </button>
              </div>

              {sourceType === "GITHUB" && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Repository URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Workspace Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Create your workspace</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Configure project metadata and indexing preferences</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript / Node.js</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 px-4 rounded-lg border border-border bg-secondary hover:bg-accent text-foreground font-semibold text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleComplete}
                  className="w-2/3 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? "Initializing..." : "Create & Index Project"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">You're All Set!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Your codebase has been discovered, parsed into AST symbols, and indexed for semantic search and dependency queries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/60 border border-border text-left space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-foreground">Repository connected and extracted</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-foreground">AST symbols parsed & vector embeddings saved to ChromaDB</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="text-foreground">Neo4j dependency graph & LangGraph agent active</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <span>Open Developer Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
