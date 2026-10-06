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
      {/* Sleek Modern Monogram 'C' Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dim.icon}
          height={dim.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Radiant Sunset Copper to Golden Amber Gradient */}
            <linearGradient id="monogramRibbon" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Inner Depth Ribbon Gradient */}
            <linearGradient id="monogramDepth" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C2410C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Deep Mahogany Badge Base */}
            <linearGradient id="monogramBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#24150D" />
              <stop offset="100%" stopColor="#130B07" />
            </linearGradient>

            {/* Radiant Amber Glow */}
            <filter id="monogramGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Premium Mahogany Emblem Shield with Warm Bronze Border */}
          <rect width="48" height="48" rx="14" fill="url(#monogramBadgeBg)" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.35" />

          {/* Ambient Core Halo */}
          <circle cx="24" cy="24" r="14" fill="#F59E0B" opacity="0.08" filter="url(#monogramGlow)" />

          {/* Primary Monogram 'C' Continuous Ribbon */}
          <path
            d="M34.5 34 C29 39 19 39.5 13.8 33.5 C9.2 28.2 9.2 19.8 13.8 14.5 C19 8.5 29 9 34.5 14"
            stroke="url(#monogramRibbon)"
            strokeWidth="4.8"
            strokeLinecap="round"
          />

          {/* Inner Dimensional Canopy Crest */}
          <path
            d="M31.5 16 C27.2 12.2 20 12.8 16 16.5 C12.8 20 12.8 28 16 31.5 C20 35.2 27.2 35.8 31.5 32"
            stroke="url(#monogramDepth)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* Central AI Quantum Spark (Nested inside the 'C' curvature) */}
          <path
            d="M27.5 19.5 Q27.5 24 32 24 Q27.5 24 27.5 28.5 Q27.5 24 23 24 Q27.5 24 27.5 19.5 Z"
            fill="#FDE047"
            filter="url(#monogramGlow)"
          />
          {/* Precision Spark Core */}
          <circle cx="27.5" cy="24" r="1.3" fill="#FFFFFF" />

          {/* Accent Micro-Orbit Synapse */}
          <circle cx="34.5" cy="24" r="1.5" fill="#F59E0B" opacity="0.85" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-content-primary ${dim.text}`}>
              Canopy
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              AI
            </span>
          </div>
          <span className={`text-content-muted font-medium tracking-tight ${dim.sub}`}>
            AI Codebase Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default CanopyLogo;
