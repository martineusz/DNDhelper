from rest_framework import serializers

from player_characters.models import PlayerCharacter
from compendium.models import Monster
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


# Step 1: Create a nested serializer for PlayerCharacter
class PlayerCharacterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ["id", "character_name"]  # Only include the fields you need


# Step 2: Create a nested serializer for Monster
class MonsterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = ["id", "name"]  # Only include the fields you need


class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    # Step 3: Use the nested serializer for the player_character field
    player_character = PlayerCharacterNestedSerializer(read_only=True)

    # Allow a custom name to be written, but it won't be read back in this way.
    # The 'name' field is used for custom entries.
    name = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = PlayerEncounterData
        fields = ["player_character", "name", "initiative", "current_hp", "notes"]


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    # Step 4: Use the nested serializer for the monster field
    monster = MonsterNestedSerializer(read_only=True)

    # Allow a custom name to be written, but it won't be read back in this way.
    # The 'name' field is used for custom entries.
    name = serializers.CharField(required=False, allow_null=True)
    ac = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = MonsterEncounterData
        fields = ["monster", "name", "initiative", "current_hp", "ac", "notes"]


class EncounterSerializer(serializers.ModelSerializer):
    # Step 5: Use the updated serializers for the nested data
    player_data = PlayerEncounterDataSerializer(many=True, required=False)
    monster_data = MonsterEncounterDataSerializer(many=True, required=False)

    class Meta:
        model = Encounter
        fields = ["id", "name", "description", "player_data", "monster_data", "user"]
        read_only_fields = ["user"]

    def create(self, validated_data):
        # Your create method is already correct and doesn't need changes.
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])
        encounter = Encounter.objects.create(**validated_data)

        for player_item in player_data:
            PlayerEncounterData.objects.create(encounter=encounter, **player_item)

        for monster_item in monster_data:
            MonsterEncounterData.objects.create(encounter=encounter, **monster_item)

        return encounter