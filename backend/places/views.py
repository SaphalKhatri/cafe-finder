import logging
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from urllib.parse import unquote
from django.http import HttpResponse,HttpResponseNotFound
from .services import search_nearby_places,get_place_details

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


