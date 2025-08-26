from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MonsterViewSet, SpellViewSet

router = DefaultRouter()
router.register(r'monsters', MonsterViewSet, basename='monster')
router.register(r'spells', SpellViewSet, basename='spell')


urlpatterns = [
    path('', include(router.urls)),
]