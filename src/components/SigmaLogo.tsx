import React from 'react';
import { WifiOff, Sparkles, Zap, ShieldCheck, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

export interface MasterMpiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  showAcronym?: boolean;
  showDeveloperBadge?: boolean;
  animated?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MasterMpiLogo: React.FC<MasterMpiLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  showAcronym = false,
  showDeveloperBadge = false,
  animated = true,
  interactive = true,
  className = '',
  onClick
}) => {
  // Dimensions map
  const sizeConfig = {
    xs: { icon: 26, width: 'w-6.5 h-6.5', text: 'text-xs', sub: 'text-[9px]', badge: 'text-[8px] px-1 py-0.2' },
    sm: { icon: 34, width: 'w-8.5 h-8.5', text: 'text-sm', sub: 'text-[10px]', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 44, width: 'w-11 h-11', text: 'text-base sm:text-lg', sub: 'text-[11px]', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 60, width: 'w-15 h-15', text: 'text-xl sm:text-2xl', sub: 'text-xs', badge: 'text-[11px] px-2.5 py-0.5' },
    xl: { icon: 84, width: 'w-21 h-21', text: 'text-2xl sm:text-3xl', sub: 'text-sm', badge: 'text-xs px-3 py-1' }
  };

  const currentSize = sizeConfig[size];

  const handleClick = () => {
    if (interactive) {
      sound.playSuccess();
    }
    onClick?.();
  };

  return (
    <div 
      className={`inline-flex items-center gap-3 select-none ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      onClick={handleClick}
      title="MASTERMPI: Smart MPI & Gamification Engine - Generator Media Pembelajaran Interaktif Mandiri (@ajisosiologi 2026)"
    >
      {/* Animated Vector Logo Mark */}
      <div className={`relative ${currentSize.width} shrink-0 flex items-center justify-center`}>
        
        {/* Ambient Glow Aura */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/35 via-blue-600/40 to-indigo-600/35 rounded-2xl blur-md anim-sigma-ring pointer-events-none" />
        )}

        {/* Orbiting Tech Ring */}
        {animated && size !== 'xs' && (
          <div className="absolute -inset-1 rounded-2xl border border-cyan-400/40 border-dashed anim-sigma-spin pointer-events-none" />
        )}

        {/* Logo Container Box */}
        <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-cyan-400/50 shadow-lg flex items-center justify-center overflow-hidden ${interactive ? 'group-hover:scale-105 group-hover:border-cyan-300 transition-all duration-300' : ''}`}>
          
          {/* Shimmer Light Bar */}
          {animated && (
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 anim-sigma-shimmer pointer-events-none" />
          )}

          {/* SVG Geometric 'M' Master Monogram with Neural Spark */}
          <svg
            viewBox="0 0 100 100"
            className="w-[82%] h-[82%] drop-shadow-[0_2px_10px_rgba(6,182,212,0.65)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="mLeftPillar" x1="14" y1="20" x2="30" y2="82" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              <linearGradient id="mRightPillar" x1="86" y1="20" x2="70" y2="82" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              <linearGradient id="mCenterLeft" x1="24" y1="22" x2="50" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              <linearGradient id="mCenterRight" x1="76" y1="22" x2="50" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient id="nodeGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient id="crownGrad" x1="30" y1="12" x2="70" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Circuit connection traces */}
            <path d="M 22 50 H 12 M 78 50 H 88 M 50 64 V 82" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Left Vertical Pillar */}
            <path
              d="M 16 26 C 16 22 20 18 24 18 L 26 18 C 30 18 34 22 34 26 L 34 76 C 34 80 30 84 26 84 L 24 84 C 20 84 16 80 16 76 Z"
              fill="url(#mLeftPillar)"
            />

            {/* Right Vertical Pillar */}
            <path
              d="M 66 26 C 66 22 70 18 74 18 L 76 18 C 80 18 84 22 84 26 L 84 76 C 84 80 80 84 76 84 L 74 84 C 70 84 66 80 66 76 Z"
              fill="url(#mRightPillar)"
            />

            {/* Left Diagonal Chevron */}
            <path
              d="M 26 22 L 50 60 L 42 66 L 22 32 Z"
              fill="url(#mCenterLeft)"
            />

            {/* Right Diagonal Chevron */}
            <path
              d="M 74 22 L 50 60 L 58 66 L 78 32 Z"
              fill="url(#mCenterRight)"
            />

            {/* Central Master Peak / Apex Crystal */}
            <polygon
              points="50,14 58,26 42,26"
              fill="url(#crownGrad)"
              className="drop-shadow-[0_0_6px_#fbbf24]"
            />

            {/* Central Convergence Core Spark */}
            <circle cx="50" cy="62" r="6.5" fill="url(#nodeGlow)" className="animate-pulse" />
            <circle cx="50" cy="62" r="10.5" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" className="anim-sigma-spin" />

            {/* Offline Lightning Badge in top right */}
            <path
              d="M 78 8 L 71 18 H 76 L 73 26 L 81 15 H 76 L 78 8 Z"
              fill="#fbbf24"
              className="drop-shadow-[0_0_5px_#fbbf24]"
            />
          </svg>

          {/* Autonomous Active Green Dot */}
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
        </div>
      </div>

      {/* Typography & Wordmark */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-black tracking-tight text-white ${currentSize.text} leading-none drop-shadow-xs`}>
              MASTER
            </span>
            <span className={`font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent ${currentSize.text} leading-none`}>
              MPI
            </span>
            
            {/* 100% Offline Badge */}
            <span className={`font-black uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1 ${currentSize.badge}`}>
              <WifiOff size={size === 'xs' ? 9 : 11} className="text-cyan-400" />
              <span>100% Offline</span>
            </span>
          </div>

          {/* Subtitle / Meaning */}
          {showSubtitle && (
            <div className={`font-bold text-slate-400 tracking-tight mt-0.5 truncate flex items-center gap-1.5 ${currentSize.sub}`}>
              <span className="text-blue-400">Smart MPI & Gamification Engine</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-medium">@ajisosiologi 2026</span>
            </div>
          )}

          {/* Developer / Extra Credit (Optional) */}
          {(showAcronym || showDeveloperBadge) && (
            <div className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 line-clamp-1">
              Generator Media Pembelajaran Interaktif Mandiri • Inovasi @ajisosiologi 2026
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const SigmaLogo = MasterMpiLogo;
export type SigmaLogoProps = MasterMpiLogoProps;

