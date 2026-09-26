import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import apiClient from "../api/client";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  FileCode,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Flame
} from "lucide-react";

export default function Analysis() {
  const { currentProject } = useProject();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const activeProjectId = projectId || currentProject?.id;

  const [loading, setLoading] = useState(true);
  const [runningScan, setRunningScan] = useState(false);
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAnalysis = async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/projects/${activeProjectId}/analysis`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analysis report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [activeProjectId]);

  const handleRunScan = async () => {
    if (!activeProjectId) return;
    setRunningScan(true);
    try {
      await apiClient.post(`/projects/${activeProjectId}/analysis/trigger`);
      await fetchAnalysis();
    } catch (err) {
      console.error("Failed to run code analysis:", err);
    } finally {
      setRunningScan(false);
    }
  };

  const handleAskAIToFix = (item) => {
    const prompt = `Please help fix this ${item.category} issue (${item.severity}) found in \`${item.affected_file}\` line ${item.line_number}:\n\n**Issue**: ${item.title}\n**Details**: ${item.description}\n**Suggested Action**: ${item.suggested_action || "Propose a secure refactor"}`;
    navigate(`/projects/${activeProjectId}/chat`, { state: { prefilledPrompt: prompt } });
  };

  // Filter items
  const filteredItems = (data?.items || []).filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (selectedSeverity !== "ALL" && item.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.affected_file.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Health Score (100 base, deductions for critical/high/medium)
  const healthScore = Math.max(
    20,
    100 -
      (data?.critical_count || 0) * 25 -
      (data?.high_count || 0) * 12 -
      (data?.medium_count || 0) * 5
  );

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "SECURITY":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "ARCHITECTURE":
        return <Layers className="w-4 h-4 text-purple-400" />;
      case "QUALITY":
      case "MAINTAINABILITY":
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case "PERFORMANCE":
        return <Flame className="w-4 h-4 text-orange-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-y-auto bg-surface-base text-content-primary p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-base pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent-primary" />
            <h1 className="text-xl font-semibold text-content-primary">Codebase Quality & Security Audit</h1>
            <span className="px-2 py-0.5 rounded text-2xs font-mono font-medium bg-surface-elevated border border-border-base text-content-muted">
              AST Static Analysis Engine
            </span>
          </div>
          <p className="text-xs text-content-muted mt-1">
            Deterministic AST linting, architectural pattern recognition, and credential risk detection.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={runningScan || loading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-accent-primary text-white text-xs font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${runningScan ? "animate-spin" : ""}`} />
          {runningScan ? "Running Audit..." : "Trigger Full Scan"}
        </button>
      </div>

      {/* Overview Cards Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Health Score */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-content-muted font-medium">Health Score</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">
              {healthScore}
              <span className="text-xs text-content-muted font-normal"> / 100</span>
            </div>
            <div className="text-2xs text-emerald-400 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {healthScore >= 80 ? "Grade: A (Healthy)" : "Needs Attention"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-accent-primary/30 flex items-center justify-center font-bold font-mono text-accent-primary">
            {healthScore >= 90 ? "A" : healthScore >= 75 ? "B" : "C"}
          </div>
        </div>

        {/* Critical Issues */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-muted font-medium">Critical</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {data?.critical_count || 0}
          </div>
          <div className="text-2xs text-content-muted mt-0.5">Exploitable vulnerabilities</div>
        </div>

        {/* High Issues */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-muted font-medium">High</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {data?.high_count || 0}
          </div>
          <div className="text-2xs text-content-muted mt-0.5">Security / logic warnings</div>
        </div>

        {/* Medium Issues */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-muted font-medium">Medium</span>
            <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-400 mt-1">
            {data?.medium_count || 0}
          </div>
          <div className="text-2xs text-content-muted mt-0.5">Maintainability smells</div>
        </div>

        {/* Low / Info */}
        <div className="bg-surface-elevated border border-border-base rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-content-muted font-medium">Low / Info</span>
            <Info className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {data?.low_count || 0}
          </div>
          <div className="text-2xs text-content-muted mt-0.5">Architectural observations</div>
        </div>
      </div>

      {/* Architecture Summary Banner */}
      {data?.summary && (
        <div className="bg-surface-elevated/60 border border-border-base rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-primary" />
            <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Inferred Repository Architecture
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-content-muted">Detected Patterns:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {data.summary.detected_patterns?.map((pat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-surface-subtle border border-border-base text-content-secondary font-mono text-2xs"
                  >
                    {pat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-content-muted">Core Modules:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {data.summary.core_modules?.map((mod, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-surface-subtle border border-border-base text-content-secondary font-mono text-2xs"
                  >
                    {mod}/
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-content-muted">Primary Entrypoints:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {data.summary.entrypoints?.map((entry, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-2xs"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-subtle/50 p-2.5 rounded-lg border border-border-base">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center bg-surface-elevated border border-border-base rounded p-0.5">
            {["ALL", "SECURITY", "QUALITY", "MAINTAINABILITY", "ARCHITECTURE"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-2xs font-medium rounded transition-colors ${
                  selectedCategory === cat
                    ? "bg-accent-primary text-white"
                    : "text-content-muted hover:text-content-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center bg-surface-elevated border border-border-base rounded p-0.5">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-1 text-2xs font-medium rounded transition-colors ${
                  selectedSeverity === sev
                    ? "bg-surface-subtle text-content-primary border border-border-hover"
                    : "text-content-muted hover:text-content-primary"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search findings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-elevated border border-border-base rounded pl-8 pr-3 py-1.5 text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-primary w-56"
          />
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-content-muted text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-accent-primary" />
            Analyzing codebase AST and control flow...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border-base rounded-lg text-content-muted text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
            No issues match the selected criteria.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-elevated border border-border-base hover:border-border-hover rounded-lg p-4 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getCategoryIcon(item.category)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-content-primary">{item.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-2xs font-mono font-medium border ${getSeverityBadge(item.severity)}`}>
                        {item.severity}
                      </span>
                      <span className="text-2xs font-mono text-content-muted">
                        [{item.category}]
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary mt-1">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAskAIToFix(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent-primary/10 border border-accent-primary/20 text-accent-primary hover:bg-accent-primary/20 text-xs font-medium transition-colors shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI to Fix
                </button>
              </div>

              {/* Location & Evidence Code Box */}
              <div className="bg-surface-base border border-border-base rounded p-2.5 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-2xs text-content-muted">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{item.affected_file}</span>
                    <span className="text-content-muted">line {item.line_number}</span>
                  </div>
                  {item.suggested_action && (
                    <span className="text-amber-400 font-sans">
                      Recommendation: {item.suggested_action}
                    </span>
                  )}
                </div>

                {item.evidence && (
                  <pre className="p-2 rounded bg-[#090b10] border border-border-base/50 text-content-secondary text-2xs overflow-x-auto">
                    {item.evidence}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
