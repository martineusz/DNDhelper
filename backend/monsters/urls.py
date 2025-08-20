from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MonsterViewSet

router = DefaultRouter()
router.register(r'monsters', MonsterViewSet, basename='monster')

urlpatterns = [
    path('', include(router.urls)),
]
