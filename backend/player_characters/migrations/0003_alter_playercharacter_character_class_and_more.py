from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("player_characters", "0002_playercharacter_character_experience_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playercharacter",
            name="character_class",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="playercharacter",
            name="character_name",
            field=models.CharField(default="Unnamed Character", max_length=200),
        ),
        migrations.AlterField(
            model_name="playercharacter",
            name="character_race",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name="playercharacter",
            name="player_name",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]