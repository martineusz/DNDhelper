from rest_framework import viewsets, permissions
from .models import PlayerCharacter
from .serializers import PlayerCharacterSerializer

class PlayerCharacterViewSet(viewsets.ModelViewSet):
    queryset = PlayerCharacter.objects.all()
    serializer_class = PlayerCharacterSerializer
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users can access

    def get_queryset(self):
        # optional: return only characters of the logged-in user
        return PlayerCharacter.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # automatically set the user to the logged-in user
        serializer.save(user=self.request.user)
