# encounters/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import EncounterViewSet

router = DefaultRouter()
router.register(r'encounters', EncounterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]