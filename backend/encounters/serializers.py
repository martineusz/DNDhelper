from rest_framework import serializers

from player_characters.models import PlayerCharacter
from compendium.models import Monster
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    player_character = serializers.PrimaryKeyRelatedField(
        queryset=PlayerCharacter.objects.all()
    )

    class Meta:
        model = PlayerEncounterData
        fields = ["player_character", "initiative", "current_hp", "notes"]


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    monster = serializers.PrimaryKeyRelatedField(
        queryset=Monster.objects.all()
    )

    class Meta:
        model = MonsterEncounterData
        fields = ["monster", "initiative", "current_hp", "notes"]


class EncounterSerializer(serializers.ModelSerializer):
    player_data = PlayerEncounterDataSerializer(many=True)
    monster_data = MonsterEncounterDataSerializer(many=True)

    class Meta:
        model = Encounter
        # Add 'user' to the fields
        fields = ["id", "name", "description", "player_data", "monster_data", "user"]
        # Make 'user' a read-only field
        read_only_fields = ["user"]

    def create(self, validated_data):
        # The user field is now passed via the viewset's serializer.save() method.
        # It's already in validated_data and doesn't need to be popped.
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])

        # The user is now automatically included in validated_data
        encounter = Encounter.objects.create(**validated_data)

        for player_item in player_data:
            PlayerEncounterData.objects.create(encounter=encounter, **player_item)

        for monster_item in monster_data:
            MonsterEncounterData.objects.create(encounter=encounter, **monster_item)

        return encounter