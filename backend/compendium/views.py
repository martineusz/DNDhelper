from rest_framework import viewsets

from .models import Monster, Spell
from .serializers import MonsterSerializer, SpellSerializer


class MonsterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Monster.objects.all()
    serializer_class = MonsterSerializer


class SpellViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Spell.objects.all()
    serializer_class = SpellSerializer
    lookup_field = 'slug'