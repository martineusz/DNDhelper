from rest_framework import serializers

from player_characters.models import PlayerCharacter
from compendium.models import Monster
from .models import PlayerEncounterData, MonsterEncounterData


class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    player_character = serializers.PrimaryKeyRelatedField(
        queryset=PlayerCharacter.objects.all()
    )

    class Meta:
        model = PlayerEncounterData
        fields = '__all__'


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    monster = serializers.PrimaryKeyRelatedField(
        queryset=Monster.objects.all()
    )

    class Meta:
        model = MonsterEncounterData
        fields = '__all__'