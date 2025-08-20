from rest_framework import viewsets
from .models import Monster
from .serializers import MonsterSerializer

class MonsterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer
