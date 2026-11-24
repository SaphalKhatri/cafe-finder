
from django.urls import path
from .views import (
    PlaceSearchView,
    PlacePhotoView,
    PlaceDetailView,
    FavoriteListCreateView,
    FavoriteDetailView,
)

urlpatterns = [
    path("search/", PlaceSearchView.as_view(), name="places-search"),
    path("photo/", PlacePhotoView.as_view(), name="places-photo"),

  
    # Dynamic place detail endpoint - keep last
    path("<str:place_id>/", PlaceDetailView.as_view(), name="places-detail"),
]
