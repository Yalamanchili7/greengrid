/**
 * EIA Open Data API v2 — Live Electricity Rate Fetching
 * 
 * NO FALLBACK DATA. If the API is unavailable, we throw an error
 * and let the user know to try again later.
 * 
 * API Docs: https://www.eia.gov/opendata/documentation.php
 * Free API key: https://www.eia.gov/opendata/register.php
 */

const EIA_API_KEY = import.meta.env.VITE_EIA_API_KEY || '';
const EIA_BASE_URL = 'https://api.eia.gov/v2/electricity/retail-sales/data/';

// Cache to avoid redundant API calls within the same session
const rateCache = new Map();

/**
 * Fetch the latest residential electricity rate for a given state
 * @param {string} stateCode - Two-letter state abbreviation (e.g., 'AZ')
 * @returns {Promise<{price: number, period: string, source: string}>}
 * @throws {Error} if API is unavailable or returns no data
 */
export async function fetchElectricityRate(stateCode) {
  const code = stateCode?.toUpperCase() || 'US';

  if (!EIA_API_KEY) {
    throw new Error('EIA API key not configured. Please add VITE_EIA_API_KEY to your .env file. Get a free key at eia.gov/opendata/register.php');
  }

  // Check cache first
  if (rateCache.has(code)) {
    return rateCache.get(code);
  }

  const params = new URLSearchParams({
    'api_key': EIA_API_KEY,
    'frequency': 'monthly',
    'data[0]': 'price',
    'facets[stateid][]': code,
    'facets[sectorid][]': 'RES',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
    'offset': '0',
    'length': '1',
  });

  const response = await fetch(`${EIA_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`EIA electricity rate service is temporarily unavailable (HTTP ${response.status}). Please try again later.`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`EIA API error: ${data.error}. Please check your API key.`);
  }

  const rows = data?.response?.data;

  if (!rows?.length || rows[0].price == null) {
    throw new Error(`No electricity rate data available for state: ${code}. The EIA database may not have recent data for this location.`);
  }

  const result = {
    price: parseFloat(rows[0].price), // cents per kWh
    period: rows[0].period,            // e.g., "2025-10"
    stateDescription: rows[0].stateDescription,
    source: 'EIA API (live)',
  };

  rateCache.set(code, result);
  return result;
}

/**
 * Clear the rate cache
 */
export function clearRateCache() {
  rateCache.clear();
}
