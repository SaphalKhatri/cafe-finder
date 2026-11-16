import { useState } from 'react';
import type { Coordinates } from '../types';

interface GeolocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  getLocation: () => void;
  clearLocation: () => void;
}

export const useGeolocation = (): GeolocationState => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Location permission denied. Please allow location access or search manually.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case geoError.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while retrieving your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearLocation = () => {
    setCoords(null);
    setError(null);
  };

  return { coords, loading, error, getLocation, clearLocation };
};