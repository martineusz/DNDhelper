import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("encounters", "0002_encounter_alter_monsterencounterdata_current_hp_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="monsterencounterdata",
            name="encounter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="monster_data",
                to="encounters.encounter",
            ),
        ),
        migrations.AlterField(
            model_name="playerencounterdata",
            name="encounter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="player_data",
                to="encounters.encounter",
            ),
        ),
    ]