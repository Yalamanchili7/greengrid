/**
 * GridFuelMix — Shows the user where their electricity actually comes from.
 * 
 * Displays the fuel mix breakdown for their eGRID subregion as a
 * horizontal stacked bar + individual fuel stats. No opinions — just data.
 */

const FUEL_COLORS = {
  coal: { color: '#6B7280', label: 'Coal' },
  gas: { color: '#F59E0B', label: 'Natural gas' },
  nuclear: { color: '#8B5CF6', label: 'Nuclear' },
  hydro: { color: '#3B82F6', label: 'Hydro' },
  wind: { color: '#06B6D4', label: 'Wind' },
  solar: { color: '#F97316', label: 'Solar' },
  oil: { color: '#78716C', label: 'Oil' },
  other: { color: '#10B981', label: 'Other renewables' },
};

export default function GridFuelMix({ gridFuelMix, emissionFactor }) {
  if (!gridFuelMix) return null;

  // Build ordered fuel list (largest first), skip 0% fuels
  const fuels = Object.entries(FUEL_COLORS)
    .map(([key, meta]) => ({
      key,
      ...meta,
      percent: gridFuelMix[key] || 0,
    }))
    .filter(f => f.percent > 0.5)
    .sort((a, b) => b.percent - a.percent);

  const { renewableTotal, fossilTotal, nuclearTotal, subregionName } = gridFuelMix;

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-base text-emerald-50/80 mb-1">
        Your grid's fuel mix
      </h3>
      <p className="text-xs text-emerald-50/30 font-body mb-5">
        {subregionName} — where your electricity comes from
      </p>

      {/* Stacked horizontal bar */}
      <div className="w-full h-6 rounded-lg overflow-hidden flex mb-4">
        {fuels.map((fuel) => (
          <div
            key={fuel.key}
            style={{
              width: `${fuel.percent}%`,
              backgroundColor: fuel.color,
              minWidth: fuel.percent > 2 ? '2px' : '0',
            }}
            title={`${fuel.label}: ${fuel.percent}%`}
            className="transition-all duration-500 hover:opacity-80"
          />
        ))}
      </div>

      {/* Fuel breakdown list */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
        {fuels.map((fuel) => (
          <div key={fuel.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: fuel.color }}
              />
              <span className="text-xs text-emerald-50/50 font-body">{fuel.label}</span>
            </div>
            <span className="text-xs font-mono text-emerald-50/70">{fuel.percent}%</span>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-500/10">
        <div className="text-center">
          <p className="font-display font-bold text-lg text-white">
            {fossilTotal}%
          </p>
          <p className="text-[11px] text-emerald-50/40 font-body">Fossil fuels</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-white">
            {nuclearTotal}%
          </p>
          <p className="text-[11px] text-emerald-50/40 font-body">Nuclear</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-emerald-400">
            {renewableTotal}%
          </p>
          <p className="text-[11px] text-emerald-50/40 font-body">Renewable</p>
        </div>
      </div>

      {/* Context line */}
      <p className="text-[10px] text-emerald-50/20 font-body mt-4 text-center">
        {emissionFactor} lb CO₂/MWh · {emissionFactor < 823
          ? `${Math.round(((823 - emissionFactor) / 823) * 100)}% cleaner than the US average`
          : emissionFactor > 823
          ? `${Math.round(((emissionFactor - 823) / 823) * 100)}% more carbon-intensive than the US average`
          : 'At the US average'
        } · Source: EPA eGRID2023
      </p>
    </div>
  );
}
