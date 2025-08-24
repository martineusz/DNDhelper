from django.contrib import admin
from .models import PlayerEncounterData, MonsterEncounterData


@admin.register(PlayerEncounterData)
class PlayerEncounterDataAdmin(admin.ModelAdmin):
    list_display = ("player_character", "initiative", "current_hp", "notes")
    search_fields = ("player_character__character_name", "notes")
    list_filter = ("initiative",)
    ordering = ("initiative",)


@admin.register(MonsterEncounterData)
class MonsterEncounterDataAdmin(admin.ModelAdmin):
    list_display = ("monster", "initiative", "current_hp", "notes")
    search_fields = ("monster__name", "notes")
    list_filter = ("initiative",)
    ordering = ("initiative",)
