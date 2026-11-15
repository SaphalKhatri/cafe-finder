import logging
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import search_nearby_places

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