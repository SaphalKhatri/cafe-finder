import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { FilterSection } from './components/FilterSection';
import { RestaurantList } from './components/RestaurantList';
import { LoadingState, ErrorMessage, EmptyState } from './components/StateView';
import { useGeolocation } from './hooks/useGeolocation';
import { searchPlaces } from './services/api';
import type { Place } from './types';

export default function App() {
  const { coords, loading: geoLoading, error: geoError, getLocation, clearLocation } = useGeolocation();

  // Search state
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter state
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Trigger Search
  const handleSearch = async (queryText: string) => {
    try {
      setIsLoading(true);
      setApiError(null);
      setCurrentQuery(queryText);
      setHasSearched(true);

      const response = await searchPlaces(queryText, coords);
      setPlaces(response.results);
      // Reset category filter on fresh search
      setSelectedCategory('ALL');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setApiError(err.message || 'Failed to fetch places. Please check the backend.');
      } else {
        setApiError('An unknown error occurred while fetching restaurants.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Derive unique categories dynamically from current results
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    places.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [places]);

  // Apply Client-Side Filters
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Rating Filter
      if (minRating > 0) {
        if (!place.rating || place.rating < minRating) return false;
      }

      // Max Distance Filter
      if (maxDistance !== null && place.distance_km !== null) {
        if (place.distance_km > maxDistance) return false;
      }

      // Category Filter
      if (selectedCategory !== 'ALL' && place.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [places, minRating, maxDistance, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-coffee-900">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          coords={coords}
          geoLoading={geoLoading}
          onGetLocation={getLocation}
          onClearLocation={clearLocation}
        />

        {/* Geolocation Error Alert if user denied permission */}
        {geoError && (
          <div className="max-w-2xl mx-auto px-4 mt-3">
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex justify-between items-center">
              <span>{geoError}</span>
              <button
                onClick={clearLocation}
                className="underline font-semibold ml-2 hover:text-amber-950"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Content States */}
        {isLoading && <LoadingState />}

        {!isLoading && apiError && (
          <ErrorMessage
            message={apiError}
            onRetry={() => handleSearch(currentQuery || 'Coffee')}
          />
        )}

        {!isLoading && !apiError && hasSearched && (
          <>
            <FilterSection
              maxDistance={maxDistance}
              onDistanceChange={setMaxDistance}
              minRating={minRating}
              onRatingChange={setMinRating}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              availableCategories={availableCategories}
              totalResults={filteredPlaces.length}
            />

            {filteredPlaces.length > 0 ? (
              <RestaurantList places={filteredPlaces} />
            ) : (
              <EmptyState query={currentQuery} />
            )}
          </>
        )}

        {!isLoading && !apiError && !hasSearched && <EmptyState />}
      </main>

      <footer className="border-t border-coffee-100 py-6 text-center text-xs text-coffee-600 bg-white">
        <p>© {new Date().getFullYear()} CafeFinder. Discover great food & cafes near you.</p>
      </footer>
    </div>
  );
}