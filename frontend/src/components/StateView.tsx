import React from 'react';
import { AlertCircle, SearchX, Coffee } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-4 border border-coffee-100 shadow-sm animate-pulse space-y-3"
          >
            <div className="w-full h-44 bg-cream-200 rounded-xl" />
            <div className="h-5 bg-cream-200 rounded w-3/4" />
            <div className="h-4 bg-cream-100 rounded w-1/2" />
            <div className="h-4 bg-cream-100 rounded w-full" />
            <div className="pt-2 flex justify-between">
              <div className="h-8 bg-cream-200 rounded w-20" />
              <div className="h-8 bg-cream-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="max-w-md mx-auto my-12 px-4 text-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-red-800 mb-1">Search Error</h3>
        <p className="text-xs text-red-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{ query?: string }> = ({ query }) => {
  return (
    <div className="max-w-md mx-auto my-16 px-4 text-center">
      <div className="w-16 h-16 bg-coffee-100 text-coffee-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {query ? <SearchX className="w-8 h-8" /> : <Coffee className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-coffee-900 mb-1">
        {query ? `No spots found for "${query}"` : 'Start Your Discovery'}
      </h3>
      <p className="text-xs text-coffee-600 max-w-xs mx-auto">
        {query
          ? 'Try adjusting your filters or searching for another craving like Coffee, Bakery, or Pizza.'
          : 'Enter what you crave above and find top-rated cafes and restaurants nearby.'}
      </p>
    </div>
  );
};