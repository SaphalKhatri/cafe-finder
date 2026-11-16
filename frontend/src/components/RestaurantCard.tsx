import React, { useState } from 'react';
import { Star, MapPin, Navigation, Clock, Coffee } from 'lucide-react';
import { type Place } from '../types';

interface RestaurantCardProps {
  place: Place;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ place }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-coffee-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Card Image or Placeholder */}
        <div className="relative h-44 w-full bg-cream-100 overflow-hidden">
          {place.photo_url && !imageError ? (
            <img
              src={place.photo_url}
              alt={place.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-coffee-300 bg-cream-100">
              <Coffee className="w-10 h-10 mb-1 opacity-60" />
              <span className="text-xs font-medium text-coffee-400">Photo Unavailable</span>
            </div>
          )}

          {/* Open/Closed Badge */}
          {place.is_open !== null && (
            <div
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm ${
                place.is_open
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              }`}
            >
              {place.is_open ? 'Open Now' : 'Closed'}
            </div>
          )}

          {/* Category Chip */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-coffee-900/80 text-cream-50 backdrop-blur-sm">
            {place.category}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          <h3 className="font-bold text-base text-coffee-900 leading-snug line-clamp-1 group-hover:text-coffee-600 transition-colors">
            {place.name}
          </h3>

          {/* Rating and Distance Row */}
          <div className="flex items-center justify-between text-xs text-coffee-600">
            <div className="flex items-center gap-1">
              {place.rating !== null ? (
                <>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-coffee-900">{place.rating.toFixed(1)}</span>
                  <span className="text-coffee-400">({place.user_ratings_total})</span>
                </>
              ) : (
                <span className="text-coffee-400 italic">No ratings yet</span>
              )}
            </div>

            {place.distance_km !== null && (
              <div className="flex items-center gap-1 font-semibold text-coffee-700 bg-coffee-50 px-2 py-0.5 rounded-md">
                <Navigation className="w-3 h-3 text-coffee-600" />
                <span>{place.distance_km} km away</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-coffee-600">
            <MapPin className="w-3.5 h-3.5 text-coffee-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{place.address}</span>
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="p-4 pt-0">
        {place.maps_url ? (
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-cream-100 hover:bg-coffee-100 text-coffee-800 text-xs font-semibold rounded-xl border border-coffee-200 transition"
          >
            <span>View on Google Maps</span>
            <Navigation className="w-3 h-3" />
          </a>
        ) : (
          <div className="text-center text-[11px] text-coffee-400 py-1">
            Map link unavailable
          </div>
        )}
      </div>
    </div>
  );
};