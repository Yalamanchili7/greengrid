import { useState } from 'react';
import AddressSearch from './AddressSearch';

const PRESETS = [
  { label: 'Phoenix, AZ', address: 'Phoenix, Arizona', kwh: 1050 },
  { label: 'Austin, TX', address: 'Austin, Texas', kwh: 1150 },
  { label: 'Denver, CO', address: 'Denver, Colorado', kwh: 700 },
  { label: 'Miami, FL', address: 'Miami, Florida', kwh: 1110 },
];

export default function HeroInput({ onAnalyze, loading, error }) {
  const [address, setAddress] = useState('');
  const [monthlyKwh, setMonthlyKwh] = useState('');
  const [billMode, setBillMode] = useState('kwh'); // 'kwh' or 'dollars'
  const [monthlyDollars, setMonthlyDollars] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    let kwh;
    if (billMode === 'dollars') {
      if (!monthlyDollars || parseFloat(monthlyDollars) <= 0) return;
      // We'll use the EIA rate once fetched; for initial conversion use a reasonable estimate
      // The actual rate will be fetched live and used in calculations
      kwh = Math.round(parseFloat(monthlyDollars) / 0.14);
    } else {
      if (!monthlyKwh || parseInt(monthlyKwh) <= 0) return;
      kwh = parseInt(monthlyKwh);
    }

    onAnalyze({ address: address.trim(), monthlyKwh: kwh });
  };

  const handlePreset = (preset) => {
    setAddress(preset.address);
    setMonthlyKwh(preset.kwh.toString());
    setBillMode('kwh');
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-16">
      {/* Decorative grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Animated floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/20"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.2; }
          to { transform: translateY(-20px) scale(1.5); opacity: 0.5; }
        }
      `}</style>

      {/* Badge */}
      <div className="relative mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium font-body
          bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Data-Powered Energy Intelligence
        </span>
      </div>

      {/* Title */}
      <h1 className="relative text-center max-w-3xl mx-auto mb-4">
        <span className="block font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.1]">
          Discover Your Home's
        </span>
        <span className="block font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mt-1 leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #34d399, #10b981, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Energy Future
        </span>
      </h1>

      {/* Subtitle */}
      <p className="relative text-center max-w-xl mx-auto text-base sm:text-lg text-emerald-50/50 font-body mb-10 leading-relaxed">
        Enter your address and electricity usage to get your personalized <strong className="text-emerald-400/80">GreenScore</strong> - a data-driven snapshot of your home's solar potential, energy profile, and carbon footprint.
      </p>

      {/* Input Card */}
      <div className="relative w-full max-w-lg mx-auto">
        <div className="glass-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address Input with Autocomplete */}
            <AddressSearch
              value={address}
              onChange={setAddress}
              onSelect={(suggestion) => {
                setAddress(suggestion.displayName);
              }}
              disabled={loading}
            />

            {/* Monthly Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-50/70 font-body">
                  Monthly Electricity
                </label>
                <div className="flex gap-1 bg-emerald-950/40 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setBillMode('kwh')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium font-body transition-all ${
                      billMode === 'kwh'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-emerald-50/40 hover:text-emerald-50/60'
                    }`}
                  >
                    kWh
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillMode('dollars')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium font-body transition-all ${
                      billMode === 'dollars'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-emerald-50/40 hover:text-emerald-50/60'
                    }`}
                  >
                    $
                  </button>
                </div>
              </div>
              {billMode === 'kwh' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyKwh}
                    onChange={(e) => setMonthlyKwh(e.target.value)}
                    placeholder="900"
                    min="1"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-emerald-950/40 border border-emerald-500/15
                      text-emerald-50 placeholder-emerald-50/25 font-body text-sm
                      focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20
                      transition-all"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-50/30 font-body">kWh/mo</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={monthlyDollars}
                    onChange={(e) => setMonthlyDollars(e.target.value)}
                    placeholder="150"
                    min="1"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-emerald-950/40 border border-emerald-500/15
                      text-emerald-50 placeholder-emerald-50/25 font-body text-sm
                      focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20
                      transition-all"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-500/40 font-body">$</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-50/30 font-body">/month</span>
                </div>
              )}
              <p className="mt-1.5 text-xs text-emerald-50/25 font-body">
                {billMode === 'kwh'
                  ? 'Find this on your electricity bill. US average is ~900 kWh/month.'
                  : "We'll estimate your kWh from your bill amount."}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !address.trim() || (billMode === 'kwh' ? !monthlyKwh : !monthlyDollars)}
              className="w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide
                bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                hover:from-emerald-500 hover:to-emerald-400
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-300 shadow-lg shadow-emerald-500/20
                hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing your home...
                </span>
              ) : (
                'Analyze My Home'
              )}
            </button>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400/80 font-body text-center bg-red-500/10 rounded-lg py-2 px-3">
                {error}
              </p>
            )}
          </form>

          {/* Quick presets */}
          <div className="mt-5 pt-5 border-t border-emerald-500/10">
            <p className="text-xs text-emerald-50/25 font-body mb-2.5 text-center">Try an example</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs font-body text-emerald-400/60
                    bg-emerald-500/5 border border-emerald-500/10
                    hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20
                    transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-50/20 font-body">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          NREL Satellite Data
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Government Data Sources
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          No Data Stored
        </span>
      </div>
    </section>
  );
}
