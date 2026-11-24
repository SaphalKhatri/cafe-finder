
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

    # Favorites endpoints
    path("favorites/", FavoriteListCreateView.as_view(), name="favorites-list-create"),
    path("favorites/<str:place_id>/", FavoriteDetailView.as_view(), name="favorites-detail"),

    # Dynamic place detail endpoint - keep last
    path("<str:place_id>/", PlaceDetailView.as_view(), name="places-detail"),
]
