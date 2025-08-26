import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("encounters", "0006_monsterencounterdata_ac"),
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
    ]