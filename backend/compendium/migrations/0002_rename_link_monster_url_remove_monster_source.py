from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("compendium", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="monster",
            old_name="link",
            new_name="url",
        ),
        migrations.RemoveField(
            model_name="monster",
            name="source",
        ),
    ]