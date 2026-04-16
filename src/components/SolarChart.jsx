import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-emerald-950/90 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs font-body backdrop-blur-sm">
      <p className="text-emerald-50/60 mb-1">{label}</p>
      <p className="text-emerald-400 font-semibold">{payload[0].value.toLocaleString()} kWh</p>
    </div>
  );
};

export default function SolarChart({ monthlyOutput, annualOutput }) {
  const data = MONTHS.map((month, i) => ({
    month,
    output: Math.round(monthlyOutput[i] || 0),
  }));

  const maxOutput = Math.max(...data.map(d => d.output));

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base text-emerald-50/80">
          Monthly Solar Generation
        </h3>
        <span className="text-xs font-mono text-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 rounded-md">
          {annualOutput.toLocaleString()} kWh/yr
        </span>
      </div>

      <div className="w-full h-56" role="img" aria-label={`Monthly solar generation chart showing ${annualOutput.toLocaleString()} kWh per year`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'rgba(236,253,245,0.3)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={{ stroke: 'rgba(16,185,129,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(236,253,245,0.25)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
            <Bar dataKey="output" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`rgba(16,185,129,${0.3 + (entry.output / maxOutput) * 0.5})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
