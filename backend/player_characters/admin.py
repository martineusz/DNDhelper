from django.contrib import admin

from .models import PlayerCharacter


@admin.register(PlayerCharacter)
class PlayerCharacterAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "character_name",
        "player_name",
        "character_race",
        "character_subrace",
        "character_class",
        "character_subclass",
        "ac",
        "hp",
        "info",
    )
    list_filter = ("character_race", "character_class", "user")
    search_fields = ("character_name", "player_name", "user__username")
    ordering = ("id",)
