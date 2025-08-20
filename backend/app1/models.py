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
