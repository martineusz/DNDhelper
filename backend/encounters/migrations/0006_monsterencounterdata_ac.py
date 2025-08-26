from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "encounters",
            "0005_monsterencounterdata_name_playerencounterdata_name_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="monsterencounterdata",
            name="ac",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]