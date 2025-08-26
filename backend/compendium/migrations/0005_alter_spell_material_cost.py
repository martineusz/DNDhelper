from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0004_alter_spell_cast_time_alter_spell_duration_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="spell",
            name="material_cost",
            field=models.TextField(blank=True, null=True),
        ),
    ]