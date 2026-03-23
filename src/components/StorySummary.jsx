/**
 * StorySummary — The "aha moment" at the top of the dashboard.
 * 
 * Every location gets a specific, personalized narrative.
 * No generic fallback. The story is built from two axes:
 * - Solar resource (top 10 states vs middle vs bottom 10)
 * - Grid cleanliness (below national avg vs above)
 * Plus financial context layered on top.
 */

export default function StorySummary({ solar, financial, carbon, breakdown, greenScore, gridFuelMix, solarRanking, location }) {
  const state = location?.stateName || 'your state';
  const solarPercent = solar?.coveragePercent || 0;
  const payback = financial?.paybackYears || 0;
  const co2Tons = carbon?.annualOffsetTons || 0;
  const trees = carbon?.treesEquivalent || 0;
  const renewablePercent = gridFuelMix?.renewableTotal || 0;
  const fossilPercent = gridFuelMix?.fossilTotal || 0;
  const coalPercent = gridFuelMix?.coal || 0;
  const solarRank = solarRanking?.rank || 25;
  const totalStates = solarRanking?.totalStates || 51;
  const emissionFactor = carbon?.gridEmissionFactor || 823;
  const annualSavings = financial?.annualSavings || 0;
  const savings25yr = financial?.savings25yr || 0;

  const nationalAvgEmission = 823;
  const gridBelowAvg = emissionFactor < nationalAvgEmission;
  const solarTop10 = solarRank <= 10;
  const solarBottom15 = solarRank > 36;

  let headline = '';
  let detail = '';

  if (solarTop10 && !gridBelowAvg) {
    // Excellent sun + dirty grid = maximum impact
    headline = `Your location has excellent solar potential and a carbon-heavy grid — solar here creates maximum impact.`;
    detail = `${state} ranks #${solarRank} nationally for solar resource. Your grid emits ${emissionFactor} lb CO₂/MWh — above the national average — running on ${fossilPercent}% fossil fuels${coalPercent > 15 ? ` including ${coalPercent}% coal` : ''}. A solar system here would offset ${co2Tons} tons of CO₂ annually (${trees} trees worth) and save $${annualSavings.toLocaleString()}/year, paying for itself in ${payback} years.`;

  } else if (solarTop10 && gridBelowAvg) {
    // Excellent sun + cleaner grid = strong financial play
    headline = `You're in one of the best solar locations in the country${renewablePercent > 25 ? ', and your grid is already making progress on renewables' : ''}.`;
    detail = `${state} ranks #${solarRank} for solar resource — among the best in the US. Your grid is ${renewablePercent}% renewable and emits ${emissionFactor} lb CO₂/MWh, below the national average of ${nationalAvgEmission}. Solar here is a strong financial opportunity: $${annualSavings.toLocaleString()}/year in savings with a ${payback}-year payback, adding up to $${Math.round(savings25yr / 1000)}k over 25 years. It would also offset ${co2Tons} tons of CO₂ annually.`;

  } else if (solarBottom15 && !gridBelowAvg) {
    // Low sun + dirty grid = efficiency first, solar still helps on carbon
    headline = `Your grid is carbon-heavy, which means even modest solar has meaningful environmental impact here.`;
    detail = `Your grid runs on ${fossilPercent}% fossil fuels (${emissionFactor} lb CO₂/MWh), well above the national average. ${state} ranks #${solarRank} of ${totalStates} for solar resource — lower than the sunniest states, but a solar system would still offset ${co2Tons} tons of CO₂ annually because each kWh of solar displaces dirtier grid power. Financially, the payback is ${payback} years with $${annualSavings.toLocaleString()}/year in savings.`;

  } else if (solarBottom15 && gridBelowAvg) {
    // Low sun + clean grid = honest assessment
    headline = `Your grid is already relatively clean, and solar resource here is limited — but the numbers still tell an interesting story.`;
    detail = `Your electricity is ${renewablePercent}% renewable (${emissionFactor} lb CO₂/MWh), cleaner than most of the US. ${state} ranks #${solarRank} of ${totalStates} for solar resource. A solar system could still cover ${solarPercent}% of your usage and save $${annualSavings.toLocaleString()}/year, though the payback (${payback} years) is longer than in sunnier regions. The environmental benefit is smaller since your grid is already cleaner.`;

  } else if (!gridBelowAvg) {
    // Mid solar + dirty grid
    headline = `Your grid relies heavily on fossil fuels — solar at your location would make a real difference.`;
    detail = `Your electricity comes from a grid that's ${fossilPercent}% fossil fuels, emitting ${emissionFactor} lb CO₂/MWh — above the national average of ${nationalAvgEmission}. ${state} ranks #${solarRank} of ${totalStates} for solar resource. A solar system here could cover ${solarPercent}% of your usage, offset ${co2Tons} tons of CO₂ annually, and save $${annualSavings.toLocaleString()}/year with a ${payback}-year payback.`;

  } else {
    // Mid solar + cleaner grid
    headline = `Your grid is cleaner than average, and solar at your location offers solid financial returns.`;
    detail = `Your electricity is ${renewablePercent}% renewable, with emissions of ${emissionFactor} lb CO₂/MWh — below the national average. ${state} ranks #${solarRank} of ${totalStates} for solar resource. A solar system could cover ${solarPercent}% of your usage and save $${annualSavings.toLocaleString()}/year, paying for itself in ${payback} years. Over 25 years, that adds up to $${Math.round(savings25yr / 1000)}k in cumulative savings.`;
  }

  return (
    <div className="glass-card p-6 sm:p-8 mb-5 border-emerald-500/20" data-story-headline={headline} data-story-detail={detail}>
      <p className="font-display font-semibold text-lg sm:text-xl text-white leading-snug mb-3">
        {headline}
      </p>
      <p className="text-sm text-emerald-50/50 font-body leading-relaxed">
        {detail}
      </p>
      <p className="text-[10px] text-emerald-50/15 font-body mt-3">
        Based on real-time data from NREL, EIA, and EPA for your exact coordinates.
      </p>
    </div>
  );
}
