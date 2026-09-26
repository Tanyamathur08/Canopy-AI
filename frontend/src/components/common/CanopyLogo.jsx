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
      {/* Botanical Canopy Mark */}
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
            <linearGradient id="canopyLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="canopySunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="canopyBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </linearGradient>
          </defs>

          {/* Soft Sage Circular Badge */}
          <rect width="48" height="48" rx="14" fill="url(#canopyBgGrad)" stroke="#A7F3D0" strokeWidth="1.5" />

          {/* Organic Tree Trunk & Branches */}
          <path
            d="M24 38V24M24 24L16 16M24 24L32 16M24 21L20 13M24 21L28 13"
            stroke="#047857"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Canopy Sprout Leaves / Knowledge Nodes */}
          <circle cx="24" cy="9.5" r="4.2" fill="url(#canopyLeafGrad)" />
          <circle cx="15.5" cy="15.5" r="3.8" fill="url(#canopyLeafGrad)" />
          <circle cx="32.5" cy="15.5" r="3.8" fill="url(#canopyLeafGrad)" />
          <circle cx="20" cy="12.5" r="2.8" fill="#34D399" />
          <circle cx="28" cy="12.5" r="2.8" fill="#34D399" />

          {/* Golden Sun Sprout Accent */}
          <circle cx="35" cy="9" r="2.2" fill="url(#canopySunGrad)" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-content-primary ${dim.text}`}>
              Canopy
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              AI
            </span>
          </div>
          <span className={`text-content-muted font-medium tracking-tight ${dim.sub}`}>
            Botanical Codebase Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default CanopyLogo;
