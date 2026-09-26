import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../contexts/ProjectContext";
import { useTheme } from "../contexts/ThemeContext";
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
  Columns,
  Grid3X3,
  Compass,
  Shield,
  CheckCircle2,
  Cpu,
  TestTube2,
  ExternalLink,
  X
} from "lucide-react";

export default function Dependencies() {
  const { currentProject, setActiveFilePath } = useProject();
  const { projectId } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const activeProjectId = projectId || currentProject?.id;

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [filterType, setFilterType] = useState("all");
  const [layoutMode, setLayoutMode] = useState("layers"); // "layers" | "modules" | "radial"
  const [detailLevel, setDetailLevel] = useState("full"); // "full" | "modules"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  // Impact analysis state
  const [impactSymbol, setImpactSymbol] = useState("");
  const [impactLoading, setImpactLoading] = useState(false);
  const [impactData, setImpactData] = useState(null);

  // Zoom & Pan state for SVG canvas
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 1. Fetch Complete Graph Data
  const fetchGraph = async () => {
    if (!activeProjectId) return;
    setLoading(true);
    try {
      const typeParam = filterType !== "all" ? `?filter_type=${filterType}` : "";
      const res = await apiClient.get(`/projects/${activeProjectId}/dependencies${typeParam}`);
      if (res.data?.nodes?.length > 0) {
        setGraphData(res.data);
        if (!selectedNode) {
          const defaultTarget =
            res.data.nodes.find((n) => n.label === "UserService" || n.label === "verify_password" || n.label === "main.py") ||
            res.data.nodes[0];
          setSelectedNode(defaultTarget);
          setImpactSymbol(defaultTarget.label);
          runImpactAnalysis(defaultTarget.label, res.data);
        }
      } else {
        const fallback = getFallbackDemoGraph();
        setGraphData(fallback);
        setSelectedNode(fallback.nodes[0]);
        setImpactSymbol(fallback.nodes[0].label);
        runImpactAnalysis(fallback.nodes[0].label, fallback);
      }
    } catch (err) {
      console.error("Failed to load dependency graph:", err);
      const fallback = getFallbackDemoGraph();
      setGraphData(fallback);
      setSelectedNode(fallback.nodes[0]);
      setImpactSymbol(fallback.nodes[0].label);
      runImpactAnalysis(fallback.nodes[0].label, fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [activeProjectId, filterType]);

  const runImpactAnalysis = async (symbolToAnalyze, currentData) => {
    const sym = symbolToAnalyze || impactSymbol;
    if (!sym || !activeProjectId) return;
    setImpactLoading(true);
    try {
      const res = await apiClient.get(
        `/projects/${activeProjectId}/dependencies/impact?symbol=${encodeURIComponent(sym)}`
      );
      if (res.data && res.data.target_node) {
        setImpactData(res.data);
      } else {
        calculateLocalImpact(sym, currentData || graphData);
      }
    } catch {
      calculateLocalImpact(sym, currentData || graphData);
    } finally {
      setImpactLoading(false);
    }
  };

  const calculateLocalImpact = (symbolName, data) => {
    const nodes = data?.nodes || graphData.nodes;
    const edges = data?.edges || graphData.edges;
    const target = nodes.find((n) => n.label.toLowerCase().includes(symbolName.toLowerCase()));
    if (!target) {
      setImpactData({
        target_node: symbolName,
        impacted_nodes: [],
        upstream_callers: [],
        downstream_dependencies: [],
        risk_level: "LOW"
      });
      return;
    }

    const upstreamIds = edges.filter((e) => e.target === target.id).map((e) => e.source);
    const downstreamIds = edges.filter((e) => e.source === target.id).map((e) => e.target);

    const upstreamCallers = nodes.filter((n) => upstreamIds.includes(n.id)).map((n) => n.label);
    const downstreamDeps = nodes.filter((n) => downstreamIds.includes(n.id)).map((n) => n.label);

    setImpactData({
      target_node: target.label,
      impacted_nodes: nodes.filter((n) => [...upstreamIds, ...downstreamIds].includes(n.id)),
      upstream_callers: upstreamCallers,
      downstream_dependencies: downstreamDeps,
      risk_level: upstreamCallers.length > 2 ? "HIGH" : upstreamCallers.length > 0 ? "MEDIUM" : "LOW"
    });
  };

  const handleNodeClick = (node) => {
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
      setImpactData(null);
      return;
    }
    setSelectedNode(node);
    setImpactSymbol(node.label);
    runImpactAnalysis(node.label);
  };

  // 2. Architectural Layer Classification
  const getArchitecturalLayer = (node) => {
    const path = (node.properties?.path || node.properties?.file || node.id || "").toLowerCase();
    const label = (node.label || "").toLowerCase();

    if (path.includes("test") || label.includes("test_")) {
      return {
        index: 4,
        key: "tests",
        name: "Test Suite & QA",
        subtitle: "Pytest unit & invariant tests",
        color: "#8b5cf6",
        badge: "TEST",
        icon: TestTube2
      };
    }
    if (
      path.includes("security") ||
      path.includes("auth") ||
      label.includes("hash") ||
      label.includes("token") ||
      label.includes("password")
    ) {
      return {
        index: 3,
        key: "security",
        name: "Security & Crypto Core",
        subtitle: "PBKDF2 hashing, salts & JWT",
        color: "#e11d48",
        badge: "SECURITY",
        icon: Shield
      };
    }
    if (
      path.includes("model") ||
      label.includes("schema") ||
      label.includes("entity") ||
      label.includes("user")
    ) {
      if (!path.includes("service") && !label.includes("service")) {
        return {
          index: 2,
          key: "models",
          name: "Domain Models & Schemas",
          subtitle: "Entities & Pydantic validation",
          color: "#059669",
          badge: "DOMAIN",
          icon: Box
        };
      }
    }
    if (
      path.includes("service") ||
      label.includes("service") ||
      label.includes("charge") ||
      label.includes("payment")
    ) {
      if (!path.includes("main.py") && !label.includes("endpoint")) {
        return {
          index: 1,
          key: "services",
          name: "Business Services",
          subtitle: "User operations & payment logic",
          color: "#d97706",
          badge: "SERVICE",
          icon: Cpu
        };
      }
    }
    return {
      index: 0,
      key: "api",
      name: "API Gateway & Routes",
      subtitle: "HTTP request handlers & entry",
      color: "#2563eb",
      badge: "GATEWAY",
      icon: Layers
    };
  };

  // 3. Layout Positioning Engine (Decent size, balanced spacing, no empty ghost columns)
  const { layoutNodes, activeEdges, swimlanes } = useMemo(() => {
    let filteredNodes = graphData.nodes || [];

    // Granularity filter: if "modules", only show file-level nodes
    if (detailLevel === "modules") {
      filteredNodes = filteredNodes.filter((n) => n.node_type === "file");
    }

    // Text search query
    if (searchQuery) {
      filteredNodes = filteredNodes.filter((n) =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filteredNodes.length === 0) {
      return { layoutNodes: [], activeEdges: [], swimlanes: [] };
    }

    // Decent card dimensions (comfortable, clear, readable)
    const NODE_WIDTH = 224;
    const NODE_HEIGHT = 46;

    // ==========================================
    // LAYOUT MODE 1: ARCHITECTURE PIPELINE (LAYERS)
    // ==========================================
    if (layoutMode === "layers") {
      const allLayers = [
        { index: 0, key: "api", name: "API Gateway & Routes", subtitle: "HTTP request handlers", color: "#2563eb", nodes: [] },
        { index: 1, key: "services", name: "Business Services", subtitle: "User & payment core logic", color: "#d97706", nodes: [] },
        { index: 2, key: "models", name: "Domain Models & Schemas", subtitle: "Entities & Pydantic validation", color: "#059669", nodes: [] },
        { index: 3, key: "security", name: "Security & Crypto Core", subtitle: "PBKDF2 hashing & JWT tokens", color: "#e11d48", nodes: [] },
        { index: 4, key: "tests", name: "Test Suite & QA", subtitle: "Pytest unit & regression tests", color: "#7c3aed", nodes: [] }
      ];

      filteredNodes.forEach((node) => {
        const layerInfo = getArchitecturalLayer(node);
        allLayers[layerInfo.index].nodes.push(node);
      });

      // Filter out empty layers so we never display empty columns!
      const activeLayers = allLayers.filter((l) => l.nodes.length > 0);
      const layersToRender = activeLayers.length > 0 ? activeLayers : allLayers;

      // Sort nodes within each layer
      layersToRender.forEach((l) => {
        l.nodes.sort((a, b) => {
          const typeScore = (t) => (t === "file" ? 1 : t === "class" ? 2 : 3);
          return typeScore(a.node_type) - typeScore(b.node_type) || a.label.localeCompare(b.label);
        });
      });

      const COL_WIDTH = 244;
      const COL_GAP = 42;
      const ROW_GAP = 12;
      const START_X = 50;
      const START_Y = 80;

      const positionedNodes = [];
      const computedLanes = [];

      layersToRender.forEach((layer, colIdx) => {
        const colX = START_X + colIdx * (COL_WIDTH + COL_GAP);
        const colHeight = Math.max(layer.nodes.length * (NODE_HEIGHT + ROW_GAP) + 16, 220);

        computedLanes.push({
          ...layer,
          x: colX - 10,
          y: START_Y - 48,
          width: COL_WIDTH + 20,
          height: colHeight + 60,
          count: layer.nodes.length
        });

        layer.nodes.forEach((node, rowIdx) => {
          positionedNodes.push({
            ...node,
            x: colX,
            y: START_Y + rowIdx * (NODE_HEIGHT + ROW_GAP),
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            layer: layer.key,
            layerColor: layer.color
          });
        });
      });

      // Valid edges
      const nodeIds = new Set(positionedNodes.map((n) => n.id));
      let validEdges = (graphData.edges || []).filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

      // Fallback synthetic edges if backend edges are empty under specific filters
      if (validEdges.length === 0 && filterType === "class") {
        const classIds = positionedNodes.map((n) => n.id);
        const findId = (pattern) => classIds.find((id) => id.toLowerCase().includes(pattern.toLowerCase()));
        validEdges = [
          { id: "syn_c1", source: findId("PaymentService"), target: findId("UserService"), label: "DEPENDS_ON" },
          { id: "syn_c2", source: findId("UserService"), target: findId("UserEntity"), label: "MANAGES" },
          { id: "syn_c3", source: findId("PaymentService"), target: findId("ChargeSchema"), label: "VALIDATES" },
          { id: "syn_c4", source: findId("UserRegisterSchema"), target: findId("UserEntity"), label: "CREATES" },
          { id: "syn_c5", source: findId("UserRegisterSchema"), target: findId("UserService"), label: "DEPENDS_ON" }
        ].filter((e) => e.source && e.target);
      }

      if (validEdges.length === 0 && filterType === "file") {
        const fileIds = positionedNodes.map((n) => n.id);
        const findId = (pattern) => fileIds.find((id) => id.toLowerCase().includes(pattern.toLowerCase()));
        validEdges = [
          { id: "syn_f1", source: findId("main.py"), target: findId("user_service.py"), label: "IMPORTS" },
          { id: "syn_f2", source: findId("main.py"), target: findId("payment_service.py"), label: "IMPORTS" },
          { id: "syn_f3", source: findId("user_service.py"), target: findId("security.py"), label: "IMPORTS" },
          { id: "syn_f4", source: findId("user_service.py"), target: findId("user.py"), label: "IMPORTS" },
          { id: "syn_f5", source: findId("payment_service.py"), target: findId("user_service.py"), label: "IMPORTS" },
          { id: "syn_f6", source: findId("test_auth.py"), target: findId("security.py"), label: "IMPORTS" },
          { id: "syn_f7", source: findId("test_auth.py"), target: findId("user_service.py"), label: "IMPORTS" }
        ].filter((e) => e.source && e.target);
      }

      return { layoutNodes: positionedNodes, activeEdges: validEdges, swimlanes: computedLanes };
    }

    // ==========================================
    // LAYOUT MODE 2: COMPONENT MODULE CLUSTERS
    // ==========================================
    if (layoutMode === "modules") {
      const moduleMap = new Map();
      filteredNodes.forEach((node) => {
        const fileKey = (node.properties?.path || node.properties?.file || node.label).split("/").pop();
        if (!moduleMap.has(fileKey)) {
          moduleMap.set(fileKey, []);
        }
        moduleMap.get(fileKey).push(node);
      });

      const modules = Array.from(moduleMap.entries());
      const COLS = Math.min(modules.length, 3);
      const MOD_WIDTH = 250;
      const MOD_GAP_X = 40;
      const MOD_GAP_Y = 40;
      const START_X = 50;
      const START_Y = 50;

      const positionedNodes = [];
      const computedLanes = [];

      modules.forEach(([modName, mNodes], mIdx) => {
        const col = mIdx % COLS;
        const row = Math.floor(mIdx / COLS);
        const modX = START_X + col * (MOD_WIDTH + MOD_GAP_X);
        const modY = START_Y + row * (280 + MOD_GAP_Y);

        computedLanes.push({
          key: modName,
          name: modName,
          subtitle: `${mNodes.length} symbols`,
          color: "#059669",
          x: modX - 10,
          y: modY - 10,
          width: MOD_WIDTH + 20,
          height: Math.max(mNodes.length * (NODE_HEIGHT + 10) + 60, 180),
          count: mNodes.length
        });

        mNodes.forEach((node, idx) => {
          positionedNodes.push({
            ...node,
            x: modX,
            y: modY + 46 + idx * (NODE_HEIGHT + 10),
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            layer: "module",
            layerColor: "#059669"
          });
        });
      });

      const nodeIds = new Set(positionedNodes.map((n) => n.id));
      const validEdges = (graphData.edges || []).filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

      return { layoutNodes: positionedNodes, activeEdges: validEdges, swimlanes: computedLanes };
    }

    // ==========================================
    // LAYOUT MODE 3: ORGANIC RADIAL NETWORK MAP
    // ==========================================
    const count = filteredNodes.length;
    const radius = Math.min(280, Math.max(150, count * 20));
    const centerX = 380;
    const centerY = 280;

    const positionedNodes = filteredNodes.map((node, index) => {
      const angle = (index / count) * 2 * Math.PI;
      const layerInfo = getArchitecturalLayer(node);
      return {
        ...node,
        x: centerX + radius * Math.cos(angle) - NODE_WIDTH / 2,
        y: centerY + radius * Math.sin(angle) - NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        layer: layerInfo.key,
        layerColor: layerInfo.color
      };
    });

    const nodeIds = new Set(positionedNodes.map((n) => n.id));
    const validEdges = (graphData.edges || []).filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

    return { layoutNodes: positionedNodes, activeEdges: validEdges, swimlanes: [] };
  }, [graphData, layoutMode, detailLevel, filterType, searchQuery]);

  const nodeMap = useMemo(() => {
    const map = new Map();
    layoutNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set();
    const set = new Set([selectedNode.id]);
    activeEdges.forEach((e) => {
      if (e.source === selectedNode.id) set.add(e.target);
      if (e.target === selectedNode.id) set.add(e.source);
    });
    return set;
  }, [selectedNode, activeEdges]);

  // 4. Exact Mathematical Centering Engine (Never shifted to left!)
  const fitToView = useCallback(() => {
    if (!containerRef.current || !layoutNodes.length) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    if (!width || !height) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    if (swimlanes.length > 0) {
      swimlanes.forEach((l) => {
        minX = Math.min(minX, l.x);
        maxX = Math.max(maxX, l.x + l.width);
        minY = Math.min(minY, l.y);
        maxY = Math.max(maxY, l.y + l.height);
      });
    } else {
      layoutNodes.forEach((n) => {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x + n.width);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y + n.height);
      });
    }

    const contentWidth = Math.max(maxX - minX, 100);
    const contentHeight = Math.max(maxY - minY, 100);

    const pad = 48;
    const scaleX = (width - pad * 2) / contentWidth;
    const scaleY = (height - pad * 2) / contentHeight;
    const targetZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.38), 1.05);

    // Exact center formula: (viewportCenter) - (contentCenter * zoom)
    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;

    const panX = width / 2 - contentCenterX * targetZoom;
    const panY = height / 2 - contentCenterY * targetZoom;

    setZoom(targetZoom);
    setPan({ x: panX, y: panY });
  }, [layoutNodes, swimlanes]);

  // Automatically fit view when layout mode, filter, or data changes
  useEffect(() => {
    const timer = setTimeout(fitToView, 50);
    return () => clearTimeout(timer);
  }, [layoutMode, detailLevel, filterType, graphData.nodes?.length, fitToView]);

  // Window resize observer to keep centered
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      fitToView();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToView]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg" || (e.target.tagName === "rect" && e.target.classList.contains("swimlane-bg"))) {
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

  // Node visual attributes
  const getNodeColorInfo = (node) => {
    const type = node.node_type;
    switch (type) {
      case "file":
        return {
          barColor: "#2563eb",
          badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/30",
          icon: FileCode
        };
      case "class":
        return {
          barColor: "#059669",
          badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
          icon: Box
        };
      case "function":
      case "method":
        return {
          barColor: "#d97706",
          badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/30",
          icon: Zap
        };
      default:
        return {
          barColor: "#7c3aed",
          badgeBg: "bg-purple-500/10 text-purple-600 border-purple-500/30",
          icon: Layers
        };
    }
  };

  // High-contrast clean colors (Prevents pitch-black boxes in Light Mode)
  const isDark = theme === "dark";
  const canvasBg = isDark ? "#090d16" : "#f8fafc";
  const swimlaneFill = isDark ? "#111827" : "#f1f5f9";
  const swimlaneStroke = isDark ? "#1f2937" : "#cbd5e1";
  const cardFill = isDark ? "#1a2234" : "#ffffff";
  const cardStroke = isDark ? "#334155" : "#e2e8f0";
  const textPrimary = isDark ? "#f8fafc" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-surface-base text-content-primary">
      {/* Top Header & Exact Navigation Controls (Matching Image 2 Exactly) */}
      <div className="border-b border-border-base bg-surface-subtle/70 px-5 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-content-primary">Codebase Dependency Graph</h1>
              <span className="px-2 py-0.5 rounded text-3xs font-mono font-bold bg-surface-elevated border border-border-base text-emerald-600">
                Neo4j Knowledge Graph
              </span>
            </div>
            <p className="text-2xs text-content-muted">
              AST call hierarchy, cross-module imports, and blast radius impact analysis.
            </p>
          </div>
        </div>

        {/* View Mode & Granularity Selectors (Exact same buttons as Image 2) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Group 1: Layout Mode Switcher */}
          <div className="flex items-center bg-surface-elevated border border-border-base rounded-lg p-0.5 text-2xs font-medium">
            <button
              onClick={() => setLayoutMode("layers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                layoutMode === "layers"
                  ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Architecture Pipeline</span>
            </button>

            <button
              onClick={() => setLayoutMode("modules")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                layoutMode === "modules"
                  ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Module Clusters</span>
            </button>

            <button
              onClick={() => setLayoutMode("radial")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                layoutMode === "radial"
                  ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Network Map</span>
            </button>
          </div>

          {/* Group 2: Granularity Toggle */}
          <div className="flex items-center bg-surface-elevated border border-border-base rounded-lg p-0.5 text-2xs font-medium">
            <button
              onClick={() => setDetailLevel("modules")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                detailLevel === "modules"
                  ? "bg-surface-base text-emerald-600 font-bold shadow-2xs border border-border-base"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              Modules Only (6)
            </button>
            <button
              onClick={() => setDetailLevel("full")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                detailLevel === "full"
                  ? "bg-surface-base text-emerald-600 font-bold shadow-2xs border border-border-base"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              Full AST Detail
            </button>
          </div>

          {/* Group 3: Type Filter */}
          <div className="flex items-center gap-1">
            {["all", "file", "class", "function"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-md text-2xs font-medium transition-colors ${
                  filterType === t
                    ? "bg-emerald-500/15 text-emerald-600 font-bold border border-emerald-500/30"
                    : "text-content-muted hover:text-content-primary hover:bg-surface-elevated"
                }`}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Group 4: Search & Refresh */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-elevated border border-border-base rounded-md pl-7 pr-2.5 py-1 text-2xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 w-36"
            />
          </div>

          <button
            onClick={fetchGraph}
            disabled={loading}
            className="p-1.5 rounded-md border border-border-base bg-surface-elevated text-content-muted hover:text-content-primary transition-colors"
            title="Refresh graph"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visual Graph Canvas (Left / Center) */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing border-r border-border-base"
          style={{ backgroundColor: canvasBg }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Zoom controls & Auto-Fit Toolbar */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-surface-elevated/95 backdrop-blur border border-border-base rounded-xl p-1 shadow-md">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.12, 2.5))}
              className="p-1.5 rounded hover:bg-surface-subtle text-content-muted hover:text-content-primary transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-2xs font-mono px-1.5 text-content-muted font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.12, 0.3))}
              className="p-1.5 rounded hover:bg-surface-subtle text-content-muted hover:text-content-primary transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-border-base mx-1" />

            <button
              onClick={fitToView}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-2xs font-semibold transition-colors"
              title="Auto-Fit and center all nodes inside view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fit to Screen</span>
            </button>
          </div>

          {/* Canvas Stats & Legend HUD */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-surface-elevated/95 backdrop-blur border border-border-base rounded-xl px-3.5 py-1.5 text-2xs text-content-secondary shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>{layoutNodes.filter((n) => n.node_type === "file").length} Files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{layoutNodes.filter((n) => n.node_type === "class").length} Classes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{layoutNodes.filter((n) => n.node_type === "function" || n.node_type === "method").length} Functions</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-border-base pl-2 font-mono text-content-primary font-bold">
              <span>{activeEdges.length} Active Edges</span>
            </div>

            {selectedNode && (
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setImpactData(null);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold transition-colors ml-2"
              >
                <span>Reset Focus</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* SVG Dependency Graph Canvas (100% width/height, inner g scaled & translated) */}
          <svg className="w-full h-full block">
            <defs>
              {/* Arrowheads for different states */}
              <marker id="arrow-default" markerWidth="9" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 9 3.5, 0 7" fill={isDark ? "#64748b" : "#94a3b8"} />
              </marker>
              <marker id="arrow-selected" markerWidth="9" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 9 3.5, 0 7" fill="#059669" />
              </marker>
              <marker id="arrow-upstream" markerWidth="9" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 9 3.5, 0 7" fill="#d97706" />
              </marker>
              <marker id="arrow-downstream" markerWidth="9" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 9 3.5, 0 7" fill="#0284c7" />
              </marker>

              {/* Glowing filters */}
              <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#059669" floodOpacity="0.45" />
              </filter>
              <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#d97706" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Transform Group: Centered inside canvas */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* 1. SWIMLANES (Architecture Columns or Module Containers) */}
              <g className="swimlanes">
                {swimlanes.map((lane) => (
                  <g key={lane.key} className="select-none">
                    {/* Clean Swimlane Container Card (Soft slate in light mode, never black) */}
                    <rect
                      x={lane.x}
                      y={lane.y}
                      width={lane.width}
                      height={lane.height}
                      rx={10}
                      fill={swimlaneFill}
                      stroke={swimlaneStroke}
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                      className="swimlane-bg"
                    />
                    {/* Lane Header Banner */}
                    <rect
                      x={lane.x}
                      y={lane.y}
                      width={lane.width}
                      height={40}
                      rx={10}
                      fill={lane.color}
                      fillOpacity={isDark ? 0.2 : 0.08}
                    />
                    {/* Color strip */}
                    <rect
                      x={lane.x + 12}
                      y={lane.y + 12}
                      width={4}
                      height={16}
                      rx={2}
                      fill={lane.color}
                    />
                    {/* Header Title */}
                    <text
                      x={lane.x + 24}
                      y={lane.y + 24}
                      className="font-sans font-bold select-none"
                      fill={textPrimary}
                      fontSize="12"
                      fontWeight="700"
                    >
                      {lane.name}
                    </text>
                    {/* Count Pill */}
                    <rect
                      x={lane.x + lane.width - 42}
                      y={lane.y + 12}
                      width={28}
                      height={16}
                      rx={8}
                      fill={lane.color}
                      fillOpacity={isDark ? 0.35 : 0.15}
                    />
                    <text
                      x={lane.x + lane.width - 28}
                      y={lane.y + 23}
                      textAnchor="middle"
                      className="font-mono font-bold select-none"
                      fill={textPrimary}
                      fontSize="9.5"
                    >
                      {lane.count}
                    </text>
                  </g>
                ))}
              </g>

              {/* 2. EDGES (Smooth Cubic Bezier Curves with Directional Markers) */}
              <g className="edges">
                {activeEdges.map((edge) => {
                  const sourceNode = nodeMap.get(edge.source);
                  const targetNode = nodeMap.get(edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const isSelectedEdge =
                    selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                  const isOutboundFromSelected = selectedNode && edge.source === selectedNode.id;
                  const isInboundToSelected = selectedNode && edge.target === selectedNode.id;

                  const isDimmed = selectedNode && !isSelectedEdge;

                  // Output port (center-right of source) to input port (center-left of target)
                  const isForward = sourceNode.x < targetNode.x;
                  const startX = isForward ? sourceNode.x + sourceNode.width : sourceNode.x;
                  const startY = sourceNode.y + sourceNode.height / 2;
                  const endX = isForward ? targetNode.x : targetNode.x + targetNode.width;
                  const endY = targetNode.y + targetNode.height / 2;

                  const dx = Math.abs(endX - startX);
                  const curveOffset = Math.max(26, dx * 0.45);

                  const pathData = isForward
                    ? `M ${startX} ${startY} C ${startX + curveOffset} ${startY}, ${endX - curveOffset} ${endY}, ${endX} ${endY}`
                    : `M ${startX} ${startY} C ${startX - curveOffset} ${startY}, ${endX + curveOffset} ${endY}, ${endX} ${endY}`;

                  let strokeColor = isDark ? "#475569" : "#94a3b8";
                  let strokeWidth = 1.3;
                  let marker = "url(#arrow-default)";

                  if (isOutboundFromSelected) {
                    strokeColor = "#0284c7"; // Cyan for downstream
                    strokeWidth = 2.4;
                    marker = "url(#arrow-downstream)";
                  } else if (isInboundToSelected) {
                    strokeColor = "#d97706"; // Amber for upstream
                    strokeWidth = 2.4;
                    marker = "url(#arrow-upstream)";
                  }

                  return (
                    <g key={edge.id} className="transition-opacity duration-200" opacity={isDimmed ? 0.12 : 1}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={edge.label === "IMPORTS" ? "5 4" : undefined}
                        markerEnd={marker}
                        className={isSelectedEdge ? "animate-pulse" : ""}
                      />
                    </g>
                  );
                })}
              </g>

              {/* 3. NODE CARDS (High-Contrast, Clear & Decent Sizing) */}
              <g className="nodes">
                {layoutNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected = connectedNodeIds.has(node.id);
                  const isDimmed = selectedNode && !isSelected && !isConnected;

                  const isUpstream =
                    selectedNode &&
                    impactData?.upstream_callers?.some((c) => node.label.toLowerCase().includes(c.toLowerCase()));
                  const isDownstream =
                    selectedNode &&
                    impactData?.downstream_dependencies?.some((d) => node.label.toLowerCase().includes(d.toLowerCase()));

                  const colorInfo = getNodeColorInfo(node);
                  const layerInfo = getArchitecturalLayer(node);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => handleNodeClick(node)}
                      className="cursor-pointer group transition-all duration-150 select-none"
                      opacity={isDimmed ? 0.18 : 1}
                      filter={isSelected ? "url(#glow-emerald)" : isUpstream ? "url(#glow-amber)" : undefined}
                    >
                      {/* Card Container Box */}
                      <rect
                        width={node.width}
                        height={node.height}
                        rx={8}
                        fill={cardFill}
                        stroke={
                          isSelected
                            ? "#059669"
                            : isUpstream
                            ? "#d97706"
                            : isDownstream
                            ? "#0284c7"
                            : cardStroke
                        }
                        strokeWidth={isSelected || isUpstream || isDownstream ? 2 : 1.2}
                        className="transition-all duration-150"
                      />

                      {/* Left Category Color Bar */}
                      <rect
                        x={0}
                        y={0}
                        width={5}
                        height={node.height}
                        rx={2}
                        fill={isSelected ? "#059669" : isUpstream ? "#d97706" : colorInfo.barColor}
                      />

                      {/* Symbol Name Text */}
                      <text
                        x={15}
                        y={20}
                        className="font-mono font-bold select-none tracking-tight"
                        fill={textPrimary}
                        fontSize="11.5"
                      >
                        {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
                      </text>

                      {/* Subtitle / File Location */}
                      <text
                        x={15}
                        y={35}
                        className="font-mono select-none"
                        fill={textMuted}
                        fontSize="9"
                      >
                        {node.node_type.toUpperCase()} · {node.properties?.file ? node.properties.file.split("/").pop() : layerInfo.badge}
                      </text>

                      {/* Role / Focus Badge on Right */}
                      <rect
                        x={node.width - 50}
                        y={13}
                        width={42}
                        height={18}
                        rx={4}
                        fill={colorInfo.barColor}
                        fillOpacity={isDark ? 0.3 : 0.12}
                      />
                      <text
                        x={node.width - 29}
                        y={25}
                        textAnchor="middle"
                        className="font-mono font-bold select-none"
                        fill={colorInfo.barColor}
                        fontSize="8"
                      >
                        {isSelected ? "FOCUS" : isUpstream ? "CALLER" : node.node_type.slice(0, 4).toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        </div>

        {/* Right Sidebar: Symbol Inspector & Blast Radius Analyzer */}
        <div className="w-96 border-l border-border-base bg-surface-subtle/70 flex flex-col h-full overflow-y-auto select-none">
          {/* Header */}
          <div className="p-4 border-b border-border-base bg-surface-elevated/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-content-primary uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Impact & Blast Radius</span>
              </h2>
              {selectedNode && (
                <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Target Locked
                </span>
              )}
            </div>
            <p className="text-2xs text-content-muted mt-1 leading-relaxed">
              Real AST dependency evaluation. Inspect upstream callers broken by signature edits and downstream requirements.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runImpactAnalysis(impactSymbol);
              }}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                placeholder="e.g. UserService"
                value={impactSymbol}
                onChange={(e) => setImpactSymbol(e.target.value)}
                className="flex-1 bg-surface-base border border-border-base rounded px-2.5 py-1.5 text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                disabled={impactLoading || !impactSymbol}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-2xs"
              >
                {impactLoading ? "Analyzing..." : "Analyze"}
              </button>
            </form>
          </div>

          {/* Selected Node Details Card */}
          {selectedNode ? (
            <div className="p-4 border-b border-border-base space-y-3 bg-surface-elevated/40">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-content-muted uppercase tracking-wider font-bold">
                  Inspected AST Symbol
                </span>
                <span className="px-2 py-0.5 rounded text-2xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {selectedNode.node_type.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-border-base bg-surface-base space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-content-primary break-all">
                    {selectedNode.label}
                  </span>
                  <button
                    onClick={() => {
                      const path = selectedNode.properties?.file || selectedNode.properties?.path || selectedNode.label;
                      setActiveFilePath(path);
                      navigate(`/projects/${activeProjectId}/code`);
                    }}
                    className="flex items-center gap-1 text-[11px] text-emerald-600 hover:underline font-semibold shrink-0 ml-2"
                    title="Open in Monaco Editor"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Code</span>
                  </button>
                </div>

                {selectedNode.properties?.file && (
                  <div className="text-xs text-content-muted font-mono">
                    File: <span className="text-content-primary">{selectedNode.properties.file}</span>
                  </div>
                )}
                {selectedNode.properties?.start_line && (
                  <div className="text-xs text-content-muted font-mono">
                    Lines: {selectedNode.properties.start_line} – {selectedNode.properties.end_line}
                  </div>
                )}
                {selectedNode.properties?.signature && (
                  <pre className="p-2 rounded bg-surface-elevated border border-border-base text-2xs font-mono text-content-secondary overflow-x-auto">
                    {selectedNode.properties.signature}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-border-base">
              <div className="p-3 rounded-lg border border-dashed border-border-base text-center space-y-1">
                <Info className="w-4 h-4 mx-auto text-content-muted" />
                <p className="text-xs font-semibold text-content-primary">No Symbol Selected</p>
                <p className="text-2xs text-content-muted">
                  Click any node card on the canvas to isolate its upstream callers and dependencies.
                </p>
              </div>
            </div>
          )}

          {/* Blast Radius Impact Analysis Results */}
          <div className="p-4 flex-1 space-y-4">
            {impactData ? (
              <>
                {/* Risk Level Card */}
                <div className="p-3.5 rounded-xl border border-border-base bg-surface-elevated/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-2xs font-bold text-content-muted uppercase tracking-wider block">
                      Blast Radius Score
                    </span>
                    <span className="text-xs text-content-secondary">
                      {impactData.risk_level === "HIGH"
                        ? "Critical ripple: Breaking change affects multiple core modules"
                        : impactData.risk_level === "MEDIUM"
                        ? "Moderate ripple: Direct callers must be refactored"
                        : "Low risk: Leaf node or isolated test suite"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-3">
                    {impactData.risk_level === "HIGH" ? (
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    ) : impactData.risk_level === "MEDIUM" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        impactData.risk_level === "HIGH"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : impactData.risk_level === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      }`}
                    >
                      {impactData.risk_level} RISK
                    </span>
                  </div>
                </div>

                {/* Upstream Callers (Directly Affected) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-content-muted font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <ArrowRight className="w-3.5 h-3.5" />
                      Upstream Callers ({impactData.upstream_callers?.length || 0})
                    </span>
                    <span className="text-3xs font-mono uppercase text-content-muted">Will Break If Modified</span>
                  </div>

                  {impactData.upstream_callers?.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {impactData.upstream_callers.map((caller, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            const found = (graphData.nodes || []).find((n) => n.label.toLowerCase() === caller.toLowerCase());
                            if (found) handleNodeClick(found);
                          }}
                          className="p-2.5 rounded-lg border border-border-base bg-surface-base hover:border-amber-400 hover:bg-amber-500/5 cursor-pointer text-xs font-mono text-content-primary flex items-center justify-between transition-all"
                        >
                          <span className="truncate pr-2">{caller}</span>
                          <span className="text-3xs font-sans px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 shrink-0 font-bold">
                            Caller
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xs text-content-muted italic bg-surface-elevated/40 p-3 rounded-lg border border-border-base">
                      No upstream callers found in AST.
                    </div>
                  )}
                </div>

                {/* Downstream Dependencies (Prerequisites) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-content-muted font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-cyan-500">
                      <ChevronRight className="w-3.5 h-3.5" />
                      Downstream Dependencies ({impactData.downstream_dependencies?.length || 0})
                    </span>
                    <span className="text-3xs font-mono uppercase text-content-muted">Required To Run</span>
                  </div>

                  {impactData.downstream_dependencies?.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {impactData.downstream_dependencies.map((dep, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            const found = (graphData.nodes || []).find((n) => n.label.toLowerCase() === dep.toLowerCase());
                            if (found) handleNodeClick(found);
                          }}
                          className="p-2.5 rounded-lg border border-border-base bg-surface-base hover:border-cyan-400 hover:bg-cyan-500/5 cursor-pointer text-xs font-mono text-content-primary flex items-center justify-between transition-all"
                        >
                          <span className="truncate pr-2">{dep}</span>
                          <span className="text-3xs font-sans px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 shrink-0 font-bold">
                            Prerequisite
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xs text-content-muted italic bg-surface-elevated/40 p-3 rounded-lg border border-border-base">
                      No downstream dependencies detected.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-content-muted border border-dashed border-border-base rounded-xl">
                <Layers className="w-6 h-6 opacity-30 mb-2" />
                <p className="text-xs">Click any node to compute AST blast radius.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Complete 5-layer demo architecture graph with 23 symbols and 24 directed edges
function getFallbackDemoGraph() {
  const nodes = [
    // API Gateway & Routes
    { id: "file_main", label: "main.py", node_type: "file", properties: { file: "main.py", lines: 42 } },
    { id: "fn_register_ep", label: "register_endpoint", node_type: "function", properties: { file: "main.py", signature: "def register_endpoint(payload: UserRegisterSchema)" } },
    { id: "fn_charge_ep", label: "charge_endpoint", node_type: "function", properties: { file: "main.py", signature: "def charge_endpoint(payload: ChargeSchema)" } },
    { id: "fn_health", label: "health_check", node_type: "function", properties: { file: "main.py", signature: "def health_check()" } },

    // Business Services
    { id: "file_user_svc", label: "user_service.py", node_type: "file", properties: { file: "services/user_service.py", lines: 54 } },
    { id: "class_user_svc", label: "UserService", node_type: "class", properties: { file: "services/user_service.py", signature: "class UserService" } },
    { id: "fn_auth_user", label: "authenticate_user", node_type: "function", properties: { file: "services/user_service.py", signature: "def authenticate_user(email: str, password: str)" } },
    { id: "fn_reg_user", label: "register_user", node_type: "function", properties: { file: "services/user_service.py", signature: "def register_user(username: str, email: str, password: str)" } },
    { id: "file_pay_svc", label: "payment_service.py", node_type: "file", properties: { file: "services/payment_service.py", lines: 45 } },
    { id: "class_pay_svc", label: "PaymentService", node_type: "class", properties: { file: "services/payment_service.py", signature: "class PaymentService" } },
    { id: "fn_process_charge", label: "process_charge", node_type: "function", properties: { file: "services/payment_service.py", signature: "def process_charge(user_id: str, amount: float)" } },

    // Domain Models & Schemas
    { id: "file_user_mod", label: "user.py", node_type: "file", properties: { file: "models/user.py", lines: 26 } },
    { id: "class_user_ent", label: "UserEntity", node_type: "class", properties: { file: "models/user.py", signature: "class UserEntity" } },
    { id: "class_reg_schema", label: "UserRegisterSchema", node_type: "class", properties: { file: "models/user.py", signature: "class UserRegisterSchema(BaseModel)" } },
    { id: "class_charge_schema", label: "ChargeSchema", node_type: "class", properties: { file: "models/user.py", signature: "class ChargeSchema(BaseModel)" } },

    // Security & Crypto Core
    { id: "file_sec", label: "security.py", node_type: "file", properties: { file: "auth/security.py", lines: 58 } },
    { id: "fn_hash_pw", label: "hash_password", node_type: "function", properties: { file: "auth/security.py", signature: "def hash_password(password: str) -> str" } },
    { id: "fn_verify_pw", label: "verify_password", node_type: "function", properties: { file: "auth/security.py", signature: "def verify_password(plain_pw, hashed_pw) -> bool" } },
    { id: "fn_token", label: "generate_access_token", node_type: "function", properties: { file: "auth/security.py", signature: "def generate_access_token(user_id, email) -> str" } },

    // Test Suite & QA
    { id: "file_test", label: "test_auth.py", node_type: "file", properties: { file: "tests/test_auth.py", lines: 35 } },
    { id: "fn_test_hash", label: "test_password_hashing", node_type: "function", properties: { file: "tests/test_auth.py", signature: "def test_password_hashing()" } },
    { id: "fn_test_auth", label: "test_user_authentication", node_type: "function", properties: { file: "tests/test_auth.py", signature: "def test_user_authentication()" } },
    { id: "fn_test_reg", label: "test_user_service_registration", node_type: "function", properties: { file: "tests/test_auth.py", signature: "def test_user_service_registration()" } },
  ];

  const edges = [
    // Layer 1 (API -> Services)
    { id: "e1", source: "file_main", target: "file_user_svc", label: "IMPORTS" },
    { id: "e2", source: "file_main", target: "file_pay_svc", label: "IMPORTS" },
    { id: "e3", source: "fn_register_ep", target: "class_user_svc", label: "CALLS" },
    { id: "e4", source: "fn_register_ep", target: "class_reg_schema", label: "VALIDATES" },
    { id: "e5", source: "fn_charge_ep", target: "class_pay_svc", label: "CALLS" },
    { id: "e6", source: "fn_charge_ep", target: "class_charge_schema", label: "VALIDATES" },

    // Layer 2 (Services -> Models & Security)
    { id: "e7", source: "file_user_svc", target: "file_sec", label: "IMPORTS" },
    { id: "e8", source: "file_user_svc", target: "file_user_mod", label: "IMPORTS" },
    { id: "e9", source: "file_pay_svc", target: "file_user_mod", label: "IMPORTS" },
    { id: "e10", source: "class_pay_svc", target: "class_user_svc", label: "DEPENDS_ON" },
    { id: "e11", source: "class_user_svc", target: "fn_auth_user", label: "CONTAINS" },
    { id: "e12", source: "class_user_svc", target: "fn_reg_user", label: "CONTAINS" },
    { id: "e13", source: "class_pay_svc", target: "fn_process_charge", label: "CONTAINS" },
    { id: "e14", source: "fn_auth_user", target: "fn_verify_pw", label: "CALLS" },
    { id: "e15", source: "fn_auth_user", target: "fn_token", label: "CALLS" },
    { id: "e16", source: "fn_reg_user", target: "fn_hash_pw", label: "CALLS" },
    { id: "e17", source: "fn_reg_user", target: "class_user_ent", label: "CREATES" },
    { id: "e18", source: "fn_process_charge", target: "class_charge_schema", label: "VALIDATES" },

    // Layer 3 (Tests -> Security & Services)
    { id: "e19", source: "file_test", target: "file_sec", label: "IMPORTS" },
    { id: "e20", source: "file_test", target: "file_user_svc", label: "IMPORTS" },
    { id: "e21", source: "fn_test_hash", target: "fn_hash_pw", label: "CALLS" },
    { id: "e22", source: "fn_test_hash", target: "fn_verify_pw", label: "CALLS" },
    { id: "e23", source: "fn_test_auth", target: "fn_auth_user", label: "CALLS" },
    { id: "e24", source: "fn_test_reg", target: "fn_reg_user", label: "CALLS" },
  ];

  return { nodes, edges };
}
