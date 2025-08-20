from django.contrib import admin

from .models import Monster


@admin.register(Monster)
class MonsterAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'cr', 'type', 'ac', 'hp')
    search_fields = ('name', 'type', 'source')
