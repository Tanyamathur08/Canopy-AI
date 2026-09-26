import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import apiClient from "../api/client";
import {
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Terminal,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  FolderGit2,
  ChevronRight,
  ExternalLink,
  Cpu
} from "lucide-react";

export default function Tests() {
  const { currentProject } = useProject();
  const { projectId } = useParams();
  const activeProjectId = projectId || currentProject?.id;

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeRun, setActiveRun] = useState(null);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [customPath, setCustomPath] = useState("tests");

  // Generator modal state
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genFilePath, setGenFilePath] = useState("app/services/auth_service.py");
  const [genSymbol, setGenSymbol] = useState("authenticate_user");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);

  const fetchHistory = async () => {
    if (!activeProjectId) return;
    setLoadingHistory(true);
    try {
      const res = await apiClient.get(`/projects/${activeProjectId}/tests/history`);
      setHistory(res.data || []);
      if (res.data?.length > 0 && !activeRun) {
        setActiveRun(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load test history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeProjectId]);

  const handleRunTests = async () => {
    if (!activeProjectId) return;
    setIsRunning(true);
    try {
      const res = await apiClient.post(`/projects/${activeProjectId}/tests/run`, {
        test_path: customPath || "tests"
      });
      setActiveRun(res.data);
      await fetchHistory();
    } catch (err) {
      console.error("Test execution failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGenerateTests = async (e) => {
    e.preventDefault();
    if (!activeProjectId || !genFilePath) return;
    setIsGenerating(true);
    try {
      const res = await apiClient.post(`/projects/${activeProjectId}/tests/generate`, {
        file_path: genFilePath,
        target_symbol: genSymbol || undefined
      });
      setGeneratedResult(res.data);
    } catch (err) {
      console.error("Failed to generate test suite:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedResult?.generated_test_code) return;
    navigator.clipboard.writeText(generatedResult.generated_test_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLog = () => {
    if (!activeRun?.output_log) return;
    navigator.clipboard.writeText(activeRun.output_log);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-surface-base text-content-primary">
      {/* Top Header */}
      <div className="border-b border-border-base bg-surface-subtle/50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent-primary" />
            <h1 className="text-base font-semibold text-content-primary">Pytest Execution & Test Automation</h1>
            <span className="px-2 py-0.5 rounded text-2xs font-mono font-medium bg-surface-elevated border border-border-base text-content-muted">
              Subprocess Runner + LLM Synthesizer
            </span>
          </div>
          <p className="text-xs text-content-muted mt-0.5">
            Run real unit test suites, inspect stdout/stderr terminal streams, and generate regression assertions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom path input */}
          <div className="flex items-center bg-surface-elevated border border-border-base rounded px-2 py-1">
            <span className="text-2xs font-mono text-content-muted mr-1.5">pytest</span>
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="tests"
              className="bg-transparent text-xs text-content-primary focus:outline-none w-28 font-mono"
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunTests}
            disabled={isRunning || !activeProjectId}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium disabled:opacity-50 transition-colors shadow-sm"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {isRunning ? "Running Pytest..." : "Run Tests"}
          </button>

          {/* AI Generator Button */}
          <button
            onClick={() => setIsGenModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-accent-primary hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Suite
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center: Active Run Output Log Terminal */}
        <div className="flex-1 flex flex-col bg-[#090b10] border-r border-border-base overflow-hidden">
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated/40 border-b border-border-base">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-2xs font-mono text-content-muted ml-2">
                stdout / stderr — {activeRun ? `Run #${activeRun.id.slice(0, 8)}` : "No Active Run"}
              </span>
            </div>

            {activeRun && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {activeRun.status === "PASSED" ? (
                    <span className="flex items-center gap-1 text-2xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> PASSED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-2xs font-mono font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      <XCircle className="w-3 h-3" /> {activeRun.status}
                    </span>
                  )}
                  <span className="text-2xs font-mono text-content-muted">
                    {activeRun.execution_duration}s
                  </span>
                </div>

                <button
                  onClick={handleCopyLog}
                  className="p-1 rounded hover:bg-surface-elevated text-content-muted hover:text-content-primary transition-colors"
                  title="Copy Log"
                >
                  {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Terminal Content Stream */}
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text">
            {activeRun ? (
              <pre className="text-content-secondary whitespace-pre-wrap font-mono">
                {activeRun.output_log}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-content-muted text-xs">
                <Terminal className="w-8 h-8 opacity-20 mb-2" />
                <p>Click "Run Tests" to execute Pytest against the project repository.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Run History & Stats */}
        <div className="w-80 bg-surface-subtle/50 flex flex-col h-full overflow-hidden">
          <div className="p-3.5 border-b border-border-base bg-surface-elevated/20">
            <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-accent-primary" />
              Execution History
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingHistory ? (
              <div className="text-center py-8 text-xs text-content-muted">
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-accent-primary" />
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-xs text-content-muted">
                No past runs recorded.
              </div>
            ) : (
              history.map((run) => {
                const isSelected = activeRun?.id === run.id;
                return (
                  <button
                    key={run.id}
                    onClick={() => setActiveRun(run)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-surface-elevated border-accent-primary/40 shadow-sm"
                        : "bg-surface-elevated/40 border-border-base hover:border-border-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-content-primary">
                        {run.test_path || "tests"}
                      </span>
                      <span
                        className={`text-2xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                          run.status === "PASSED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {run.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-2xs text-content-muted mt-2 font-mono">
                      <span>
                        {run.passed_tests} passed, {run.failed_tests} failed
                      </span>
                      <span>{run.execution_duration}s</span>
                    </div>

                    <div className="text-3xs text-content-muted mt-1 font-sans">
                      {new Date(run.executed_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Test Generation Modal */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-elevated border border-border-base rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                <h3 className="text-sm font-semibold text-content-primary">
                  Synthesize Automated Pytest Suite
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsGenModalOpen(false);
                  setGeneratedResult(null);
                }}
                className="text-content-muted hover:text-content-primary text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleGenerateTests} className="p-5 space-y-4 border-b border-border-base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold text-content-secondary uppercase tracking-wider mb-1">
                    Target File Path
                  </label>
                  <input
                    type="text"
                    required
                    value={genFilePath}
                    onChange={(e) => setGenFilePath(e.target.value)}
                    placeholder="e.g. app/services/auth_service.py"
                    className="w-full bg-surface-base border border-border-base rounded px-3 py-1.5 text-xs text-content-primary font-mono focus:outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-semibold text-content-secondary uppercase tracking-wider mb-1">
                    Target Symbol (Optional)
                  </label>
                  <input
                    type="text"
                    value={genSymbol}
                    onChange={(e) => setGenSymbol(e.target.value)}
                    placeholder="e.g. authenticate_user"
                    className="w-full bg-surface-base border border-border-base rounded px-3 py-1.5 text-xs text-content-primary font-mono focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating || !genFilePath}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-accent-primary hover:bg-accent-hover text-white text-xs font-medium disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "Synthesizing..." : "Generate Pytest Cases"}
                </button>
              </div>
            </form>

            {/* Generated Code Preview */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#090b10]">
              {generatedResult ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-mono text-content-muted">
                      {generatedResult.explanation}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-elevated border border-border-base text-content-primary text-xs hover:border-border-hover transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied" : "Copy Suite"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-surface-base border border-border-base rounded-lg text-content-secondary font-mono text-xs overflow-x-auto">
                    {generatedResult.generated_test_code}
                  </pre>
                </div>
              ) : (
                <div className="py-8 text-center text-content-muted text-xs">
                  Fill in the target file and click "Generate Pytest Cases" to synthesize unit assertions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
