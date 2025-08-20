from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, RegisterView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]
