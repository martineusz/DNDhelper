from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlayerCharacterViewSet

router = DefaultRouter()
router.register(r'characters', PlayerCharacterViewSet, basename="characters")

urlpatterns = [
    path('', include(router.urls)),
]