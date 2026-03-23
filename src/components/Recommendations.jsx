/**
 * Scenarios — "What If" scenarios showing potential impact
 * 
 * NOT recommendations. We show data-driven scenarios and let
 * the homeowner decide what's right for them.
 */

const scenarioStyles = {
  high: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', tag: 'Largest impact' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', tag: 'Moderate impact' },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', tag: 'Incremental' },
};

export default function Recommendations({ recommendations }) {
  if (!recommendations?.length) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-base text-emerald-50/80 mb-1">
        What the Data Shows
      </h3>
      <p className="text-xs text-emerald-50/30 font-body mb-5">
        Scenarios based on your location and usage — not advice, just the numbers.
      </p>

      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const style = scenarioStyles[rec.impact] || scenarioStyles.medium;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all duration-300`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-display font-semibold text-sm text-emerald-50/90">
                  {rec.title}
                </h4>
                <div className="flex items-center gap-2 shrink-0">
                  {rec.delta && (
                    <span className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {rec.delta}
                    </span>
                  )}
                  {/* Fallback for old savings field */}
                  {!rec.delta && rec.savings && (
                    <span className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {rec.savings}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-emerald-50/40 font-body leading-relaxed">
                {rec.description}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-emerald-50/15 font-body mt-4 text-center">
        These scenarios are calculated from government data for your specific location. 
        GreenGrid does not sell solar products or services.
      </p>
    </div>
  );
}
