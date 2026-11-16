import React from 'react';
import { SlidersHorizontal, Star } from 'lucide-react';

interface FilterSectionProps {
  maxDistance: number | null;
  onDistanceChange: (val: number | null) => void;
  minRating: number;
  onRatingChange: (val: number) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  availableCategories: string[];
  totalResults: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  maxDistance,
  onDistanceChange,
  minRating,
  onRatingChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
  totalResults,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <div className="bg-white p-3.5 rounded-xl border border-coffee-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-coffee-700">
          <div className="flex items-center gap-1 text-coffee-900 font-semibold">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          {/* Min Rating Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="rating-filter" className="text-coffee-600 flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Rating:
            </label>
            <select
              id="rating-filter"
              value={minRating}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              className="bg-cream-50 border border-coffee-200 rounded-lg px-2 py-1 text-coffee-900 focus:outline-none"
            >
              <option value={0}>All Ratings</option>
              <option value={4.0}>4.0+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          {/* Max Distance Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="distance-filter" className="text-coffee-600">
              Max Distance:
            </label>
            <select
              id="distance-filter"
              value={maxDistance ?? ''}
              onChange={(e) =>
                onDistanceChange(e.target.value ? Number(e.target.value) : null)
              }
              className="bg-cream-50 border border-coffee-200 rounded-lg px-2 py-1 text-coffee-900 focus:outline-none"
            >
              <option value="">Any distance</option>
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
            </select>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="category-filter" className="text-coffee-600">
                Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="bg-cream-50 border border-coffee-200 rounded-lg px-2 py-1 text-coffee-900 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Results Count */}
        <div className="text-xs text-coffee-600">
          Showing <span className="font-bold text-coffee-900">{totalResults}</span> places
        </div>
      </div>
    </div>
  );
};