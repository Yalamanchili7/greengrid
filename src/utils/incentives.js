/**
 * State Solar Incentives & Policies
 * 
 * Sources:
 * - Federal: IRS / Energy.gov (ITC provisions under Inflation Reduction Act)
 * - State: DSIRE Summary Tables (dsireusa.org), publicly available
 * - Net metering: DSIRE state policies as of 2025
 * 
 * Note: Incentives change frequently. This data is current as of early 2025.
 * For the latest information, users should verify at dsireusa.org.
 * 
 * DSIRE API is subscription-based. This is a curated static dataset
 * from publicly available DSIRE summary tables and state program websites.
 */

// Federal incentive (applies to all states)
export const FEDERAL_ITC = {
  rate: 0.30,  // 30% Investment Tax Credit
  name: 'Federal Solar Investment Tax Credit (ITC)',
  description: 'Deduct 30% of solar installation costs from federal taxes. Available through 2032, then steps down to 26% (2033) and 22% (2034).',
  source: 'Inflation Reduction Act of 2022, IRC §25D',
  expires: '2032 (at 30%)',
};

/**
 * State-level solar incentives
 * Each state has: stateTaxCredit, netMetering, salesTaxExemption,
 * propertyTaxExemption, srecs, additionalIncentives
 */
export const STATE_INCENTIVES = {
  AZ: {
    stateTaxCredit: { available: true, rate: 0.25, cap: 1000, description: 'Arizona offers a 25% residential solar tax credit, capped at $1,000.' },
    netMetering: { available: true, type: 'Full retail', description: 'Net metering available through APS and SRP. Excess generation credited at or near retail rate.' },
    salesTaxExemption: { available: true, description: 'Solar energy devices are exempt from state sales tax (TPT).' },
    propertyTaxExemption: { available: true, description: 'Solar installations are exempt from property tax assessment increases.' },
    srecs: { available: false },
    additionalIncentives: ['APS offers solar communities program for renters'],
    summary: 'Arizona has strong solar incentives with tax credits, net metering, and tax exemptions. Combined with excellent solar resource, it\'s one of the best states for residential solar.',
  },
  CA: {
    stateTaxCredit: { available: false },
    netMetering: { available: true, type: 'NEM 3.0 (reduced)', description: 'Net Billing Tariff (NEM 3.0) since April 2023. Export credits significantly reduced from previous NEM 2.0 rates. Battery storage now essential for maximizing savings.' },
    salesTaxExemption: { available: false, description: 'Solar equipment subject to standard sales tax.' },
    propertyTaxExemption: { available: true, description: 'Active solar energy systems excluded from property tax reassessment through 2025.' },
    srecs: { available: false },
    additionalIncentives: ['Self-Generation Incentive Program (SGIP) for battery storage', 'DAC-SASH program for low-income households'],
    summary: 'California\'s NEM 3.0 reduced net metering benefits significantly. Battery storage is now critical for maximizing solar value. High electricity rates still make solar financially viable.',
  },
  TX: {
    stateTaxCredit: { available: false },
    netMetering: { available: false, description: 'Texas does not have a statewide net metering mandate. Some utilities offer voluntary programs. Check with your retail electricity provider.' },
    salesTaxExemption: { available: true, description: 'Solar panels are exempt from state sales tax under the solar energy device exemption.' },
    propertyTaxExemption: { available: true, description: '100% property tax exemption for the appraised value added by solar installation.' },
    srecs: { available: false },
    additionalIncentives: ['Austin Energy offers value-of-solar tariff', 'CPS Energy (San Antonio) offers solar rebates'],
    summary: 'Texas lacks statewide net metering but offers strong property and sales tax exemptions. Local utility programs vary significantly — check your specific provider.',
  },
  NY: {
    stateTaxCredit: { available: true, rate: 0.25, cap: 5000, description: 'New York offers a 25% state tax credit for solar, up to $5,000.' },
    netMetering: { available: true, type: 'Full retail (VDER for larger)', description: 'Net metering at full retail rate for residential systems. Value of Distributed Energy Resources (VDER) tariff for larger systems.' },
    salesTaxExemption: { available: true, description: 'Solar equipment exempt from state and most local sales taxes.' },
    propertyTaxExemption: { available: true, description: '15-year real property tax exemption for solar/wind installations.' },
    srecs: { available: true, description: 'New York has Tier 1 RECs under the Clean Energy Standard. Value varies by market.' },
    additionalIncentives: ['NY-Sun incentives through NYSERDA', 'Affordable Solar program for LMI households'],
    summary: 'New York has some of the strongest solar incentives in the US — 25% state tax credit, full net metering, tax exemptions, and NYSERDA rebates. High electricity rates make solar very attractive financially.',
  },
  CO: {
    stateTaxCredit: { available: false },
    netMetering: { available: true, type: 'Full retail', description: 'Net metering available statewide. Excess generation credited at retail rate.' },
    salesTaxExemption: { available: true, description: 'Residential renewable energy equipment exempt from state sales tax.' },
    propertyTaxExemption: { available: true, description: 'Solar installations exempt from property tax increases.' },
    srecs: { available: false },
    additionalIncentives: ['Xcel Energy offers solar rebates', 'Colorado RENU Loan program for financing'],
    summary: 'Colorado offers solid net metering and tax exemptions. Xcel Energy rebates can further reduce costs. Good solar resource along the Front Range.',
  },
  FL: {
    stateTaxCredit: { available: false },
    netMetering: { available: true, type: 'Full retail', description: 'Net metering at full retail rate, mandated for investor-owned utilities.' },
    salesTaxExemption: { available: true, description: 'Solar energy systems exempt from state sales tax.' },
    propertyTaxExemption: { available: true, description: '100% property tax exemption for residential solar installations (constitutional amendment).' },
    srecs: { available: false },
    additionalIncentives: [],
    summary: 'Florida offers strong tax exemptions and full retail net metering. No state tax credit, but the sales and property tax exemptions are valuable.',
  },
  OH: {
    stateTaxCredit: { available: false },
    netMetering: { available: true, type: 'Full retail', description: 'Net metering available for systems up to 25 kW. Credited at retail rate.' },
    salesTaxExemption: { available: false },
    propertyTaxExemption: { available: true, description: 'Solar energy systems exempt from property tax for the added value.' },
    srecs: { available: true, description: 'Ohio has SRECs under its Renewable Portfolio Standard. Value varies by market.' },
    additionalIncentives: [],
    summary: 'Ohio has net metering and SRECs. Grid is carbon-heavy (coal-dependent), meaning solar has outsized carbon impact here.',
  },
  WA: {
    stateTaxCredit: { available: false },
    netMetering: { available: true, type: 'Full retail', description: 'Net metering at full retail rate for systems up to 100 kW.' },
    salesTaxExemption: { available: true, description: 'Solar energy systems exempt from state sales tax through June 2029.' },
    propertyTaxExemption: { available: false },
    srecs: { available: false },
    additionalIncentives: ['Some local utilities offer production incentives'],
    summary: 'Washington\'s grid is already very clean (hydropower). Solar resource is limited but net metering and sales tax exemption make it financially viable. Carbon impact of solar is lower here since the grid is already clean.',
  },
};

// Default for states not explicitly listed
export const DEFAULT_INCENTIVES = {
  stateTaxCredit: { available: false },
  netMetering: { available: false, description: 'Check with your state utility commission and local utility provider for current net metering policies.' },
  salesTaxExemption: { available: false },
  propertyTaxExemption: { available: false },
  srecs: { available: false },
  additionalIncentives: [],
  summary: 'Federal ITC (30%) applies in all states. Check dsireusa.org for the latest state and local incentives specific to your area.',
};

/**
 * Get incentives for a given state
 */
export function getStateIncentives(stateCode) {
  const code = stateCode?.toUpperCase();
  const stateData = STATE_INCENTIVES[code] || DEFAULT_INCENTIVES;
  
  // Calculate combined savings estimate
  const hasStateTaxCredit = stateData.stateTaxCredit?.available;
  const stateRate = stateData.stateTaxCredit?.rate || 0;
  const combinedRate = FEDERAL_ITC.rate + stateRate;

  return {
    ...stateData,
    federal: FEDERAL_ITC,
    combinedIncentiveRate: Math.min(combinedRate, 0.60), // Cap at 60%
    hasDetailedData: !!STATE_INCENTIVES[code],
    source: 'DSIRE (dsireusa.org) public summary tables, as of 2025',
  };
}
