import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import apiClient from "../api/client";
import {
  GitFork,
  Layers,
  FileCode,
  Box,
  Zap,
  AlertTriangle,
  ShieldAlert,
  Search,
  RefreshCw,
  Info,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Filter
} from "lucide-react";

export default function Dependencies() {
  const { currentProject } = useProject();
  const { projectId } = useParams();
  const activeProjectId = projectId || currentProject?.id;

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  // Impact analysis state
  const [impactSymbol, setImpactSymbol] = useState("");
  const [impactLoading, setImpactLoading] = useState(false);
  const [impactData, setImpactData] = useState(null);

  // Zoom & Pan state for SVG canvas
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const fetchGraph = async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const typeParam = filterType !== "all" ? `?filter_type=${filterType}` : "";
      const res = await apiClient.get(`/projects/${activeProjectId}/dependencies${typeParam}`);
      setGraphData(res.data || { nodes: [], edges: [] });
      if (res.data?.nodes?.length > 0 && !selectedNode) {
        setSelectedNode(res.data.nodes[0]);
      }
    } catch (err) {
      console.error("Failed to load dependency graph:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [activeProjectId, filterType]);

  const handleImpactAnalysis = async (symbolToAnalyze) => {
    const sym = symbolToAnalyze || impactSymbol;
    if (!sym || !activeProjectId) return;
    setImpactLoading(true);
    try {
      const res = await apiClient.get(
        `/projects/${activeProjectId}/dependencies/impact?symbol=${encodeURIComponent(sym)}`
      );
      setImpactData(res.data);
    } catch (err) {
      console.error("Impact analysis failed:", err);
    } finally {
      setImpactLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setImpactSymbol(node.label);
    handleImpactAnalysis(node.label);
  };

  // Node position layout calculation (circle or force-like layout)
  const layoutNodes = useMemo(() => {
    const nodes = graphData.nodes.filter((n) => {
      if (!searchQuery) return true;
      return n.label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const count = nodes.length;
    if (count === 0) return [];

    const radius = Math.min(380, Math.max(160, count * 24));
    const centerX = 420;
    const centerY = 320;

    return nodes.map((node, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return {
        ...node,
        x,
        y
      };
    });
  }, [graphData.nodes, searchQuery]);

  const nodeMap = useMemo(() => {
    const map = new Map();
    layoutNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const getNodeColor = (type) => {
    switch (type) {
      case "file":
        return { bg: "fill-blue-500/20", stroke: "stroke-blue-400", text: "text-blue-400", badge: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "class":
        return { bg: "fill-emerald-500/20", stroke: "stroke-emerald-400", text: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "function":
        return { bg: "fill-amber-500/20", stroke: "stroke-amber-400", text: "text-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      default:
        return { bg: "fill-purple-500/20", stroke: "stroke-purple-400", text: "text-purple-400", badge: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
    }
  };

  // Drag handlers for canvas
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg" || e.target.tagName === "g") {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-surface-base text-content-primary">
      {/* Top Header */}
      <div className="border-b border-border-base bg-surface-subtle/50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-accent-primary" />
            <h1 className="text-base font-semibold text-content-primary">Dependency & Blast Radius Graph</h1>
            <span className="px-2 py-0.5 rounded text-2xs font-mono font-medium bg-surface-elevated border border-border-base text-content-muted">
              Neo4j Graph Engine
            </span>
          </div>
          <p className="text-xs text-content-muted mt-0.5">
            AST-level call hierarchies, cross-module imports, and impact blast radius analysis.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-elevated border border-border-base rounded-md pl-8 pr-3 py-1.5 text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-primary w-48"
            />
          </div>

          <div className="flex items-center bg-surface-elevated border border-border-base rounded-md p-0.5">
            {["all", "file", "class", "function"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-xs rounded font-medium capitalize transition-colors ${
                  filterType === type
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "text-content-muted hover:text-content-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={fetchGraph}
            disabled={loading}
            className="p-1.5 rounded-md border border-border-base bg-surface-elevated text-content-muted hover:text-content-primary hover:border-border-hover transition-colors"
            title="Refresh graph"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visual Graph Canvas (Left / Center) */}
        <div
          className="flex-1 relative bg-surface-base overflow-hidden select-none cursor-grab active:cursor-grabbing border-r border-border-base"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Zoom controls overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-surface-elevated/95 backdrop-blur border border-border-base rounded-lg p-1 shadow-md">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
              className="p-1.5 rounded hover:bg-surface-subtle text-content-muted hover:text-content-primary"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-2xs font-mono px-1.5 text-content-muted">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
              className="p-1.5 rounded hover:bg-surface-subtle text-content-muted hover:text-content-primary"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded hover:bg-surface-subtle text-content-muted hover:text-content-primary border-l border-border-base"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canvas Stats Pill */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-surface-elevated/90 backdrop-blur border border-border-base rounded-lg px-3 py-1.5 text-xs text-content-secondary shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>{graphData.nodes.filter((n) => n.node_type === "file").length} Files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>{graphData.nodes.filter((n) => n.node_type === "class").length} Classes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>{graphData.nodes.filter((n) => n.node_type === "function").length} Functions</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-border-base pl-2">
              <span className="font-mono text-content-primary font-bold">{graphData.edges.length}</span>
              <span>Edges</span>
            </div>
          </div>

          {/* SVG Dependency Graph Rendering */}
          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.1s ease-out"
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="14"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="14"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#059669" />
              </marker>
            </defs>

            {/* Render Edges */}
            <g className="edges">
              {graphData.edges.map((edge) => {
                const sourceNode = nodeMap.get(edge.source);
                const targetNode = nodeMap.get(edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected =
                  selectedNode &&
                  (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnectedToSelected ? "#059669" : "#cbd5e1"}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                      strokeDasharray={edge.label === "IMPORTS" ? "4 3" : undefined}
                      markerEnd={isConnectedToSelected ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    />
                  </g>
                );
              })}
            </g>

            {/* Render Nodes */}
            <g className="nodes">
              {layoutNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const colors = getNodeColor(node.node_type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isSelected ? 18 : 14}
                      className={`${colors.bg} ${colors.stroke} stroke-2 transition-all group-hover:scale-125`}
                      filter={isSelected ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : undefined}
                    />
                    <text
                      y={26}
                      textAnchor="middle"
                      className={`text-[10px] font-mono select-none fill-content-primary font-medium tracking-tight`}
                    >
                      {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right Sidebar: Details & Blast Radius Impact Analyzer */}
        <div className="w-96 border-l border-border-base bg-surface-subtle/80 flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-border-base bg-surface-elevated/40">
            <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-accent-primary" />
              Impact & Blast Radius
            </h2>
            <p className="text-xs text-content-muted mt-1">
              Select any node in the graph or type a function name to simulate change impacts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleImpactAnalysis(impactSymbol);
              }}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                placeholder="e.g. authenticate_user"
                value={impactSymbol}
                onChange={(e) => setImpactSymbol(e.target.value)}
                className="flex-1 bg-surface-base border border-border-base rounded px-2.5 py-1.5 text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-primary font-mono"
              />
              <button
                type="submit"
                disabled={impactLoading || !impactSymbol}
                className="px-3 py-1.5 rounded bg-accent-primary text-white text-xs font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors"
              >
                {impactLoading ? "Analyzing..." : "Analyze"}
              </button>
            </form>
          </div>

          {/* Node Details Card */}
          {selectedNode && (
            <div className="p-4 border-b border-border-base space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-content-muted uppercase tracking-wider font-semibold">
                  Selected Symbol
                </span>
                <span className={`px-2 py-0.5 rounded text-2xs font-mono font-medium border ${getNodeColor(selectedNode.node_type).badge}`}>
                  {selectedNode.node_type}
                </span>
              </div>
              <div className="bg-surface-elevated border border-border-base rounded p-3">
                <div className="font-mono text-sm font-semibold text-content-primary break-all">
                  {selectedNode.label}
                </div>
                {selectedNode.properties?.file && (
                  <div className="text-xs text-content-muted font-mono mt-1">
                    File: {selectedNode.properties.file}
                  </div>
                )}
                {selectedNode.properties?.start_line && (
                  <div className="text-xs text-content-muted font-mono">
                    Lines: {selectedNode.properties.start_line} – {selectedNode.properties.end_line}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Impact Analysis Results */}
          <div className="p-4 flex-1 space-y-4">
            {impactData ? (
              <>
                {/* Risk Level Badge */}
                <div className="flex items-center justify-between bg-surface-elevated border border-border-base rounded p-3">
                  <span className="text-xs font-medium text-content-secondary">Calculated Blast Risk</span>
                  <div className="flex items-center gap-1.5">
                    {impactData.risk_level === "HIGH" ? (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    ) : impactData.risk_level === "MEDIUM" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Layers className="w-4 h-4 text-emerald-400" />
                    )}
                    <span
                      className={`text-xs font-mono font-bold ${
                        impactData.risk_level === "HIGH"
                          ? "text-red-400"
                          : impactData.risk_level === "MEDIUM"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {impactData.risk_level}
                    </span>
                  </div>
                </div>

                {/* Upstream Callers (Who breaks if this changes) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-content-muted font-medium mb-2">
                    <span className="flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                      Upstream Callers ({impactData.upstream_callers?.length || 0})
                    </span>
                    <span className="text-2xs text-content-muted">Directly Affected</span>
                  </div>
                  {impactData.upstream_callers?.length > 0 ? (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {impactData.upstream_callers.map((caller, i) => (
                        <div
                          key={i}
                          className="bg-surface-elevated/60 border border-border-base rounded px-2.5 py-1.5 text-xs font-mono text-content-secondary flex items-center justify-between hover:border-border-hover transition-colors"
                        >
                          <span className="truncate">{caller}</span>
                          <span className="text-2xs text-blue-400 font-sans">caller</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-content-muted italic bg-surface-elevated/20 p-2.5 rounded border border-border-base/50">
                      No upstream callers found in AST.
                    </div>
                  )}
                </div>

                {/* Downstream Dependencies (What this needs to execute) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-content-muted font-medium mb-2">
                    <span className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      Downstream Dependencies ({impactData.downstream_dependencies?.length || 0})
                    </span>
                    <span className="text-2xs text-content-muted">Relies Upon</span>
                  </div>
                  {impactData.downstream_dependencies?.length > 0 ? (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {impactData.downstream_dependencies.map((dep, i) => (
                        <div
                          key={i}
                          className="bg-surface-elevated/60 border border-border-base rounded px-2.5 py-1.5 text-xs font-mono text-content-secondary flex items-center justify-between hover:border-border-hover transition-colors"
                        >
                          <span className="truncate">{dep}</span>
                          <span className="text-2xs text-amber-400 font-sans">dependency</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-content-muted italic bg-surface-elevated/20 p-2.5 rounded border border-border-base/50">
                      No downstream dependencies detected.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-content-muted border border-dashed border-border-base rounded-lg">
                <Layers className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs">Click any node or enter a symbol name to view blast radius details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
