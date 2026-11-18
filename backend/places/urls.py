from django.urls import path
from .views import PlaceSearchView,PlacePhotoView,PlaceDetailView

urlpatterns = [
    path("search/", PlaceSearchView.as_view(), name="places-search"),
    path("photo/", PlacePhotoView.as_view(), name="places-photo"),
    path("<str:place_id>/", PlaceDetailView.as_view(), name="places-detail"),
]