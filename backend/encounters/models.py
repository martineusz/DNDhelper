from django.db import models

from compendium.models import Monster
from player_characters.models import PlayerCharacter


class PlayerEncounterData(models.Model):
    player_character = models.ForeignKey(
        PlayerCharacter,
        on_delete=models.PROTECT,
        related_name="encounter_data"
    )
    initiative = models.IntegerField(blank=True)
    current_hp = models.IntegerField(blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Encounter data for {self.player_character.character_name}"


class MonsterEncounterData(models.Model):
    monster = models.ForeignKey(
        Monster,
        on_delete=models.PROTECT,
        related_name="encounter_data"
    )
    initiative = models.IntegerField(blank=True)
    current_hp = models.IntegerField(blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Encounter data for {self.monster.name}"
