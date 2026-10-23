from django.core.management.base import BaseCommand

from items.models import Category

DEFAULTS = ['ID / Cards', 'Electronics', 'Books & Notes', 'Keys', 'Bags', 'Clothing',
            'Water Bottles', 'Wallets', 'Jewelry / Accessories', 'Other']


class Command(BaseCommand):
    help = 'Create default item categories'

    def handle(self, *args, **opts):
        for name in DEFAULTS:
            Category.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS(f'{len(DEFAULTS)} categories ready'))
