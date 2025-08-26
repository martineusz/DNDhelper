from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0003_spell"),
    ]

    operations = [
        migrations.AlterField(
            model_name="spell",
            name="cast_time",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="spell",
            name="duration",
            field=models.CharField(max_length=150),
        ),
        migrations.AlterField(
            model_name="spell",
            name="material_cost",
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]