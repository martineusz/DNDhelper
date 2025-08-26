from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0005_alter_spell_material_cost"),
    ]

    operations = [
        migrations.AddField(
            model_name="spell",
            name="slug",
            field=models.SlugField(blank=True, max_length=200, unique=True),
        ),
    ]