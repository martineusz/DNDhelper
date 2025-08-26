import os
import pandas as pd
from django.core.management.base import BaseCommand
from compendium.models import Monster  

class Command(BaseCommand):
    help = 'Load DnD compendium from a CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file_path',
            type=str,
            help='Path to the local CSV file containing compendium'
        )

    def handle(self, *args, **options):
        file_path = options.get('file_path')

        if not file_path or not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"File not found: {file_path}"))
            return

        self.stdout.write("Loading dataset...")

        try:
            df = pd.read_csv(file_path)
            self.stdout.write(self.style.SUCCESS(f"Dataset loaded successfully! {len(df)} rows"))

            created_count = 0

            for _, row in df.iterrows():
                
                monster, created = Monster.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'url': row.get('url', ''),
                        'cr': row.get('cr', ''),
                        'type': row.get('type', ''),
                        'ac': int(row.get('ac', 0)),
                        'hp': int(row.get('hp', 0)),
                    }
                )
                if created:
                    created_count += 1

            self.stdout.write(self.style.SUCCESS(f"Inserted {created_count} new compendium into the database!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to load CSV: {e}"))