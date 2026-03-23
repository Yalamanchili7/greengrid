/**
 * API utilities for SunScope
 * 
 * ALL DATA IS REAL. No fallbacks, no mock data, no estimates.
 * If any data source is unavailable, we tell the user clearly.
 * 
 * Data Sources:
 * - Geocoding: OpenStreetMap Nominatim
 * - Solar data: NREL PVWatts API v8 (NSRDB satellite data)
 * - Electricity rates: EIA Open Data API v2 (live)
 * - Emission factors: EPA eGRID2023 (official published dataset)
 * - Consumption averages: EIA RECS 2020 / State Electricity Profiles 2023
 */

import { fetchElectricityRate } from './eiaApi';
import { getEmissionFactor, STATE_AVG_CONSUMPTION, getGridFuelMix, getSolarResourceRanking } from './epaData';

const NREL_API_KEY = import.meta.env.VITE_NREL_API_KEY || '';
const NREL_BASE_URL = 'https://developer.nrel.gov/api/pvwatts/v8.json';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode an address to lat/lng + state
 */
export async function geocodeAddress(address) {
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'us',
  });

  let response;
  try {
    response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': 'SunScope/1.0 (EcoHack 2026)' },
    });
  } catch (err) {
    throw new Error('Geocoding service (OpenStreetMap) is temporarily unavailable. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`Geocoding service returned an error (HTTP ${response.status}). Please try again later.`);
  }

  const data = await response.json();
  if (!data.length) {
    throw new Error('Address not found. Please enter a valid US address with city and state (e.g., "123 Main St, Phoenix, AZ 85001").');
  }

  const result = data[0];
  const state = result.address?.state;
  const stateCode = getStateCode(state);

  if (!stateCode) {
    throw new Error('Could not determine the state for this address. Please include the state in your address (e.g., "Phoenix, Arizona").');
  }

  return {
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    displayName: result.display_name,
    state: stateCode,
    stateName: state,
  };
}

/**
 * Fetch solar data from NREL PVWatts API v8
 * Uses real NSRDB satellite irradiance data (20+ years)
 * 
 * @throws {Error} if API is unavailable or key is missing
 */
export async function fetchSolarData(latitude, longitude) {
  if (!NREL_API_KEY) {
    throw new Error('NREL API key not configured. Please add VITE_NREL_API_KEY to your .env file. Get a free key at developer.nrel.gov/signup/');
  }

  const params = new URLSearchParams({
    api_key: NREL_API_KEY,
    lat: latitude.toString(),
    lon: longitude.toString(),
    system_capacity: '4',
    azimuth: '180',
    tilt: Math.round(Math.abs(latitude)).toString(),
    array_type: '1',
    module_type: '1',
    losses: '14',
    dataset: 'nsrdb',
  });

  let response;
  try {
    response = await fetch(`${NREL_BASE_URL}?${params}`);
  } catch (err) {
    throw new Error('NREL solar data service is temporarily unavailable. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`NREL solar data service returned an error (HTTP ${response.status}). Please try again later.`);
  }

  const data = await response.json();

  if (data.errors?.length) {
    throw new Error(`NREL API error: ${data.errors.join(', ')}. This location may not have solar radiation data available.`);
  }

  if (!data.outputs?.ac_annual || !data.outputs?.ac_monthly) {
    throw new Error('NREL returned incomplete solar data for this location. Please try a nearby address.');
  }

  return {
    ac_annual: data.outputs.ac_annual,
    ac_monthly: data.outputs.ac_monthly,
    solrad_annual: data.outputs.solrad_annual,
    solrad_monthly: data.outputs.solrad_monthly,
    capacity_factor: data.outputs.capacity_factor,
    system_capacity: 4,
    station_info: data.station_info,
  };
}

/**
 * Fetch all real-time data for a location in parallel
 * 
 * All three sources must succeed. No fallbacks.
 */
export async function fetchAllData(latitude, longitude, stateCode) {
  // Run NREL + EIA calls in parallel for speed
  const [solarData, electricityRateResult] = await Promise.all([
    fetchSolarData(latitude, longitude),
    fetchElectricityRate(stateCode),
  ]);

  // EPA eGRID data (published dataset — always available)
  const emissionData = getEmissionFactor(stateCode);

  if (!emissionData) {
    throw new Error(`No EPA emission data available for state: ${stateCode}. This state may not be covered in eGRID2023.`);
  }

  // State average consumption from EIA RECS
  const consumptionAvg = STATE_AVG_CONSUMPTION[stateCode?.toUpperCase()];
  if (!consumptionAvg) {
    throw new Error(`No consumption baseline data available for state: ${stateCode}.`);
  }

  // Grid fuel mix from eGRID subregion data
  const gridFuelMix = getGridFuelMix(stateCode);

  // Solar resource ranking for this state
  const solarRanking = getSolarResourceRanking(stateCode);

  return {
    solarData,
    electricityRate: electricityRateResult,
    emissionData,
    consumptionAvg,
    gridFuelMix,
    solarRanking,
    dataSources: {
      solar: 'NREL PVWatts API v8 (NSRDB satellite data)',
      rates: `EIA API (live) — ${electricityRateResult.period}`,
      emissions: `${emissionData.source} — ${emissionData.subregionName}`,
      consumption: 'EIA RECS 2020 / State Electricity Profiles 2023',
      gridMix: gridFuelMix?.source || 'EPA eGRID2023 Subregion Resource Mix',
    },
  };
}

function getStateCode(stateName) {
  const states = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
  };
  return states[stateName?.toLowerCase()] || null;
}
