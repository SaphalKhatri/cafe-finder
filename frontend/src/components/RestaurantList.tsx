import React from 'react';
import { type Place } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  places: Place[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ places }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <RestaurantCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};