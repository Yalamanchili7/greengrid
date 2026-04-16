import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-emerald-950/90 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-body backdrop-blur-sm">
      <p className="text-emerald-50/60 mb-1">Year {label}</p>
      <p className="text-emerald-400 font-semibold">${payload[0].value.toLocaleString()} saved</p>
      {payload[1] && (
        <p className="text-red-400/70">${payload[1].value.toLocaleString()} system cost</p>
      )}
    </div>
  );
};

export default function SavingsChart({ financial, systemCost }) {
  const { annualSavings, paybackYears } = financial;

  // Generate 25-year projection
  const data = [];
  let cumulative = 0;
  for (let year = 0; year <= 25; year++) {
    const degradation = Math.pow(0.995, year);
    const escalation = Math.pow(1.03, year);
    if (year > 0) cumulative += annualSavings * degradation * escalation;
    data.push({
      year,
      savings: Math.round(cumulative),
      cost: systemCost,
    });
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base text-emerald-50/80">
          25-Year Savings Projection
        </h3>
        <span className="text-xs font-body text-emerald-50/60">
          Payback in <strong className="text-emerald-400">{paybackYears} years</strong>
        </span>
      </div>

      <div className="w-full h-56" role="img" aria-label={`25-year savings projection chart showing $${(financial.savings25yr / 1000).toFixed(0)}k total savings`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -5 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: 'rgba(236,253,245,0.3)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={{ stroke: 'rgba(16,185,129,0.1)' }}
              tickLine={false}
              label={{ value: 'Years', position: 'insideBottomRight', offset: -5, style: { fill: 'rgba(236,253,245,0.2)', fontSize: 10 } }}
            />
            <YAxis
              tick={{ fill: 'rgba(236,253,245,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={systemCost}
              stroke="rgba(239,68,68,0.3)"
              strokeDasharray="5 5"
              label={{
                value: 'System Cost',
                position: 'insideTopRight',
                style: { fill: 'rgba(239,68,68,0.5)', fontSize: 10, fontFamily: 'DM Sans' },
              }}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#savingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats below chart */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-500/10">
        <div className="text-center">
          <p className="font-display font-bold text-lg text-white">${(financial.savings5yr / 1000).toFixed(1)}k</p>
          <p className="text-xs text-emerald-50/60 font-body">5-year savings</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-white">${(financial.savings10yr / 1000).toFixed(1)}k</p>
          <p className="text-xs text-emerald-50/60 font-body">10-year savings</p>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-lg text-emerald-400">${(financial.savings25yr / 1000).toFixed(1)}k</p>
          <p className="text-xs text-emerald-50/60 font-body">25-year savings</p>
        </div>
      </div>
    </div>
  );
}
