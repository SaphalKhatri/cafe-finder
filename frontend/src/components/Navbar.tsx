import React from 'react';
import { Coffee } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-cream-50/90 backdrop-blur-md border-b border-coffee-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-coffee-800 flex items-center justify-center text-cream-50 shadow-sm">
            <Coffee className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-coffee-900">
              Cafe<span className="text-coffee-600">Finder</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-coffee-100 text-coffee-800 rounded-full">
              Nearby Food & Drinks
            </span>
          </div>
        </div>

        <div className="text-xs text-coffee-600 font-medium">
          Find your next craving
        </div>
      </div>
    </header>
  );
};