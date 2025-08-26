from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("encounters", "0007_alter_monsterencounterdata_encounter"),
    ]

    operations = [
        migrations.AddField(
            model_name="playerencounterdata",
            name="ac",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]