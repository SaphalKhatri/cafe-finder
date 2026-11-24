from django.db import models


class Favorite(models.Model):
    # Unique constraint prevents duplicate favorites for the same cafe
    place_id = models.CharField(max_length=255, unique=True, db_index=True)

    # Optional snapshot fields so the Favorites screen renders instantly
    # without making redundant third-party API calls
    name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    user_ratings_total = models.IntegerField(default=0)
    photo_url = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'favorites'
        ordering = ['-created_at']

    def __str__(self):
        return self.name or self.place_id