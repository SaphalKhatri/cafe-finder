import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center pt-8 pb-4 px-4 max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coffee-100 text-coffee-800 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        Real-time Food & Cafe Discovery
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-coffee-900 tracking-tight leading-tight mb-3">
        What are you <span className="text-coffee-600 underline decoration-amber-400 decoration-wavy">craving</span> today?
      </h1>
      <p className="text-coffee-700 text-sm sm:text-base leading-relaxed">
        Discover top-rated cafes, bakeries, and local eateries around you. Try searching for single cravings or combos like <span className="font-semibold text-coffee-900">Coffee + Pizza</span>.
      </p>
    </div>
  );
};