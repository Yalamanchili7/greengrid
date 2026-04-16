import { useState, useEffect } from 'react';

export default function StatCard({ icon, label, value, unit, subtext, delay = 0, color = '#10b981' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`glass-card p-5 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <p className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
        {value}
        {unit && <span className="text-sm font-normal text-emerald-50/60 ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-emerald-50/60 font-body mt-1">{label}</p>
      {subtext && (
        <p className="text-xs text-emerald-50/50 font-body mt-2">{subtext}</p>
      )}
    </div>
  );
}
