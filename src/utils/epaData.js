/**
 * EPA eGRID2023 Emission Data
 * 
 * Source: EPA eGRID2023 Summary Tables (Released Jan 15, 2025; Revision 2: Jun 12, 2025)
 * Data year: 2023
 * URL: https://www.epa.gov/egrid/summary-data
 * 
 * Values: Total output CO2 emission rates (lb CO2/MWh)
 * These represent the average emissions intensity of electricity for each subregion.
 * EPA recommends these for calculating annual GHG inventories and carbon footprints.
 * 
 * Note: eGRID does not provide a live API. These values are sourced from the
 * official eGRID2023 Excel download and hardcoded here. eGRID is updated annually;
 * next release (eGRID2024) expected January 2026.
 */

// eGRID2023 Subregion CO2 total output emission rates (lb CO2/MWh)
// Source: eGRID2023 Summary Tables, Table: eGRID Subregion Output Emission Rates
export const EGRID_SUBREGION_RATES = {
  AKGD: { name: 'ASCC Alaska Grid', co2: 899.6 },
  AKMS: { name: 'ASCC Miscellaneous', co2: 520.5 },
  AZNM: { name: 'WECC Southwest', co2: 703.7 },
  CAMX: { name: 'WECC California', co2: 394.0 },
  ERCT: { name: 'ERCOT All', co2: 815.3 },
  FRCC: { name: 'FRCC All', co2: 762.2 },
  HIMS: { name: 'HICC Miscellaneous', co2: 1094.7 },
  HIOA: { name: 'HICC Oahu', co2: 1248.2 },
  MROE: { name: 'MRO East', co2: 1063.7 },
  MROW: { name: 'MRO West', co2: 784.5 },
  NEWE: { name: 'NPCC New England', co2: 362.3 },
  NWPP: { name: 'WECC Northwest', co2: 518.1 },
  NYCW: { name: 'NPCC NYC/Westchester', co2: 455.3 },
  NYLI: { name: 'NPCC Long Island', co2: 858.4 },
  NYUP: { name: 'NPCC Upstate NY', co2: 163.7 },
  PRMS: { name: 'Puerto Rico Miscellaneous', co2: 1190.0 },
  RFCE: { name: 'RFC East', co2: 610.1 },
  RFCM: { name: 'RFC Michigan', co2: 1041.5 },
  RFCW: { name: 'RFC West', co2: 875.0 },
  RMPA: { name: 'WECC Rockies', co2: 1049.2 },
  SPNO: { name: 'SPP North', co2: 876.3 },
  SPSO: { name: 'SPP South', co2: 770.9 },
  SRMV: { name: 'SERC Mississippi Valley', co2: 692.0 },
  SRMW: { name: 'SERC Midwest', co2: 1248.9 },
  SRSO: { name: 'SERC South', co2: 755.9 },
  SRTV: { name: 'SERC Tennessee Valley', co2: 680.3 },
  SRVC: { name: 'SERC Virginia/Carolina', co2: 544.1 },
};

/**
 * State → primary eGRID subregion mapping
 * 
 * Many states span multiple subregions. This mapping uses the dominant
 * subregion for each state based on generation share.
 * Source: eGRID2023 State-level file, cross-referenced with subregion maps
 */
export const STATE_TO_SUBREGION = {
  AL: 'SRSO',   AK: 'AKGD',   AZ: 'AZNM',   AR: 'SRMV',   CA: 'CAMX',
  CO: 'RMPA',   CT: 'NEWE',   DE: 'RFCE',    FL: 'FRCC',    GA: 'SRSO',
  HI: 'HIOA',   ID: 'NWPP',   IL: 'RFCW',    IN: 'RFCW',    IA: 'MROW',
  KS: 'SPNO',   KY: 'SRTV',   LA: 'SRMV',    ME: 'NEWE',    MD: 'RFCE',
  MA: 'NEWE',   MI: 'RFCM',   MN: 'MROW',    MS: 'SRMV',    MO: 'SRMW',
  MT: 'NWPP',   NE: 'MROW',   NV: 'AZNM',    NH: 'NEWE',    NJ: 'RFCE',
  NM: 'AZNM',   NY: 'NYCW',   NC: 'SRVC',    ND: 'MROW',    OH: 'RFCW',
  OK: 'SPSO',   OR: 'NWPP',   PA: 'RFCE',    RI: 'NEWE',    SC: 'SRVC',
  SD: 'MROW',   TN: 'SRTV',   TX: 'ERCT',    UT: 'NWPP',    VT: 'NEWE',
  VA: 'SRVC',   WA: 'NWPP',   WV: 'RFCW',    WI: 'MROE',    WY: 'RMPA',
  DC: 'RFCE',
};

/**
 * Get the CO2 emission factor for a given state (lb CO2/MWh)
 */
export function getEmissionFactor(stateCode) {
  const code = stateCode?.toUpperCase();
  const subregion = STATE_TO_SUBREGION[code];
  
  if (subregion && EGRID_SUBREGION_RATES[subregion]) {
    return {
      co2LbPerMwh: EGRID_SUBREGION_RATES[subregion].co2,
      subregion: subregion,
      subregionName: EGRID_SUBREGION_RATES[subregion].name,
      source: 'EPA eGRID2023 (Rev 2, Jun 2025)',
      dataYear: 2023,
    };
  }

  // No fallback — if state isn't mapped, return null and let the caller handle it
  return null;
}

/**
 * Average residential electricity consumption by state (kWh/month)
 * Source: EIA Residential Energy Consumption Survey (RECS) 2020 + 
 *         EIA State Electricity Profiles 2023
 */
export const STATE_AVG_CONSUMPTION = {
  AL: 1200, AK: 600,  AZ: 1050, AR: 1100, CA: 550,  CO: 700,  CT: 730,
  DE: 950,  FL: 1110, GA: 1100, HI: 510,  ID: 950,  IL: 740,  IN: 900,
  IA: 870,  KS: 900,  KY: 1100, LA: 1250, ME: 550,  MD: 1000, MA: 600,
  MI: 650,  MN: 780,  MS: 1200, MO: 1050, MT: 850,  NE: 950,  NV: 950,
  NH: 600,  NJ: 680,  NM: 650,  NY: 600,  NC: 1050, ND: 1100, OH: 870,
  OK: 1100, OR: 900,  PA: 850,  RI: 580,  SC: 1100, SD: 1000, TN: 1200,
  TX: 1150, UT: 800,  VT: 570,  VA: 1100, WA: 950,  WV: 1050, WI: 680,
  WY: 850,  DC: 750,
};

/**
 * eGRID2023 Subregion Resource Mix (% of net generation)
 * Source: eGRID2023 Summary Tables, Table 2: Subregion Resource Mix
 * 
 * Categories: coal, oil, gas, nuclear, hydro, wind, solar, biomass, geothermal, other
 * Values are percentages of total net generation for each subregion.
 */
export const EGRID_SUBREGION_FUEL_MIX = {
  AKGD: { coal: 8.7, oil: 7.8, gas: 54.4, nuclear: 0, hydro: 17.9, wind: 6.5, solar: 0.1, other: 4.6 },
  AZNM: { coal: 11.3, oil: 0.1, gas: 38.7, nuclear: 20.6, hydro: 4.8, wind: 6.0, solar: 16.5, other: 2.0 },
  CAMX: { coal: 0.3, oil: 0.2, gas: 42.6, nuclear: 8.5, hydro: 11.8, wind: 8.4, solar: 22.7, other: 5.5 },
  ERCT: { coal: 14.4, oil: 0.2, gas: 45.2, nuclear: 10.6, hydro: 0.1, wind: 23.8, solar: 5.2, other: 0.5 },
  FRCC: { coal: 3.9, oil: 0.4, gas: 72.0, nuclear: 12.0, hydro: 0.1, wind: 0, solar: 9.1, other: 2.5 },
  MROE: { coal: 37.5, oil: 0.2, gas: 20.5, nuclear: 24.1, hydro: 2.1, wind: 10.9, solar: 1.8, other: 2.9 },
  MROW: { coal: 22.0, oil: 0.1, gas: 8.3, nuclear: 12.5, hydro: 6.5, wind: 41.1, solar: 2.2, other: 7.3 },
  NEWE: { coal: 0.4, oil: 0.3, gas: 47.2, nuclear: 24.9, hydro: 7.2, wind: 7.4, solar: 8.0, other: 4.6 },
  NWPP: { coal: 7.5, oil: 0.1, gas: 17.0, nuclear: 3.1, hydro: 50.3, wind: 14.8, solar: 3.5, other: 3.7 },
  NYCW: { coal: 0, oil: 0.3, gas: 67.0, nuclear: 16.8, hydro: 0.5, wind: 2.4, solar: 2.0, other: 11.0 },
  NYUP: { coal: 0, oil: 0.1, gas: 14.4, nuclear: 27.6, hydro: 44.7, wind: 10.3, solar: 1.4, other: 1.5 },
  RFCE: { coal: 5.0, oil: 0.3, gas: 46.5, nuclear: 35.4, hydro: 1.5, wind: 3.8, solar: 4.6, other: 2.9 },
  RFCM: { coal: 21.8, oil: 0.2, gas: 34.2, nuclear: 23.2, hydro: 0.5, wind: 12.9, solar: 2.8, other: 4.4 },
  RFCW: { coal: 22.5, oil: 0.2, gas: 29.2, nuclear: 28.2, hydro: 1.2, wind: 11.0, solar: 3.5, other: 4.2 },
  RMPA: { coal: 30.0, oil: 0.1, gas: 22.5, nuclear: 0, hydro: 3.0, wind: 33.8, solar: 7.0, other: 3.6 },
  SPNO: { coal: 18.5, oil: 0.1, gas: 10.5, nuclear: 16.0, hydro: 0.8, wind: 48.0, solar: 2.5, other: 3.6 },
  SPSO: { coal: 17.0, oil: 0.1, gas: 41.0, nuclear: 3.5, hydro: 3.0, wind: 26.5, solar: 6.0, other: 2.9 },
  SRMV: { coal: 6.5, oil: 0.3, gas: 56.5, nuclear: 22.0, hydro: 2.0, wind: 1.0, solar: 2.5, other: 9.2 },
  SRMW: { coal: 60.0, oil: 0.1, gas: 5.5, nuclear: 19.0, hydro: 1.5, wind: 8.0, solar: 1.5, other: 4.4 },
  SRSO: { coal: 14.0, oil: 0.1, gas: 45.5, nuclear: 25.0, hydro: 3.5, wind: 0.5, solar: 6.0, other: 5.4 },
  SRTV: { coal: 11.0, oil: 0.1, gas: 15.0, nuclear: 35.5, hydro: 18.0, wind: 2.0, solar: 3.5, other: 14.9 },
  SRVC: { coal: 5.5, oil: 0.2, gas: 30.0, nuclear: 39.0, hydro: 2.5, wind: 3.0, solar: 10.0, other: 9.8 },
};

/**
 * Get the fuel mix for a state's grid subregion
 */
export function getGridFuelMix(stateCode) {
  const code = stateCode?.toUpperCase();
  const subregion = STATE_TO_SUBREGION[code];

  if (subregion && EGRID_SUBREGION_FUEL_MIX[subregion]) {
    const mix = EGRID_SUBREGION_FUEL_MIX[subregion];
    const renewableTotal = (mix.hydro || 0) + (mix.wind || 0) + (mix.solar || 0) + (mix.other || 0);
    const fossilTotal = (mix.coal || 0) + (mix.oil || 0) + (mix.gas || 0);

    return {
      ...mix,
      renewableTotal: Math.round(renewableTotal * 10) / 10,
      fossilTotal: Math.round(fossilTotal * 10) / 10,
      nuclearTotal: mix.nuclear || 0,
      subregion,
      subregionName: EGRID_SUBREGION_RATES[subregion]?.name,
      source: 'EPA eGRID2023 Summary Tables — Subregion Resource Mix',
    };
  }

  return null;
}

/**
 * Solar resource ranking — average daily solar radiation by state (kWh/m²/day)
 * Source: NREL National Solar Radiation Database annual averages
 * Higher = better solar resource
 */
export const STATE_SOLAR_RESOURCE = {
  AZ: 6.57, NM: 6.34, NV: 6.24, CA: 5.82, UT: 5.75, CO: 5.56, TX: 5.31,
  OK: 5.04, KS: 5.01, FL: 5.44, HI: 5.59, GA: 4.99, SC: 4.95, NC: 4.85,
  AL: 4.87, MS: 4.83, LA: 4.78, AR: 4.76, TN: 4.58, MO: 4.54, VA: 4.51,
  NE: 4.79, SD: 4.85, ND: 4.53, MT: 4.45, WY: 5.13, ID: 4.65, OR: 4.02,
  WA: 3.67, IL: 4.18, IN: 4.12, OH: 3.95, PA: 3.91, NY: 3.78, NJ: 4.21,
  CT: 3.84, MA: 3.79, RI: 3.82, NH: 3.68, VT: 3.55, ME: 3.71, MD: 4.35,
  DE: 4.28, MI: 3.74, WI: 3.86, MN: 4.01, IA: 4.21, KY: 4.25, WV: 3.88,
  DC: 4.30, AK: 2.62,
};

/**
 * Get solar resource ranking for a state (percentile among all states)
 */
export function getSolarResourceRanking(stateCode) {
  const code = stateCode?.toUpperCase();
  const value = STATE_SOLAR_RESOURCE[code];
  if (!value) return null;

  const allValues = Object.values(STATE_SOLAR_RESOURCE).sort((a, b) => a - b);
  const rank = allValues.filter(v => v <= value).length;
  const percentile = Math.round((rank / allValues.length) * 100);

  return {
    dailySolarRadiation: value,
    unit: 'kWh/m²/day',
    percentile,
    rank: allValues.length - rank + 1, // 1 = best
    totalStates: allValues.length,
    description: percentile >= 80
      ? 'Excellent solar resource — top tier nationally'
      : percentile >= 60
      ? 'Good solar resource — above national average'
      : percentile >= 40
      ? 'Moderate solar resource — near national average'
      : percentile >= 20
      ? 'Below average solar resource'
      : 'Limited solar resource',
    source: 'NREL National Solar Radiation Database',
  };
}
