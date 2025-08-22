# compendium/management/commands/load_spell_data.py
import os

import pandas as pd
from django.core.management.base import BaseCommand

from compendium.models import Spell


class Command(BaseCommand):
    help = 'Load DnD spell compendium from a CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file_path',
            type=str,
            help='Path to the local CSV file containing spell data'
        )

    def handle(self, *args, **options):
        file_path = options.get('file_path')

        if not file_path or not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        self.stdout.write("Loading spell dataset...")

        try:
            df = pd.read_csv(file_path)
            self.stdout.write(self.style.SUCCESS(f"Dataset loaded successfully! {len(df)} rows"))

            created_count = 0

            for _, row in df.iterrows():
                # Ensure classes column is stored as a list
                classes_list = row['classes']
                if isinstance(classes_list, str):
                    # Assuming classes are comma-separated in CSV
                    classes_list = [cls.strip() for cls in classes_list.split(',')]

                spell, created = Spell.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'classes': classes_list,
                        'level': int(row.get('level', 0)),
                        'school': row.get('school', ''),
                        'cast_time': row.get('cast_time', ''),
                        'range': row.get('range', ''),
                        'duration': row.get('duration', ''),
                        'verbal': bool(row.get('verbal', False)),
                        'somatic': bool(row.get('somatic', False)),
                        'material': bool(row.get('material', False)),
                        'material_cost': row.get('material_cost', ''),
                        'description': row.get('description', ''),
                    }
                )

                if created:
                    created_count += 1

            self.stdout.write(self.style.SUCCESS(f"Inserted {created_count} new spells into the database!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to load CSV: {e}"))
