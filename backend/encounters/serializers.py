# encounters/serializers.py
from rest_framework import serializers

from compendium.models import Monster
from player_characters.models import PlayerCharacter
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


# Nested serializers remain the same as they are for read-only purposes
class PlayerCharacterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ["id", "character_name"]


class MonsterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = ["id", "name"]


# Writable serializers for PlayerEncounterData and MonsterEncounterData
# These serializers will handle the creation and updating of the nested models
class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    # This field is for display purposes, so it remains read-only
    player_character = PlayerCharacterNestedSerializer(read_only=True)

    # We need a field to accept the player_character ID on write
    player_character_id = serializers.PrimaryKeyRelatedField(
        queryset=PlayerCharacter.objects.all(),
        source='player_character',
        required=False,
        allow_null=True
    )

    class Meta:
        model = PlayerEncounterData
        fields = ["id", "player_character", "player_character_id", "name", "initiative", "current_hp", "ac",
                  "notes"] # 'ac' is now included


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    # This field is for display purposes, so it remains read-only
    monster = MonsterNestedSerializer(read_only=True)

    # We need a field to accept the monster ID on write
    monster_id = serializers.PrimaryKeyRelatedField(
        queryset=Monster.objects.all(),
        source='monster',
        required=False,
        allow_null=True
    )

    class Meta:
        model = MonsterEncounterData
        fields = ["id", "monster", "monster_id", "name", "initiative", "current_hp", "ac", "notes"]


class EncounterSerializer(serializers.ModelSerializer):
    player_data = PlayerEncounterDataSerializer(many=True, required=False)
    monster_data = MonsterEncounterDataSerializer(many=True, required=False)

    class Meta:
        model = Encounter
        fields = ["id", "name", "description", "player_data", "monster_data", "user"]
        read_only_fields = ["user"]

    def create(self, validated_data):
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])
        encounter = Encounter.objects.create(**validated_data)

        for player_item in player_data:
            PlayerEncounterData.objects.create(encounter=encounter, **player_item)

        for monster_item in monster_data:
            MonsterEncounterData.objects.create(encounter=encounter, **monster_item)

        return encounter

    def update(self, instance, validated_data):
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])

        # Update parent fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Update or create PlayerEncounterData instances
        player_data_ids = [item.get('id') for item in player_data if 'id' in item]
        for player_item in player_data:
            player_id = player_item.get('id')
            if player_id:
                # Update existing instance
                player_instance = PlayerEncounterData.objects.get(id=player_id, encounter=instance)
                for key, value in player_item.items():
                    setattr(player_instance, key, value)
                player_instance.save()
            else:
                # Create new instance
                PlayerEncounterData.objects.create(encounter=instance, **player_item)

        # Delete old player data instances not in the new list
        PlayerEncounterData.objects.filter(encounter=instance).exclude(id__in=player_data_ids).delete()

        # Update or create MonsterEncounterData instances
        monster_data_ids = [item.get('id') for item in monster_data if 'id' in item]
        for monster_item in monster_data:
            monster_id = monster_item.get('id')
            if monster_id:
                # Update existing instance
                monster_instance = MonsterEncounterData.objects.get(id=monster_id, encounter=instance)
                for key, value in monster_item.items():
                    setattr(monster_instance, key, value)
                monster_instance.save()
            else:
                # Create new instance
                MonsterEncounterData.objects.create(encounter=instance, **monster_item)

        # Delete old monster data instances not in the new list
        MonsterEncounterData.objects.filter(encounter=instance).exclude(id__in=monster_data_ids).delete()

        return instance