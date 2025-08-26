import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("compendium", "0006_spell_slug"),
        ("player_characters", "0003_alter_playercharacter_character_class_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="MonsterEncounterData",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("initiative", models.IntegerField(blank=True)),
                ("current_hp", models.IntegerField(blank=True)),
                ("notes", models.TextField(blank=True, null=True)),
                (
                    "monster",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="encounter_data",
                        to="compendium.monster",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PlayerEncounterData",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("initiative", models.IntegerField(blank=True)),
                ("current_hp", models.IntegerField(blank=True)),
                ("notes", models.TextField(blank=True, null=True)),
                (
                    "player_character",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="encounter_data",
                        to="player_characters.playercharacter",
                    ),
                ),
            ],
        ),
    ]