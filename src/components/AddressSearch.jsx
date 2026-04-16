import { useState, useEffect, useRef, useCallback } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Debounce hook
 */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function AddressSearch({ value, onChange, onSelect, disabled }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Sync with parent value (e.g., when presets are clicked)
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;

    async function fetchSuggestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'us',
        });

        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
          headers: { 'User-Agent': 'SunScope/1.0 (EcoHack 2026)' },
        });

        if (!response.ok || cancelled) return;

        const data = await response.json();

        if (!cancelled) {
          const filtered = data
            .filter(r => r.address && (r.address.state || r.address.city))
            .map(r => ({
              displayName: formatDisplayName(r),
              fullName: r.display_name,
              latitude: parseFloat(r.lat),
              longitude: parseFloat(r.lon),
              state: r.address.state,
              city: r.address.city || r.address.town || r.address.village || r.address.county,
              postcode: r.address.postcode,
              type: r.type,
              importance: r.importance,
            }));

          setSuggestions(filtered);
          setIsOpen(filtered.length > 0);
        }
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSuggestions();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format display name to be cleaner
  function formatDisplayName(result) {
    const addr = result.address;
    const parts = [];

    if (addr.house_number && addr.road) {
      parts.push(`${addr.house_number} ${addr.road}`);
    } else if (addr.road) {
      parts.push(addr.road);
    }

    const city = addr.city || addr.town || addr.village;
    if (city) parts.push(city);

    if (addr.state) {
      const stateAbbr = getStateAbbr(addr.state);
      parts.push(stateAbbr || addr.state);
    }

    if (addr.postcode) parts.push(addr.postcode);

    return parts.join(', ') || result.display_name;
  }

  // Handle selection
  function handleSelect(suggestion) {
    setQuery(suggestion.displayName);
    onChange(suggestion.displayName);
    onSelect?.(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  }

  // Handle manual input (no selection from dropdown)
  function handleInputChange(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setGeoError(null);
  }

  // Use browser geolocation
  async function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: 'json',
        addressdetails: '1',
      });

      const response = await fetch(`${REVERSE_URL}?${params}`, {
        headers: { 'User-Agent': 'SunScope/1.0 (EcoHack 2026)' },
      });

      if (!response.ok) throw new Error('Reverse geocoding failed');

      const data = await response.json();

      const displayName = formatDisplayName(data);
      setQuery(displayName);
      onChange(displayName);
      onSelect?.({
        displayName,
        fullName: data.display_name,
        latitude,
        longitude,
        state: data.address?.state,
        city: data.address?.city || data.address?.town || data.address?.village,
        postcode: data.address?.postcode,
      });

    } catch (err) {
      if (err.code === 1) {
        setGeoError('Location access denied. Please type your address instead.');
      } else if (err.code === 2) {
        setGeoError('Could not determine your location. Please type your address.');
      } else if (err.code === 3) {
        setGeoError('Location request timed out. Please type your address.');
      } else {
        setGeoError('Could not get your location. Please type your address.');
      }
    } finally {
      setGeoLoading(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-emerald-50/70 font-body mb-2">
        Home Address
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="123 Main St, Mesa, AZ 85201"
          disabled={disabled}
          autoComplete="off"
          className="w-full px-4 py-3 pl-10 pr-12 rounded-xl bg-emerald-950/40 border border-emerald-500/15
            text-emerald-50 placeholder-emerald-50/25 font-body text-sm
            focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20
            transition-all disabled:opacity-40"
          required
        />

        {/* Search icon */}
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <svg className="animate-spin w-3.5 h-3.5 text-emerald-500/40" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* Geolocation button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={disabled || geoLoading}
          title="Use my current location"
          aria-label="Use my current location"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
            text-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/10
            disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {geoLoading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Geolocation error */}
      {geoError && (
        <p className="mt-1.5 text-xs text-amber-400/70 font-body">{geoError}</p>
      )}

      {/* Autocomplete dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div role="listbox" aria-label="Address suggestions" className="absolute z-50 w-full mt-1.5 rounded-xl overflow-hidden
          bg-emerald-950/95 border border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-black/40">
          {suggestions.map((suggestion, i) => (
            <button
              role="option"
              key={`${suggestion.latitude}-${suggestion.longitude}-${i}`}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2.5 text-left flex items-start gap-2.5
                hover:bg-emerald-500/10 transition-colors border-b border-emerald-500/5 last:border-0"
            >
              <svg className="w-3.5 h-3.5 text-emerald-500/30 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div className="min-w-0">
                <p className="text-sm text-emerald-50/80 font-body truncate">
                  {suggestion.displayName}
                </p>
                {suggestion.city && suggestion.state && (
                  <p className="text-[11px] text-emerald-50/50 font-body truncate">
                    {suggestion.city}, {suggestion.state}
                    {suggestion.postcode ? ` ${suggestion.postcode}` : ''}
                  </p>
                )}
              </div>
            </button>
          ))}

          <div className="px-4 py-1.5 bg-emerald-950/50">
            <p className="text-[9px] text-emerald-50/40 font-body">
              Powered by OpenStreetMap Nominatim
            </p>
          </div>
        </div>
      )}

      {/* No results message with suggestion */}
      {isOpen && suggestions.length === 0 && debouncedQuery.length >= 3 && !loading && (
        <div className="absolute z-50 w-full mt-1.5 rounded-xl overflow-hidden
          bg-emerald-950/95 border border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-black/40 p-4">
          <p className="text-sm text-emerald-50/50 font-body mb-2">
            No exact match found.
          </p>
          <p className="text-xs text-emerald-50/30 font-body">
            Try a more specific address (include city and state), or use the
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="text-emerald-400/60 hover:text-emerald-400 mx-1 underline"
            >
              location button
            </button>
            to use your current position.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * State name to abbreviation
 */
function getStateAbbr(stateName) {
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
