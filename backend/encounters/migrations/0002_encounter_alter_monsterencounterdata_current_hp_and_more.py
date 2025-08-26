import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("encounters", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Encounter",
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
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name="monsterencounterdata",
            name="current_hp",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="monsterencounterdata",
            name="initiative",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="playerencounterdata",
            name="current_hp",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="playerencounterdata",
            name="initiative",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="monsterencounterdata",
            name="encounter",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="monster_data",
                to="encounters.encounter",
            ),
        ),
        migrations.AddField(
            model_name="playerencounterdata",
            name="encounter",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="player_data",
                to="encounters.encounter",
            ),
        ),
    ]