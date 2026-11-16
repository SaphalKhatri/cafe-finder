from django.urls import path
from .views import PlaceSearchView,PlacePhotoView

urlpatterns = [
    path("search/", PlaceSearchView.as_view(), name="places-search"),
    path("photo/", PlacePhotoView.as_view(), name="places-photo"),
]