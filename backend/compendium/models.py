from django.db import models


class Monster(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    cr = models.CharField(max_length=10)
    type = models.CharField(max_length=100)
    ac = models.IntegerField()
    hp = models.IntegerField()

    def __str__(self):
        return self.name


class Spell(models.Model):
    name = models.CharField(max_length=200)
    classes = models.JSONField()  # Stores list of class names
    level = models.PositiveSmallIntegerField()
    school = models.CharField(max_length=100)
    cast_time = models.CharField(max_length=100)
    range = models.CharField(max_length=50)
    duration = models.CharField(max_length=150)
    verbal = models.BooleanField(default=False)
    somatic = models.BooleanField(default=False)
    material = models.BooleanField(default=False)
    material_cost = models.TextField(blank=True, null=True)
    description = models.TextField()

    def __str__(self):
        return self.name
