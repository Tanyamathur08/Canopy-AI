import React from "react";

export const CanopyLogo = ({ size = "md", showText = true, className = "" }) => {
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return { icon: 26, text: "text-sm", sub: "text-[9px]" };
      case "lg":
        return { icon: 42, text: "text-xl", sub: "text-xs" };
      case "xl":
        return { icon: 52, text: "text-2xl", sub: "text-sm" };
      case "md":
      default:
        return { icon: 32, text: "text-base", sub: "text-[10px]" };
    }
  };

  const dim = getDimensions();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Exact Canopy Tree Network Constellation Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Tree Trunk & Circuit Branches: Chartreuse to Vibrant Spring Green */}
            <linearGradient id="forestTrunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#A3E635" />
              <stop offset="60%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>

            {/* Canopy Constellation Nodes: Glowing Emerald Foliage */}
            <linearGradient id="canopyNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>

            {/* River Data Flow Shimmer (Subtle ambient glow) */}
            <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Forest Black Badge Background (Circle) */}
          <circle cx="50" cy="50" r="48" fill="#060A07" stroke="#182B1E" strokeWidth="2" />

          {/* Subtle River Current Wave Accent at Base */}
          <path
            d="M 24 84 Q 50 80 76 84"
            stroke="#14B8A6"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />

          {/* ===== 1. TRUNK & CIRCUIT BRANCHES ===== */}
          {/* Center Vertical Trunk */}
          <path
            d="M 50 78 V 44"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Center Trunk "V" Fork Branches */}
          <path
            d="M 43 53 L 50 60 L 57 53"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Circuit Branch */}
          <path
            d="M 43 78 V 62 L 32 51 H 23"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 32 51 V 44"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          {/* Right Circuit Branch */}
          <path
            d="M 57 78 V 62 L 68 51 H 77"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 68 51 V 44"
            stroke="url(#forestTrunkGrad)"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          {/* ===== 2. CANOPY CONSTELLATION EDGES (Dependencies) ===== */}
          <g stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            {/* Center stem to apex */}
            <line x1="50" y1="36" x2="50" y2="24" />

            {/* Center to flanking peaks */}
            <line x1="50" y1="36" x2="39" y2="27" />
            <line x1="50" y1="36" x2="61" y2="27" />

            {/* Left canopy pathway */}
            <line x1="39" y1="27" x2="41" y2="40" />
            <line x1="41" y1="40" x2="32" y2="36" />
            <line x1="32" y1="36" x2="23" y2="35" />
            <line x1="23" y1="35" x2="23" y2="44" />
            <line x1="23" y1="44" x2="14" y2="50" />

            {/* Right canopy pathway */}
            <line x1="61" y1="27" x2="59" y2="40" />
            <line x1="59" y1="40" x2="68" y2="36" />
            <line x1="68" y1="36" x2="77" y2="35" />
            <line x1="77" y1="35" x2="77" y2="44" />
            <line x1="77" y1="44" x2="86" y2="50" />
          </g>

          {/* ===== 3. CANOPY NODES (Components) ===== */}
          <g fill="url(#canopyNodeGrad)">
            {/* Apex Node */}
            <circle cx="50" cy="24" r="3.6" />

            {/* Center Node (Large Core) */}
            <circle cx="50" cy="36" r="5.2" />

            {/* Flanking Peaks */}
            <circle cx="39" cy="27" r="4.2" />
            <circle cx="61" cy="27" r="4.2" />

            {/* Mid Dips */}
            <circle cx="41" cy="40" r="3.2" />
            <circle cx="59" cy="40" r="3.2" />

            {/* Large Canopy Foliage Nodes */}
            <circle cx="32" cy="36" r="5.6" />
            <circle cx="68" cy="36" r="5.6" />

            {/* Outer Corners */}
            <circle cx="23" cy="35" r="3.4" />
            <circle cx="77" cy="35" r="3.4" />

            {/* Outer Vertical Drops */}
            <circle cx="23" cy="44" r="3.4" />
            <circle cx="77" cy="44" r="3.4" />

            {/* Terminal Lowest Nodes */}
            <circle cx="14" cy="50" r="4.6" />
            <circle cx="86" cy="50" r="4.6" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-content-primary ${dim.text}`}>
              Canopy
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              AI
            </span>
          </div>
          <span className={`text-content-muted font-medium tracking-tight ${dim.sub}`}>
            Understand your codebase. Not just your code.
          </span>
        </div>
      )}
    </div>
  );
};

export default CanopyLogo;
