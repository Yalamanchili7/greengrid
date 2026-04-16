import StorySummary from './StorySummary';
import GreenScoreGauge from './GreenScoreGauge';
import StatCard from './StatCard';
import SolarChart from './SolarChart';
import SavingsChart from './SavingsChart';
import SolarRanking from './SolarRanking';
import CarbonImpact from './CarbonImpact';
import GridFuelMix from './GridFuelMix';
import StateIncentives from './StateIncentives';
import Recommendations from './Recommendations';
import DataSources from './DataSources';

export default function Dashboard({ results, location, onReset }) {
  const { greenScore, breakdown, solar, financial, carbon, recommendations, dataSources, gridFuelMix, solarRanking } = results;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Location Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onReset}
            aria-label="Go back and analyze another home"
            className="text-xs text-emerald-400/70 hover:text-emerald-400 font-body mb-2 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Analyze another home
          </button>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Your Energy Report
          </h2>
          <p className="text-sm text-emerald-50/60 font-body mt-1 max-w-lg truncate">
            📍 {location?.displayName || 'Your Location'}
          </p>
        </div>
        <span className="text-xs text-emerald-50/40 font-mono">
          {location?.latitude?.toFixed(2)}°N, {Math.abs(location?.longitude)?.toFixed(2)}°W
        </span>
      </div>

      {/* 1. THE STORY — personalized insight, the aha moment */}
      <StorySummary
        solar={solar}
        financial={financial}
        carbon={carbon}
        breakdown={breakdown}
        greenScore={greenScore}
        gridFuelMix={gridFuelMix}
        solarRanking={solarRanking}
        location={location}
      />

      {/* 2. KEY NUMBERS — GreenScore + 4 stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-5">
        <div className="lg:col-span-4">
          <GreenScoreGauge score={greenScore} breakdown={breakdown} />
        </div>
        <div className="lg:col-span-8 grid grid-cols-2 gap-4 sm:gap-5">
          <StatCard
            icon="☀️"
            label="Annual Solar Output"
            value={solar.annualOutputKwh.toLocaleString()}
            unit="kWh"
            subtext={`${solar.systemSizeKw}kW system · Covers ${solar.coveragePercent}% of your usage`}
            delay={100}
          />
          <StatCard
            icon="💰"
            label="Annual Savings"
            value={`$${financial.annualSavings.toLocaleString()}`}
            subtext={`Pays for itself in ${financial.paybackYears} years · $${Math.round(financial.savings25yr / 1000)}k over 25 years`}
            delay={200}
            color="#34d399"
          />
          <StatCard
            icon="🌍"
            label="CO₂ Offset"
            value={carbon.annualOffsetTons}
            unit="tons/yr"
            subtext={`= ${carbon.treesEquivalent} trees · ${carbon.carsEquivalent} cars off the road`}
            delay={300}
            color="#6ee7b7"
          />
          <StatCard
            icon="🏠"
            label="System Cost"
            value={`$${(solar.systemCost / 1000).toFixed(1)}k`}
            subtext={`After 30% ITC ($${Math.round((solar.systemCost / 0.7 * 0.3) / 100) * 100} tax credit)`}
            delay={400}
            color="#a7f3d0"
          />
        </div>
      </div>

      {/* 3. YOUR GRID — where your electricity comes from */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-5">
        <GridFuelMix gridFuelMix={gridFuelMix} emissionFactor={carbon.gridEmissionFactor} />
        <SolarRanking solarRanking={solarRanking} />
      </div>

      {/* 4. SOLAR DETAILS — monthly output + savings projection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-5">
        <SolarChart
          monthlyOutput={solar.monthlyOutput}
          annualOutput={solar.annualOutputKwh}
        />
        <SavingsChart
          financial={financial}
          systemCost={solar.systemCost}
        />
      </div>

      {/* 5. WHAT THE DATA SHOWS — scenarios */}
      <div className="mb-5">
        <Recommendations recommendations={recommendations} />
      </div>

      {/* 6. INCENTIVES + DATA SOURCES — compact row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-5">
        <StateIncentives stateCode={location?.state} systemCost={solar.systemCost} />
        <DataSources dataSources={dataSources} carbon={carbon} />
      </div>

      {/* 7. DOWNLOAD + NEW ANALYSIS */}
      <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-base text-white mb-1">
            Save your energy report
          </h3>
          <p className="text-xs text-emerald-50/50 font-body">
            Download a PDF with your complete energy analysis, data sources, and financial projections.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={async () => {
              try {
                const { generateReport } = await import('../utils/reportGenerator');
                // Get the story text from the StorySummary component's logic
                const storyEl = document.querySelector('[data-story-headline]');
                const headline = storyEl?.getAttribute('data-story-headline') || '';
                const detail = storyEl?.getAttribute('data-story-detail') || '';
                await generateReport({
                  results,
                  location,
                  storyHeadline: headline,
                  storyDetail: detail,
                });
              } catch (err) {
                console.error('PDF generation failed:', err);
                alert('PDF generation failed. Please try again.');
              }
            }}
            aria-label="Download energy report as PDF"
            className="px-4 py-2 rounded-xl font-display font-semibold text-sm
              bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
              hover:from-emerald-500 hover:to-emerald-400
              transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]
              flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl font-display font-semibold text-sm
              bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
              hover:bg-emerald-500/15 transition-all"
          >
            New Analysis
          </button>
        </div>
      </div>
    </section>
  );
}
