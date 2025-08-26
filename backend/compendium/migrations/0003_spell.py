from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0002_rename_link_monster_url_remove_monster_source"),
    ]

    operations = [
        migrations.CreateModel(
            name="Spell",
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
                ("name", models.CharField(max_length=200)),
                ("classes", models.JSONField()),
                ("level", models.PositiveSmallIntegerField()),
                ("school", models.CharField(max_length=100)),
                ("cast_time", models.CharField(max_length=50)),
                ("range", models.CharField(max_length=50)),
                ("duration", models.CharField(max_length=50)),
                ("verbal", models.BooleanField(default=False)),
                ("somatic", models.BooleanField(default=False)),
                ("material", models.BooleanField(default=False)),
                (
                    "material_cost",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("description", models.TextField()),
            ],
        ),
    ]