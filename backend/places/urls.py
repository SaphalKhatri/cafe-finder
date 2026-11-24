from django.urls import path
from .views import PlaceSearchView,PlacePhotoView,PlaceDetailView
from .views import FavoriteListCreateView, FavoriteDetailView

urlpatterns = [
    path("search/", PlaceSearchView.as_view(), name="places-search"),
    path("photo/", PlacePhotoView.as_view(), name="places-photo"),
    path("<str:place_id>/", PlaceDetailView.as_view(), name="places-detail"),
    path('favorites/', FavoriteListCreateView.as_view(), name='favorites-list-create'),
    path('favorites/<str:place_id>/', FavoriteDetailView.as_view(), name='favorites-detail')
]