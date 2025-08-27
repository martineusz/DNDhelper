from rest_framework import serializers

from compendium.models import Monster
from player_characters.models import PlayerCharacter
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


class PlayerCharacterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCharacter
        fields = ["id", "character_name"]


class MonsterNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = ["id", "name"]


class PlayerEncounterDataSerializer(serializers.ModelSerializer):
    player_character = PlayerCharacterNestedSerializer(read_only=True)

    player_character_id = serializers.PrimaryKeyRelatedField(
        queryset=PlayerCharacter.objects.all(),
        source='player_character',
        required=False,
        allow_null=True
    )

    id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = PlayerEncounterData
        fields = ["id", "player_character", "player_character_id", "name", "initiative", "current_hp", "ac",
                  "notes"]


class MonsterEncounterDataSerializer(serializers.ModelSerializer):
    monster = MonsterNestedSerializer(read_only=True)

    monster_id = serializers.PrimaryKeyRelatedField(
        queryset=Monster.objects.all(),
        source='monster',
        required=False,
        allow_null=True
    )

    id = serializers.IntegerField(required=False, allow_null=True)

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
            player_item.pop('id', None)
            PlayerEncounterData.objects.create(encounter=encounter, **player_item)

        for monster_item in monster_data:
            monster_item.pop('id', None)
            MonsterEncounterData.objects.create(encounter=encounter, **monster_item)

        return encounter

    def update(self, instance, validated_data):
        player_data = validated_data.pop('player_data', [])
        monster_data = validated_data.pop('monster_data', [])

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Update and create player data
        player_data_ids = []
        for player_item in player_data:
            player_id = player_item.get('id')
            if player_id:
                # Update existing participant
                player_instance = PlayerEncounterData.objects.get(id=player_id, encounter=instance)
                player_instance.name = player_item.get('name', player_instance.name)
                player_instance.initiative = player_item.get('initiative', player_instance.initiative)
                player_instance.current_hp = player_item.get('current_hp', player_instance.current_hp)
                player_instance.ac = player_item.get('ac', player_instance.ac)
                player_instance.notes = player_item.get('notes', player_instance.notes)
                player_instance.save()
                player_data_ids.append(player_id)
            else:
                # Create new participant
                player_item.pop('id', None)
                new_player = PlayerEncounterData.objects.create(encounter=instance, **player_item)
                player_data_ids.append(new_player.id)

        # Delete removed player data
        PlayerEncounterData.objects.filter(encounter=instance).exclude(id__in=player_data_ids).delete()

        # Update and create monster data
        monster_data_ids = []
        for monster_item in monster_data:
            monster_id = monster_item.get('id')
            if monster_id:
                # Update existing participant
                monster_instance = MonsterEncounterData.objects.get(id=monster_id, encounter=instance)
                monster_instance.name = monster_item.get('name', monster_instance.name)
                monster_instance.initiative = monster_item.get('initiative', monster_instance.initiative)
                monster_instance.current_hp = monster_item.get('current_hp', monster_instance.current_hp)
                monster_instance.ac = monster_item.get('ac', monster_instance.ac)
                monster_instance.notes = monster_item.get('notes', monster_instance.notes)
                monster_instance.save()
                monster_data_ids.append(monster_id)
            else:
                # Create new participant
                monster_item.pop('id', None)
                new_monster = MonsterEncounterData.objects.create(encounter=instance, **monster_item)
                monster_data_ids.append(new_monster.id)

        # Delete removed monster data
        MonsterEncounterData.objects.filter(encounter=instance).exclude(id__in=monster_data_ids).delete()

        return instance