from django.contrib import admin
from .models import Encounter, PlayerEncounterData, MonsterEncounterData


class PlayerEncounterDataInline(admin.StackedInline):
    model = PlayerEncounterData
    extra = 1

    fields = ("player_character", "initiative", "current_hp", "notes")
    raw_id_fields = ("player_character",)


class MonsterEncounterDataInline(admin.StackedInline):
    model = MonsterEncounterData
    extra = 1

    fields = ("monster", "initiative", "current_hp", "notes")
    raw_id_fields = ("monster",)


@admin.register(Encounter)
class EncounterAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    inlines = [
        PlayerEncounterDataInline,
        MonsterEncounterDataInline
    ]


@admin.register(PlayerEncounterData)
class PlayerEncounterDataAdmin(admin.ModelAdmin):
    list_display = ("player_character", "encounter", "initiative", "current_hp", "ac")
    search_fields = ("player_character__character_name", "notes")
    list_filter = ("encounter",)
    list_editable = ("initiative", "current_hp")
    list_per_page = 25
    raw_id_fields = ("player_character", "encounter")


@admin.register(MonsterEncounterData)
class MonsterEncounterDataAdmin(admin.ModelAdmin):
    list_display = ("monster", "encounter", "initiative", "current_hp", "ac")
    search_fields = ("monster__name", "notes")
    list_filter = ("encounter",)
    list_editable = ("initiative", "current_hp")
    list_per_page = 25
    raw_id_fields = ("monster", "encounter")