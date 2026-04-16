import { useState } from 'react';
import HeroInput from './components/HeroInput';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { geocodeAddress, fetchAllData } from './utils/api';
import { calculateGreenScore } from './utils/greenScore';

export default function App() {
  const [state, setState] = useState('idle'); // idle | loading | results | error
  const [results, setResults] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async ({ address, monthlyKwh }) => {
    setState('loading');
    setError(null);

    try {
      // Step 1: Geocode the address
      const geo = await geocodeAddress(address);
      setLocation(geo);

      // Step 2: Fetch all data in parallel (NREL solar + EIA rates + EPA emissions)
      const allData = await fetchAllData(geo.latitude, geo.longitude, geo.state);

      // Step 3: Calculate GreenScore using all real data sources
      const analysis = calculateGreenScore({
        latitude: geo.latitude,
        longitude: geo.longitude,
        state: geo.state,
        monthlyBillKwh: monthlyKwh,
        solarData: allData.solarData,
        electricityRate: allData.electricityRate.price,
        emissionFactor: allData.emissionData.co2LbPerMwh,
        stateAvgConsumption: allData.consumptionAvg,
        dataSources: allData.dataSources,
      });

      // Attach grid context data to the analysis
      analysis.gridFuelMix = allData.gridFuelMix;
      analysis.solarRanking = allData.solarRanking;
      analysis.incentives = allData.incentives;

      setResults(analysis);
      setState('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResults(null);
    setLocation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1" aria-live="polite" aria-busy={state === 'loading'}>
        {(state === 'idle' || state === 'loading' || state === 'error') && (
          <HeroInput
            onAnalyze={handleAnalyze}
            loading={state === 'loading'}
            error={error}
          />
        )}

        {state === 'results' && results && (
          <Dashboard
            results={results}
            location={location}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
