export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Satellite Solar Data',
      description: 'We pull 20+ years of solar irradiance data from NREL\'s National Solar Radiation Database for your exact coordinates.',
      icon: '🛰️',
    },
    {
      num: '02',
      title: 'PV System Modeling',
      description: 'Using the PVWatts engine, we simulate a solar system optimized for your roof — factoring in tilt, orientation, shading, and system losses.',
      icon: '⚡',
    },
    {
      num: '03',
      title: 'Grid & Rate Analysis',
      description: 'We cross-reference EPA emission data and EIA utility rates for your region to calculate both carbon impact and financial savings.',
      icon: '📊',
    },
    {
      num: '04',
      title: 'GreenScore Engine',
      description: 'Our composite scoring algorithm weighs solar potential (35%), energy efficiency (25%), grid cleanliness (25%), and economic feasibility (15%) into a single actionable score.',
      icon: '🧮',
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-base text-emerald-50/80 mb-6">
        How It Works
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg">
              {step.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-emerald-500/40">{step.num}</span>
                <h4 className="text-sm font-display font-semibold text-emerald-50/80">{step.title}</h4>
              </div>
              <p className="text-xs text-emerald-50/35 font-body leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-emerald-500/10">
        <p className="text-[10px] text-emerald-50/20 font-body text-center">
          Built by Sundeep Yalamanchili — AI Engineer specializing in decision intelligence for utility-scale clean energy.
          Open source. No sales. Just data.
        </p>
      </div>
    </div>
  );
}
