from django.contrib import admin

from .models import Monster, Spell


@admin.register(Monster)
class MonsterAdmin(admin.ModelAdmin):
    list_display = ("name", "cr", "type", "ac", "hp")
    search_fields = ("name", "type", "cr")
    list_filter = ("type", "cr")


@admin.register(Spell)
class SpellAdmin(admin.ModelAdmin):
    list_display = ("name", 'slug', 'classes', "level", "school", "cast_time", "range", "duration", 'material_cost')
    search_fields = ("name", "school", "classes")
    list_filter = ("level", "school", "classes")
