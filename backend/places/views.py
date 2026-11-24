import logging
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from urllib.parse import unquote
from django.http import HttpResponse,HttpResponseNotFound
from .services import search_nearby_places,get_place_details
from .models import Favorite

logger = logging.getLogger(__name__)


class PlaceSearchView(APIView):
  

    def get(self, request):
        query = request.query_params.get("query", "").strip()
        if not query:
            return Response(
                {"error": "The 'query' parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Latitude and longitude are optional (manual search without GPS is supported)
        lat_param = request.query_params.get("latitude")
        lng_param = request.query_params.get("longitude")
        print("raf::",lat_param)
        lat, lng = None, None
        try:
            if lat_param is not None and lng_param is not None:
                lat = float(lat_param)
                lng = float(lng_param)
        except ValueError:
            return Response(
                {"error": "Latitude and longitude must be valid floating point numbers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            places = search_nearby_places(query=query, lat=lat, lng=lng)
            return Response(
                {
                    "count": len(places),
                    "results": places,
                },
                status=status.HTTP_200_OK,
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Google Places API request failed: {e}")
            return Response(
                {"error": "Failed to communicate with Google Places service."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return Response(
                {"error": "An unexpected error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



class PlaceDetailView(APIView):
    """
    GET /api/places/<place_id>/?latitude=...&longitude=...
    """
    def get(self, request, place_id):
        lat_param = request.query_params.get("latitude")
        lng_param = request.query_params.get("longitude")

        lat, lng = None, None
        try:
            if lat_param and lng_param:
                lat, lng = float(lat_param), float(lng_param)
        except ValueError:
            pass

        place = get_place_details(place_id, lat=lat, lng=lng)
        if not place:
            return Response({"error": "Place not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(place, status=status.HTTP_200_OK)
        
class PlacePhotoView(APIView):
   

    def get(self, request):
        raw_name = request.query_params.get("name")
        if not raw_name:
            return HttpResponseNotFound("Photo name is missing.")

        # Decode in case URL had encoded slashes
        photo_name = unquote(raw_name)

        api_key = settings.GOOGLE_PLACES_API_KEY
        # Google Places API (New) photo media endpoint
        media_url = f"https://places.googleapis.com/v1/{photo_name}/media"
        
        headers = {
            "X-Goog-Api-Key": api_key,
        }
        params = {
            "maxHeightPx": 400,
            "maxWidthPx": 600,
            "key": api_key,
        }

        try:
            # allow_redirects=True follows Google's CDN redirect and grabs the JPEG
            res = requests.get(
                media_url,
                headers=headers,
                params=params,
                allow_redirects=True,
                timeout=10,
            )

            if res.status_code == 200:
                content_type = res.headers.get("Content-Type", "image/jpeg")
                # Return the image binary directly to the browser
                response = HttpResponse(res.content, content_type=content_type)
                # Cache for 1 day in user's browser to save Google API quota
                response["Cache-Control"] = "public, max-age=86400"
                return response
            else:
                print(f"[GOOGLE PHOTO ERROR] Status: {res.status_code}, Body: {res.text}")
                return HttpResponseNotFound("Photo not found on Google.")
        except Exception as e:
            print(f"[PHOTO PROXY EXCEPTION]: {e}")
            return HttpResponseNotFound()



class FavoriteListCreateView(APIView):
   

    def get(self, request):
        favorites = Favorite.objects.all()
        results = []
        for fav in favorites:
            results.append({
                "id": fav.place_id,
                "name": fav.name or "Saved Cafe",
                "address": fav.address or "",
                "rating": fav.rating,
                "user_ratings_total": fav.user_ratings_total,
                "is_open": None,
                "distance_km": None,
                "latitude": fav.latitude,
                "longitude": fav.longitude,
                "photo_url": fav.photo_url,
                "maps_url": None,
                "category": fav.category or "Cafe",
                "created_at": fav.created_at,
            })

        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        place_id = request.data.get("place_id")
        if not place_id:
            return Response(
                {"error": "The 'place_id' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create or update favorite snapshot
        favorite, created = Favorite.objects.update_or_create(
            place_id=place_id,
            defaults={
                "name": request.data.get("name"),
                "address": request.data.get("address"),
                "rating": request.data.get("rating"),
                "user_ratings_total": request.data.get("user_ratings_total", 0),
                "photo_url": request.data.get("photo_url"),
                "category": request.data.get("category"),
                "latitude": request.data.get("latitude"),
                "longitude": request.data.get("longitude"),
            },
        )

        return Response(
            {
                "message": "Cafe saved to favorites.",
                "place_id": favorite.place_id,
                "created": created,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class FavoriteDetailView(APIView):
    """
    GET    /api/favorites/<place_id>/ -> Check if cafe is favorited
    DELETE /api/favorites/<place_id>/ -> Remove cafe from favorites
    """

    def get(self, request, place_id):
        is_favorite = Favorite.objects.filter(place_id=place_id).exists()
        return Response({"is_favorite": is_favorite}, status=status.HTTP_200_OK)

    def delete(self, request, place_id):
        deleted_count, _ = Favorite.objects.filter(place_id=place_id).delete()
        if deleted_count > 0:
            return Response(
                {"message": "Favorite removed successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Favorite not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

