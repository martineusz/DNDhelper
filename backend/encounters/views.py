from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Encounter
from .serializers import EncounterSerializer


class EncounterViewSet(viewsets.ModelViewSet):
    queryset = Encounter.objects.prefetch_related(
        'player_data__player_character',
        'monster_data__monster'
    ).all()
    serializer_class = EncounterSerializer
    permission_classes = [IsAuthenticated] 

    
    
    @action(detail=False, methods=['get'])
    def my_encounters(self, request):
        
        user_encounters = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(user_encounters, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        
        
        serializer.save(user=self.request.user)