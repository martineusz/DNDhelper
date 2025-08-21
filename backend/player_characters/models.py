from django.contrib.auth.models import User
from django.db import models


class PlayerCharacter(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="characters"
    )
    character_name = models.CharField(max_length=200)
    player_name = models.CharField(max_length=100)
    character_race = models.CharField(max_length=200)
    character_subrace = models.CharField(max_length=200, blank=True, null=True)
    character_class = models.CharField(max_length=200)
    character_subclass = models.CharField(max_length=200, blank=True, null=True)
    ac = models.IntegerField(blank=True, null=True)
    hp = models.IntegerField(blank=True, null=True)
    info = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.character_name} ({self.user.username})"
