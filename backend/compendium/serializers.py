from rest_framework import serializers

from .models import Monster, Spell


class MonsterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monster
        fields = ['id', 'name', 'url', 'cr', 'type', 'ac', 'hp']


class SpellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spell
        fields = "__all__"
