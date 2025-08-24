from rest_framework import viewsets

from .models import PlayerEncounterData, MonsterEncounterData
from .serializers import PlayerEncounterDataSerializer, MonsterEncounterDataSerializer


class PlayerEncounterDataViewSet(viewsets.ModelViewSet):
    queryset = PlayerEncounterData.objects.all()
    serializer_class = PlayerEncounterDataSerializer


class MonsterEncounterDataViewSet(viewsets.ModelViewSet):
    queryset = MonsterEncounterData.objects.all()
    serializer_class = MonsterEncounterDataSerializer
