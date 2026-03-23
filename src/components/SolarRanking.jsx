/**
 * SolarRanking — Shows how this location's solar resource compares nationally.
 * Compact visual with a position marker on a gradient bar.
 */

export default function SolarRanking({ solarRanking }) {
  if (!solarRanking) return null;

  const { dailySolarRadiation, percentile, rank, totalStates, description } = solarRanking;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm text-emerald-50/80">
          Your solar resource
        </h3>
        <span className="text-xs font-mono text-emerald-400/60 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          #{rank} of {totalStates} states
        </span>
      </div>

      {/* Main stat */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-display font-bold text-3xl text-white">
          {dailySolarRadiation}
        </span>
        <span className="text-sm text-emerald-50/40 font-body">kWh/m²/day avg</span>
      </div>

      {/* Ranking bar */}
      <div className="relative mb-2">
        {/* Bar background with gradient from red (low) to green (high) */}
        <div className="w-full h-3 rounded-full overflow-hidden flex">
          <div className="h-full flex-1" style={{ backgroundColor: 'rgba(239,68,68,0.3)' }} />
          <div className="h-full flex-1" style={{ backgroundColor: 'rgba(245,158,11,0.3)' }} />
          <div className="h-full flex-1" style={{ backgroundColor: 'rgba(234,179,8,0.3)' }} />
          <div className="h-full flex-1" style={{ backgroundColor: 'rgba(52,211,153,0.3)' }} />
          <div className="h-full flex-1" style={{ backgroundColor: 'rgba(16,185,129,0.4)' }} />
        </div>

        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${Math.min(Math.max(percentile, 3), 97)}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: percentile >= 80 ? '#10b981'
              : percentile >= 60 ? '#34d399'
              : percentile >= 40 ? '#fbbf24'
              : percentile >= 20 ? '#f97316'
              : '#ef4444',
            boxShadow: `0 0 8px ${percentile >= 60 ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
          }}
        />
      </div>

      {/* Labels under bar */}
      <div className="flex justify-between text-[10px] text-emerald-50/20 font-body mb-3">
        <span>Low solar</span>
        <span>US average</span>
        <span>High solar</span>
      </div>

      {/* Description */}
      <p className="text-xs text-emerald-50/40 font-body leading-relaxed">
        {description}. Your location receives an average of {dailySolarRadiation} kWh/m² of solar radiation per day
        {rank === 1
          ? ' — the highest of any US state.'
          : percentile >= 50
          ? ` — more than ${Math.min(percentile, 99)}% of US states.`
          : ` — less than ${100 - percentile}% of US states.`}
      </p>

      <p className="text-[10px] text-emerald-50/15 font-body mt-2">
        Source: NREL National Solar Radiation Database
      </p>
    </div>
  );
}