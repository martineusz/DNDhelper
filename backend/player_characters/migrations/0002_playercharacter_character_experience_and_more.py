from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("player_characters", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="playercharacter",
            name="character_experience",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="playercharacter",
            name="character_level",
            field=models.IntegerField(default=1),
        ),
    ]