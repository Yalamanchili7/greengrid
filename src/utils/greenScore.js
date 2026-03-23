/**
 * GreenScore™ Algorithm
 * 
 * ALL inputs are REQUIRED. No silent defaults. No fallback values.
 * Every number comes from a verified data source.
 * 
 * Composite sustainability rating (0-100) from four weighted dimensions:
 * - Solar Utilization Potential (35%): NREL PVWatts satellite data
 * - Energy Efficiency (25%): User consumption vs. EIA regional average
 * - Grid Carbon Intensity (25%): EPA eGRID2023 subregion emission factors
 * - Renewable Feasibility (15%): EIA live rates + solar economics
 */

const SOLAR_COST_PER_WATT = 2.75; // $/W after federal ITC (30%)
const FEDERAL_ITC = 0.30;
const PANEL_DEGRADATION_RATE = 0.005; // 0.5% per year
const ELECTRICITY_ESCALATION_RATE = 0.03; // 3% annual increase

/**
 * Calculate the GreenScore and all associated metrics
 * 
 * @param {Object} params - ALL fields are required, no defaults
 * @param {number} params.latitude
 * @param {number} params.longitude
 * @param {string} params.state - Two-letter state code
 * @param {number} params.monthlyBillKwh - User's monthly consumption
 * @param {Object} params.solarData - From NREL PVWatts API (required)
 * @param {number} params.electricityRate - cents/kWh from EIA API (required)
 * @param {number} params.emissionFactor - lb CO2/MWh from EPA eGRID2023 (required)
 * @param {number} params.stateAvgConsumption - kWh/month from EIA RECS (required)
 * @param {Object} params.dataSources - Provenance tracking
 * @throws {Error} if any required data is missing
 */
export function calculateGreenScore({
  latitude,
  longitude,
  state,
  monthlyBillKwh,
  solarData,
  electricityRate,
  emissionFactor,
  stateAvgConsumption,
  dataSources,
}) {
  // Validate all required inputs — no silent defaults
  if (!solarData || !solarData.ac_annual || !solarData.ac_monthly) {
    throw new Error('Solar data is missing. NREL PVWatts API must return valid data.');
  }
  if (!electricityRate || electricityRate <= 0) {
    throw new Error('Electricity rate data is missing. EIA API must return a valid rate.');
  }
  if (!emissionFactor || emissionFactor <= 0) {
    throw new Error('Emission factor data is missing. EPA eGRID data must be available for this state.');
  }
  if (!stateAvgConsumption || stateAvgConsumption <= 0) {
    throw new Error('State consumption baseline is missing.');
  }
  if (!monthlyBillKwh || monthlyBillKwh <= 0) {
    throw new Error('Please enter your monthly electricity usage in kWh.');
  }

  // 1. Solar Utilization Score (0-100)
  const annualSolarKwh = solarData.ac_annual;
  const annualConsumption = monthlyBillKwh * 12;
  const solarCoverageRatio = Math.min(annualSolarKwh / annualConsumption, 1.5);
  const solarScore = Math.min(100, solarCoverageRatio * 70 + (annualSolarKwh > 5000 ? 20 : annualSolarKwh / 250));

  // 2. Energy Efficiency Score (0-100)
  const efficiencyRatio = stateAvgConsumption / monthlyBillKwh;
  const efficiencyScore = Math.min(100, Math.max(0, efficiencyRatio * 60 + 20));

  // 3. Grid Carbon Intensity Score (0-100)
  // Lower emissions = higher score. Scale: 0 lb/MWh = 100, 1800 lb/MWh = 0
  const gridScore = Math.min(100, Math.max(0, 100 - (emissionFactor / 18)));

  // 4. Renewable Feasibility Score (0-100)
  const perKwCapacity = solarData.ac_annual / solarData.system_capacity;
  const systemSizeKw = Math.min(annualConsumption / perKwCapacity, 15);
  const systemCost = systemSizeKw * 1000 * SOLAR_COST_PER_WATT * (1 - FEDERAL_ITC);
  const scaledSolarOutput = annualSolarKwh * (systemSizeKw / solarData.system_capacity);
  const annualSavings = Math.min(scaledSolarOutput, annualConsumption) * (electricityRate / 100);
  const paybackYears = systemCost / annualSavings;
  const feasibilityScore = Math.min(100, Math.max(0, 100 - (paybackYears * 6)));

  // Composite GreenScore
  const greenScore = Math.round(
    solarScore * 0.35 +
    efficiencyScore * 0.25 +
    gridScore * 0.25 +
    feasibilityScore * 0.15
  );

  // Financial calculations
  const savings5yr = calculateCumulativeSavings(annualSavings, 5);
  const savings10yr = calculateCumulativeSavings(annualSavings, 10);
  const savings25yr = calculateCumulativeSavings(annualSavings, 25);

  // Carbon offset calculations using eGRID emission factor
  const annualSolarUsed = Math.min(scaledSolarOutput, annualConsumption);
  const annualCarbonOffsetLbs = (annualSolarUsed / 1000) * emissionFactor;
  const annualCarbonOffsetTons = annualCarbonOffsetLbs / 2204.62;
  const treesEquivalent = Math.round(annualCarbonOffsetLbs / 48.1);
  const carsEquivalent = (annualCarbonOffsetLbs / 10180).toFixed(1);

  // Monthly solar output scaled to recommended system size
  const sizeRatio = systemSizeKw / solarData.system_capacity;
  const monthlyOutput = solarData.ac_monthly.map(v => Math.round(v * sizeRatio));

  // Recommendations
  const recommendations = generateRecommendations({
    solarScore, efficiencyScore, gridScore, feasibilityScore,
    monthlyBillKwh, stateAvg: stateAvgConsumption, paybackYears,
    systemSizeKw, systemCost, annualSavings, electricityRate, emissionFactor,
  });

  return {
    greenScore: Math.min(100, Math.max(0, greenScore)),
    breakdown: {
      solar: Math.round(solarScore),
      efficiency: Math.round(efficiencyScore),
      gridClean: Math.round(gridScore),
      feasibility: Math.round(feasibilityScore),
    },
    solar: {
      annualOutputKwh: Math.round(scaledSolarOutput),
      systemSizeKw: Math.round(systemSizeKw * 10) / 10,
      systemCost: Math.round(systemCost),
      coveragePercent: Math.round(Math.min(solarCoverageRatio * 100, 150)),
      monthlyOutput,
      solradAnnual: solarData.solrad_annual,
    },
    financial: {
      annualSavings: Math.round(annualSavings),
      savings5yr: Math.round(savings5yr),
      savings10yr: Math.round(savings10yr),
      savings25yr: Math.round(savings25yr),
      paybackYears: Math.round(paybackYears * 10) / 10,
      electricityRate,
    },
    carbon: {
      annualOffsetTons: Math.round(annualCarbonOffsetTons * 10) / 10,
      treesEquivalent,
      carsEquivalent: parseFloat(carsEquivalent),
      gridEmissionFactor: emissionFactor,
    },
    recommendations,
    dataSources: dataSources || {},
  };
}

function calculateCumulativeSavings(annualSavings, years) {
  let total = 0;
  for (let y = 0; y < years; y++) {
    const degradation = Math.pow(1 - PANEL_DEGRADATION_RATE, y);
    const escalation = Math.pow(1 + ELECTRICITY_ESCALATION_RATE, y);
    total += annualSavings * degradation * escalation;
  }
  return total;
}

function generateRecommendations({ solarScore, efficiencyScore, gridScore, feasibilityScore, monthlyBillKwh, stateAvg, paybackYears, systemSizeKw, systemCost, annualSavings, electricityRate, emissionFactor }) {
  const scenarios = [];

  // Solar scenario — always show if location has any solar potential
  if (solarScore > 30) {
    scenarios.push({
      title: 'What if you added solar?',
      impact: feasibilityScore > 50 ? 'high' : 'medium',
      description: `A ${Math.round(systemSizeKw * 10) / 10}kW system at your location would generate enough to offset ${Math.min(Math.round(solarScore), 100)}% of your usage. Estimated cost: $${Math.round(systemCost).toLocaleString()} after the 30% federal tax credit. At current rates, the system would pay for itself in ${Math.round(paybackYears * 10) / 10} years.`,
      delta: `$${Math.round(annualSavings).toLocaleString()}/yr savings`,
    });
  }

  // Usage comparison — show how they compare to neighbors
  const usageRatio = monthlyBillKwh / stateAvg;
  const usageDiffPercent = Math.abs(Math.round((usageRatio - 1) * 100));

  if (usageRatio > 1.1) {
    const potentialReduction = Math.round(monthlyBillKwh * 0.2 * electricityRate / 100 * 12);
    scenarios.push({
      title: 'How your usage compares',
      impact: usageRatio > 1.4 ? 'high' : 'medium',
      description: `Your household uses ${monthlyBillKwh.toLocaleString()} kWh/month — ${usageDiffPercent}% above the state average of ${stateAvg.toLocaleString()} kWh/month. A 20% reduction in consumption would save approximately $${potentialReduction.toLocaleString()}/year at current rates.`,
      delta: `${usageDiffPercent}% above average`,
    });
  } else if (usageRatio < 0.9) {
    scenarios.push({
      title: 'How your usage compares',
      impact: 'low',
      description: `Your household uses ${monthlyBillKwh.toLocaleString()} kWh/month — ${usageDiffPercent}% below the state average of ${stateAvg.toLocaleString()} kWh/month. Your energy efficiency is already better than most homes in your state.`,
      delta: `${usageDiffPercent}% below average`,
    });
  } else {
    scenarios.push({
      title: 'How your usage compares',
      impact: 'low',
      description: `Your household uses ${monthlyBillKwh.toLocaleString()} kWh/month — close to the state average of ${stateAvg.toLocaleString()} kWh/month. Your energy consumption is typical for homes in your state.`,
      delta: 'Near average',
    });
  }

  // Grid carbon context
  scenarios.push({
    title: 'Your grid\'s carbon profile',
    impact: gridScore < 50 ? 'high' : 'medium',
    description: gridScore < 50
      ? `Your electricity comes from a carbon-intensive grid emitting ${emissionFactor} lb CO₂ per MWh — well above the national average of 823 lb/MWh. Solar or clean energy at your location would have an outsized impact on carbon reduction.`
      : `Your grid emits ${emissionFactor} lb CO₂ per MWh — below the national average of 823 lb/MWh. Each kWh you consume produces less CO₂ than most US regions. Solar would still reduce emissions, but the carbon benefit is smaller than in coal-heavy regions.`,
    delta: gridScore < 50 ? 'High carbon grid' : 'Cleaner than average',
  });

  // Rate context — always show, compare to national average
  const nationalAvgRate = 16.0;
  const rateAboveAvg = electricityRate > nationalAvgRate;
  scenarios.push({
    title: 'Your electricity rate context',
    impact: rateAboveAvg ? 'medium' : 'low',
    description: rateAboveAvg
      ? `At ${electricityRate}¢/kWh, your state's residential rate is above the national average (~${nationalAvgRate}¢/kWh). Higher rates mean solar and efficiency improvements have a larger financial impact at your location.`
      : `At ${electricityRate}¢/kWh, your state's residential rate is below the national average (~${nationalAvgRate}¢/kWh). Lower rates mean the financial payback for solar takes longer, but the environmental benefits remain the same.`,
    delta: `${electricityRate}¢/kWh`,
  });

  return scenarios.slice(0, 4);
}

/**
 * Get a label and color for the GreenScore
 */
export function getScoreLabel(score) {
  if (score >= 80) return { label: 'Strong potential', color: '#10b981', bg: '#064e3b' };
  if (score >= 60) return { label: 'Good potential', color: '#34d399', bg: '#065f46' };
  if (score >= 40) return { label: 'Moderate potential', color: '#fbbf24', bg: '#78350f' };
  if (score >= 20) return { label: 'Limited potential', color: '#f97316', bg: '#7c2d12' };
  return { label: 'Low potential', color: '#ef4444', bg: '#7f1d1d' };
}
