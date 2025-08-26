import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0006_spell_slug"),
        ("encounters", "0004_encounter_user"),
        ("player_characters", "0003_alter_playercharacter_character_class_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="monsterencounterdata",
            name="name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="playerencounterdata",
            name="name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="monsterencounterdata",
            name="encounter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="monster_data",
                to="encounters.encounter",
            ),
        ),
        migrations.AlterField(
            model_name="monsterencounterdata",
            name="monster",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="encounter_data",
                to="compendium.monster",
            ),
        ),
        migrations.AlterField(
            model_name="playerencounterdata",
            name="player_character",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="encounter_data",
                to="player_characters.playercharacter",
            ),
        ),
    ]