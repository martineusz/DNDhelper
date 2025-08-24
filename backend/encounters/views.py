# encounters/views.py
from rest_framework import viewsets

from .models import Encounter
from .serializers import EncounterSerializer


class EncounterViewSet(viewsets.ModelViewSet):
    queryset = Encounter.objects.prefetch_related(
        'player_data__player_character',
        'monster_data__monster'
    ).all()
    serializer_class = EncounterSerializer