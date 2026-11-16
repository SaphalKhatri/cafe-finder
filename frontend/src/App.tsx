
import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { searchPlaces } from './services/api';

export default function App() {
  const { coords, loading, error, getLocation } = useGeolocation();

  const [result, setResult] = useState('');
  const [searching, setSearching] = useState(false);

  const testSearch = async () => {
    if (!coords) return;

    try {
      setSearching(true);
      setResult('');

      const data = await searchPlaces('coffee', coords);
      setResult(`Success! Found ${data.count} places.`);
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-4 p-6">

      <h1 className="text-2xl font-bold text-coffee-800">
        CafeFinder - Connection Test
      </h1>

      <button
        onClick={getLocation}
        disabled={loading}
        className="rounded-lg bg-coffee-700 px-4 py-2 text-white hover:bg-coffee-800 disabled:opacity-50"
      >
        {loading ? 'Getting Location...' : 'Use My Location'}
      </button>

      {coords && (
        <p className="text-sm text-green-700">
          Location: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={testSearch}
        disabled={!coords || searching}
        className="rounded-lg bg-amber-700 px-4 py-2 text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {searching ? 'Searching...' : 'Test Django API'}
      </button>

      {result && <p className="text-sm font-medium">{result}</p>}

    </div>
  );
}
