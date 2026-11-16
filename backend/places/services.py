import math
import requests
from urllib.parse import quote
from django.conf import settings

PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText"
# Fields we request Google to return (FieldMask saves cost and bandwidth)
FIELD_MASK = (
    "places.id,"
    "places.displayName,"
    "places.formattedAddress,"
    "places.rating,"
    "places.userRatingCount,"
    "places.location,"
    "places.currentOpeningHours,"
    "places.photos,"
    "places.googleMapsUri,"
    "places.primaryTypeDisplayName"
)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
   
    R = 6371.0  # Earth's radius in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def fetch_places_for_keyword(keyword: str, lat: float | None = None, lng: float | None = None) -> list:
   
    
    api_key = settings.GOOGLE_PLACES_API_KEY
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY is not configured in settings.")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    body = {
        "textQuery": keyword,
    }

    # If coordinates are provided, bias the search around the user's location (5km radius)
    if lat is not None and lng is not None:
        body["locationBias"] = {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": 5000.0,
            }
        }

    response = requests.post(PLACES_API_URL, headers=headers, json=body, timeout=10)
    response.raise_for_status()

    data = response.json()
    return data.get("places", [])


def search_nearby_places(query: str, lat: float | None = None, lng: float | None = None) -> list:
    """
    Handles single or multiple keywords (e.g. 'Coffee + Pizza' or 'Coffee, Pizza'),
    deduplicates matching places, formats card information, and calculates distance.
    """
    # Split query by '+' or ',' to support combinations like "Coffee + Pizza"
    keywords = [k.strip() for k in query.replace(",", "+").split("+") if k.strip()]
    if not keywords:
        return []

    seen_ids = set()
    standardized_results = []
    api_key = settings.GOOGLE_PLACES_API_KEY

    for kw in keywords:
        raw_places = fetch_places_for_keyword(kw, lat, lng)

        for place in raw_places:
            place_id = place.get("id")
            if not place_id or place_id in seen_ids:
                continue

            seen_ids.add(place_id)

            # Extract location coordinates
            place_location = place.get("location", {})
            place_lat = place_location.get("latitude")
            place_lng = place_location.get("longitude")

            # Calculate distance if both user and place coordinates exist
            distance_km = None
            if lat is not None and lng is not None and place_lat and place_lng:
                distance_km = calculate_distance(lat, lng, place_lat, place_lng)

            # Build direct photo media URL if photos are available
            photo_url = None
            photos = place.get("photos", [])
            if photos and len(photos) > 0:
                photo_name = photos[0].get("name")
                if photo_name:
                    safe_name = quote(photo_name, safe="")
                    photo_url = f"https://127.0.0.1:8000/api/places/photo/?name={safe_name}"
                       
                    

            # Check open status
            opening_hours = place.get("currentOpeningHours", {})
            is_open = opening_hours.get("openNow")

            # Primary category / type
            type_info = place.get("primaryTypeDisplayName", {})
            category = type_info.get("text", "Cafe / Restaurant")

            standardized_results.append({
                "id": place_id,
                "name": place.get("displayName", {}).get("text", "Unknown Place"),
                "address": place.get("formattedAddress", "Address not available"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("userRatingCount", 0),
                "is_open": is_open,
                "distance_km": distance_km,
                "photo_url": photo_url,
                "maps_url": place.get("googleMapsUri"),
                "category": category,
            })

    # Sort results by distance if distance is available, otherwise by rating
    if lat is not None and lng is not None:
        standardized_results.sort(
            key=lambda item: (item["distance_km"] if item["distance_km"] is not None else float("inf"))
        )
    else:
        standardized_results.sort(
            key=lambda item: (item["rating"] if item["rating"] is not None else 0),
            reverse=True,
        )

    return standardized_results