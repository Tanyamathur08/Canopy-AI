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
      {/* Code Branching Canopy Mark */}
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
            {/* Radiant Sunset Amber Gradient */}
            <linearGradient id="canopyAmberGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>

            {/* Warm Copper Bronze Gradient */}
            <linearGradient id="canopyBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Deep Mahogany Badge Gradient */}
            <linearGradient id="canopyBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#26170F" />
              <stop offset="100%" stopColor="#140C08" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="canopyAmberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Mahogany Badge with Warm Bronze Border */}
          <rect width="48" height="48" rx="14" fill="url(#canopyBadgeBg)" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.35" />

          {/* Root Git Trunk */}
          <path
            d="M24 39V25"
            stroke="url(#canopyBronzeGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Left Branching Commit Pathway into Foliage */}
          <path
            d="M24 32C19 32 14 30 14 24V18C14 15 17 12 21 11"
            stroke="url(#canopyAmberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Branching Commit Pathway into Foliage */}
          <path
            d="M24 32C29 32 34 30 34 24V18C34 15 31 12 27 11"
            stroke="url(#canopyAmberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Apex Trunk */}
          <path
            d="M24 25V12"
            stroke="url(#canopyAmberGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Secondary Delicate Branch Connectors */}
          <path
            d="M14 21L19 16M34 21L29 16"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />

          {/* Git Commit Nodes — Code Base & Trunk */}
          <circle cx="24" cy="38" r="3" fill="#EA580C" stroke="#FDE047" strokeWidth="1.2" />
          <circle cx="24" cy="28" r="2.2" fill="#F59E0B" />

          {/* Branch Fork Nodes */}
          <circle cx="14" cy="24" r="2.5" fill="#F59E0B" />
          <circle cx="34" cy="24" r="2.5" fill="#F59E0B" />

          {/* Mid-Level Canopy Nodes */}
          <circle cx="14" cy="17" r="2.2" fill="#FDE047" />
          <circle cx="34" cy="17" r="2.2" fill="#FDE047" />

          {/* Crown Canopy Nodes (Glowing Leaves) */}
          <circle cx="19" cy="12" r="2.8" fill="url(#canopyAmberGrad)" filter="url(#canopyAmberGlow)" />
          <circle cx="29" cy="12" r="2.8" fill="url(#canopyAmberGrad)" filter="url(#canopyAmberGlow)" />

          {/* Apex AI Core Node (Golden Pulsing Star) */}
          <circle cx="24" cy="7.5" r="3.6" fill="#F59E0B" opacity="0.3" filter="url(#canopyAmberGlow)" />
          <circle cx="24" cy="7.5" r="2.8" fill="#FDE047" filter="url(#canopyAmberGlow)" />
          <circle cx="24" cy="7.5" r="1.2" fill="#FFFFFF" />
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
