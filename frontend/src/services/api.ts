import axios from 'axios';
import type { Coordinates, SearchResponse } from '../types';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchPlaces = async (
  query: string,
  coords?: Coordinates | null
): Promise<SearchResponse> => {
  const params: Record<string, string | number> = { query };

  if (coords) {
    params.latitude = coords.latitude;
    params.longitude = coords.longitude;
  }

  const response = await apiClient.get<SearchResponse>('/places/search/', {
    params,
  });

  return response.data;
};