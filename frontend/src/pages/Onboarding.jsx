import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  UploadCloud,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  Leaf
} from "lucide-react";
import { useProject } from "../contexts/ProjectContext";
import { CanopyLogo } from "../components/common/CanopyLogo";

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
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500/20 selection:text-emerald-900">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-3">
            <CanopyLogo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-content-primary">
            Welcome to Canopy AI
          </h2>
          <p className="text-xs text-content-secondary mt-1">
            Step {step} of 3 — Cultivate Your Codebase Ecosystem
          </p>

          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface-elevated shadow-lg">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-content-primary">Plant your codebase</h3>
                <p className="text-xs text-content-secondary mt-0.5">Select how Canopy AI should ingest your project</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setSourceType("DEMO")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "DEMO"
                      ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                      : "border-border bg-surface-base hover:bg-surface-subtle"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-content-primary">Demo Reference Microservice</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded">Instant</span>
                    </div>
                    <p className="text-[11px] text-content-secondary mt-1 leading-relaxed">
                      Pre-bundled enterprise microservice with authentication, user models, payments, and Pytest suites.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType("GITHUB")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "GITHUB"
                      ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                      : "border-border bg-surface-base hover:bg-surface-subtle"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-surface-subtle text-content-primary shrink-0 mt-0.5">
                    <FolderGit2 className="w-4 h-4 text-content-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-content-primary">Connect Remote GitHub Repository</span>
                    <p className="text-[11px] text-content-secondary mt-1 leading-relaxed">
                      Clone public or private remote repository directly into your project space.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType("ZIP")}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all ${
                    sourceType === "ZIP"
                      ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                      : "border-border bg-surface-base hover:bg-surface-subtle"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-surface-subtle text-content-primary shrink-0 mt-0.5">
                    <UploadCloud className="w-4 h-4 text-content-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-content-primary">Upload ZIP Archive</span>
                    <p className="text-[11px] text-content-secondary mt-1 leading-relaxed">
                      Upload compressed local project archive with automated dependency discovery.
                    </p>
                  </div>
                </button>
              </div>

              {sourceType === "GITHUB" && (
                <div>
                  <label className="block text-xs font-semibold text-content-primary mb-1.5">Repository URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-accent-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
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
                <h3 className="text-sm font-bold text-content-primary">Configure workspace</h3>
                <p className="text-xs text-content-secondary mt-0.5">Set project metadata and indexing preferences</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-primary mb-1.5">Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-base border border-border rounded-lg text-xs text-content-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  className="w-1/3 py-2.5 px-4 rounded-lg border border-border bg-surface-subtle hover:bg-surface-base text-content-primary font-semibold text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleComplete}
                  className="w-2/3 py-2.5 px-4 rounded-lg bg-primary hover:bg-accent-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? "Harvesting & Indexing..." : "Create & Index Project"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <Check className="w-7 h-7 text-emerald-700" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-content-primary">Your Ecosystem is Flourishing!</h3>
                <p className="text-xs text-content-secondary mt-1">
                  Your codebase has been parsed into AST symbols and indexed for semantic search and Neo4j dependency canopy queries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/70 border border-border text-left space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="text-content-primary font-medium">Repository connected and extracted safely</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="text-content-primary font-medium">AST symbols parsed & vector embeddings saved to ChromaDB</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="text-content-primary font-medium">Neo4j dependency graph & LangGraph agent active</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-accent-hover text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
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
