from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EncounterViewSet, PlayerEncounterDataViewSet, MonsterEncounterDataViewSet

router = DefaultRouter()
router.register(r'encounters', EncounterViewSet)
router.register(r'encounters/player_data', PlayerEncounterDataViewSet)
router.register(r'encounters/monster_data', MonsterEncounterDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]