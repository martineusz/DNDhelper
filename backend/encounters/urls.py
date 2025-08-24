# encounters/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Make sure this import path is correct for your project
from .views import PlayerEncounterDataViewSet, MonsterEncounterDataViewSet

router = DefaultRouter()
router.register(r'player-encounters', PlayerEncounterDataViewSet)
router.register(r'monster-encounters', MonsterEncounterDataViewSet)

urlpatterns = [
    # This includes the URLs from the router under the 'encounters' app namespace
    path('', include(router.urls)),
]