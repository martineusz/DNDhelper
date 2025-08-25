from django.db import models
from django.contrib.auth.models import User

from compendium.models import Monster
from player_characters.models import PlayerCharacter


class Encounter(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="encounters"
    )

    def __str__(self):
        return self.name


class PlayerEncounterData(models.Model):
    encounter = models.ForeignKey(
        Encounter,
        on_delete=models.CASCADE,
        related_name="player_data"
    )
    player_character = models.ForeignKey(
        PlayerCharacter,
        on_delete=models.PROTECT,
        related_name="encounter_data"
    )
    initiative = models.IntegerField(blank=True, null=True)
    current_hp = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Encounter data for {self.player_character.character_name}"


class MonsterEncounterData(models.Model):
    encounter = models.ForeignKey(
        Encounter,
        on_delete=models.CASCADE,
        related_name="monster_data"
    )
    monster = models.ForeignKey(
        Monster,
        on_delete=models.PROTECT,
        related_name="encounter_data"
    )
    initiative = models.IntegerField(blank=True, null=True)
    current_hp = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Encounter data for {self.monster.name}"