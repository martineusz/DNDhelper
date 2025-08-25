from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Encounter
from .serializers import EncounterSerializer


class EncounterViewSet(viewsets.ModelViewSet):
    queryset = Encounter.objects.prefetch_related(
        'player_data__player_character',
        'monster_data__monster'
    ).all()
    serializer_class = EncounterSerializer
    permission_classes = [IsAuthenticated] # Add this to ensure the user is logged in

    def perform_create(self, serializer):
        # This will add the 'user' to the validated data before saving
        serializer.save(user=self.request.user)