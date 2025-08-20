from django.contrib import admin

from .models import Monster


@admin.register(Monster)
class MonsterAdmin(admin.ModelAdmin):
    list_display = ("name", "cr", "type", "ac", "hp")
    search_fields = ("name", "type", "cr")
    list_filter = ("type", "cr")
