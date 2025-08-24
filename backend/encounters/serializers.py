from rest_framework import serializers

from player_characters.models import PlayerCharacter
from compendium.models import Monster
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    # This serializer is used for both reading and writing (nested)
    player_character = serializers.PrimaryKeyRelatedField(
        queryset=PlayerCharacter.objects.all()
    )

    class Meta:
        model = PlayerEncounterData
        fields = ["player_character", "initiative", "current_hp", "notes"]


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    # This serializer is used for both reading and writing (nested)
    monster = serializers.PrimaryKeyRelatedField(
        queryset=Monster.objects.all()
    )

    class Meta:
        model = MonsterEncounterData
        fields = ["monster", "initiative", "current_hp", "notes"]


class EncounterSerializer(serializers.ModelSerializer):
    # Use the writable nested serializers for input
    player_data = PlayerEncounterDataSerializer(many=True)
    monster_data = MonsterEncounterDataSerializer(many=True)

    class Meta:
        model = Encounter
        fields = ["id", "name", "description", "player_data", "monster_data"]

    def create(self, validated_data):
        # Pop the nested data out of the validated_data
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])

        # Create the parent Encounter instance
        encounter = Encounter.objects.create(**validated_data)

        # Create the nested PlayerEncounterData objects
        for player_item in player_data:
            PlayerEncounterData.objects.create(encounter=encounter, **player_item)

        # Create the nested MonsterEncounterData objects
        for monster_item in monster_data:
            MonsterEncounterData.objects.create(encounter=encounter, **monster_item)

        return encounter