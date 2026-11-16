import React, { useState } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { type Coordinates } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  coords: Coordinates | null;
  geoLoading: boolean;
  onGetLocation: () => void;
  onClearLocation: () => void;
}

const POPULAR_SUGGESTIONS = [
  'Coffee',
  'Pizza',
  'Burger',
  'Coffee + Bakery',
  'Momos',
  'Fast food',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  coords,
  geoLoading,
  onGetLocation,
  onClearLocation,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setSearchInput(keyword);
    onSearch(keyword);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-2">
      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-coffee-100 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 items-center"
      >
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-5 h-5 text-coffee-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. Coffee, Pizza, Coffee + Bakery..."
            className="w-full px-3 py-2 text-coffee-900 bg-transparent placeholder-coffee-300 focus:outline-none text-base"
          />
        </div>

        {/* Location Toggle Button */}
        <div className="flex w-full sm:w-auto items-center gap-2">
          {coords ? (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location Active</span>
              <button
                type="button"
                onClick={onClearLocation}
                title="Remove location"
                className="hover:text-emerald-950 p-0.5 rounded-full hover:bg-emerald-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onGetLocation}
              disabled={geoLoading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-coffee-200 text-coffee-700 hover:bg-cream-100 text-xs font-semibold transition disabled:opacity-50"
            >
              {geoLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-coffee-600" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-coffee-600" />
              )}
              <span>{geoLoading ? 'Detecting...' : 'Near Me'}</span>
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading || !searchInput.trim()}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-coffee-800 hover:bg-coffee-900 text-white font-medium text-sm rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Popular Suggestions */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        <span className="text-coffee-600 font-medium mr-1">Popular:</span>
        {POPULAR_SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSuggestionClick(tag)}
            className="px-3 py-1 bg-white hover:bg-coffee-100 text-coffee-700 border border-coffee-100 rounded-full transition font-medium"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};