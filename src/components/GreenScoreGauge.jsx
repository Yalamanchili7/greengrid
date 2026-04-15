import { useState, useEffect } from 'react';
import { getScoreLabel } from '../utils/greenScore';

export default function GreenScoreGauge({ score, breakdown }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { label, color } = getScoreLabel(score);

  // Animate score counting up
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => requestAnimationFrame(animate), 300);
    return () => clearTimeout(timer);
  }, [score]);

  // SVG ring calculations
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const breakdownItems = [
    { label: 'Solar Potential', value: breakdown.solar, icon: '☀️' },
    { label: 'Efficiency', value: breakdown.efficiency, icon: '⚡' },
    { label: 'Grid Cleanliness', value: breakdown.gridClean, icon: '🌿' },
    { label: 'Feasibility', value: breakdown.feasibility, icon: '💰' },
  ];

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col items-center">
      <h2 className="font-display font-semibold text-lg text-emerald-50/80 mb-1">
        Your GreenScore
      </h2>
      <p className="text-xs text-emerald-50/30 font-body mb-5 text-center">
        How well-positioned your home is for clean energy
      </p>

      {/* Gauge Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(16,185,129,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="greenscore-ring"
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-bold text-5xl tabular-nums"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-emerald-50/40 font-body mt-1">out of 100</span>
          <span
            className="mt-2 px-3 py-0.5 rounded-full text-xs font-semibold font-body"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Breakdown toggle */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="mt-6 text-xs text-emerald-400/50 hover:text-emerald-400 font-body transition-colors flex items-center gap-1"
      >
        {showBreakdown ? 'Hide' : 'Show'} breakdown
        <svg
          className={`w-3 h-3 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Breakdown bars */}
      {showBreakdown && (
        <div className="w-full mt-4 space-y-3">
          {breakdownItems.map((item, i) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-emerald-50/50 font-body flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-xs font-mono text-emerald-400/70">{item.value}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-emerald-950/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: color,
                    opacity: 0.6 + (item.value / 250),
                    transitionDelay: `${i * 150 + 500}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
