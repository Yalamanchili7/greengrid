/**
 * StateIncentives — Shows federal incentives and links to authoritative
 * sources for state-specific data.
 * 
 * We do NOT maintain our own state incentive database because:
 * - Incentives change frequently (quarterly in some states)
 * - Incorrect incentive data could mislead financial decisions
 * - DSIRE is the authoritative source, maintained by NC State / DOE
 * 
 * What we show: Federal ITC (stable, universal, codified in law)
 * What we link to: DSIRE for state-specific programs
 */

// State code to full name for DSIRE URL
const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
  IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
  ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',
  OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
  TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',
  WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia',
};

export default function StateIncentives({ stateCode, systemCost }) {
  const stateName = STATE_NAMES[stateCode?.toUpperCase()] || stateCode;
  const dsireUrl = `https://programs.dsireusa.org/system/program?state=${stateCode?.toUpperCase()}&technology=Solar%20Photovoltaics`;

  // Federal ITC calculation — this is law (IRC §25D, IRA 2022), stable through 2032
  const grossCost = systemCost ? Math.round(systemCost / 0.70) : null; // Reverse the 30% discount
  const federalSavings = grossCost ? Math.round(grossCost * 0.30) : null;

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-base text-emerald-50/80 mb-1">
        Incentives at your location
      </h3>
      <p className="text-xs text-emerald-50/30 font-body mb-5">
        Federal programs + links to {stateName} state incentives
      </p>

      {/* Federal ITC — the one thing we can show with confidence */}
      <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🏛️</span>
              <span className="text-sm font-body font-medium text-emerald-50/80">
                Federal solar tax credit (ITC)
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                30% off
              </span>
            </div>
            <p className="text-xs text-emerald-50/40 font-body leading-relaxed">
              Deduct 30% of your total solar installation cost from your federal income taxes. 
              Available for residential systems through 2032, then steps down to 26% (2033) and 22% (2034).
            </p>
          </div>
        </div>

        {systemCost && federalSavings && (
          <div className="mt-3 pt-3 border-t border-emerald-500/10">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-emerald-50/40 font-body">Your estimated federal tax credit</span>
              <span className="font-display font-bold text-lg text-emerald-400">
                ${federalSavings.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-emerald-50/25 font-body mt-1">
              Based on estimated gross system cost of ${grossCost?.toLocaleString()}
            </p>
          </div>
        )}

        <p className="text-[10px] text-emerald-50/20 font-body mt-2">
          Source: Inflation Reduction Act of 2022, IRC §25D
        </p>
      </div>

      {/* State incentives — link to DSIRE */}
      <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">📋</span>
          <span className="text-sm font-body font-medium text-emerald-50/80">
            {stateName} state incentives
          </span>
        </div>
        <p className="text-xs text-emerald-50/40 font-body leading-relaxed mb-3">
          State incentives vary and change frequently — including tax credits, rebates, net metering policies, 
          sales tax exemptions, property tax exemptions, and SREC programs. The most accurate 
          and current information comes from DSIRE, the US Department of Energy's official incentive database.
        </p>
        <a
          href={dsireUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium
            bg-emerald-500/15 text-emerald-400 border border-emerald-500/20
            hover:bg-emerald-500/25 hover:border-emerald-500/30 transition-all"
        >
          View {stateName} solar incentives on DSIRE
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Additional resources */}
      <div className="space-y-2">
        <p className="text-xs text-emerald-50/40 font-body font-medium">Other resources</p>
        <a
          href={`https://www.energy.gov/eere/solar/homeowners-guide-going-solar`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-500/5 hover:border-emerald-500/15 transition-all group"
        >
          <div>
            <span className="text-xs font-body text-emerald-50/60 group-hover:text-emerald-50/80 transition-colors">Energy.gov</span>
            <p className="text-[11px] text-emerald-50/25 font-body">DOE homeowner's guide to going solar</p>
          </div>
          <svg className="w-3 h-3 text-emerald-50/20 group-hover:text-emerald-50/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <p className="text-[10px] text-emerald-50/15 font-body mt-4 text-center">
        GreenGrid does not provide financial advice. Incentive information is for educational purposes only. 
        Consult a tax professional for advice specific to your situation.
      </p>
    </div>
  );
}