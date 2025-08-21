from rest_framework import serializers
from .models import PlayerCharacter

class PlayerCharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = "__all__"
        read_only_fields = ['user']