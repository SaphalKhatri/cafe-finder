export interface Place {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  user_ratings_total: number;
  is_open: boolean | null;
  distance_km: number | null;
  photo_url: string | null;
  maps_url: string | null;
  category: string;
}

export interface SearchResponse {
  count: number;
  results: Place[];
  error?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}