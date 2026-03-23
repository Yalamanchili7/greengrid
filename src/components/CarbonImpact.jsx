export default function CarbonImpact({ carbon }) {
  const { annualOffsetTons, treesEquivalent, carsEquivalent } = carbon;

  const impacts = [
    {
      icon: '🌳',
      value: treesEquivalent.toLocaleString(),
      label: 'Trees Planted',
      sub: 'equivalent per year',
    },
    {
      icon: '🚗',
      value: carsEquivalent,
      label: 'Cars Off Road',
      sub: 'equivalent per year',
    },
    {
      icon: '🏭',
      value: annualOffsetTons,
      label: 'Tons CO₂',
      sub: 'offset annually',
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-base text-emerald-50/80 mb-5">
        Carbon Impact
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {impacts.map((item, i) => (
          <div key={item.label} className="text-center">
            <div
              className="text-3xl mb-2"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              {item.icon}
            </div>
            <p className="font-display font-bold text-xl sm:text-2xl text-white">
              {item.value}
            </p>
            <p className="text-xs text-emerald-400/70 font-body font-medium mt-0.5">
              {item.label}
            </p>
            <p className="text-[10px] text-emerald-50/25 font-body mt-0.5">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* 10% adoption callout */}
      <div className="mt-5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <p className="text-xs text-emerald-50/40 font-body text-center leading-relaxed">
          If <strong className="text-emerald-400/70">10% of US homeowners</strong> made this switch, we could offset{' '}
          <strong className="text-emerald-400/70">~78 million tons of CO₂</strong> annually —
          equivalent to planting <strong className="text-emerald-400/70">1.3 billion trees</strong>.
        </p>
      </div>
    </div>
  );
}
