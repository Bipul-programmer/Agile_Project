from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Item(models.Model):
    class Kind(models.TextChoices):
        LOST = 'lost', 'Lost'
        FOUND = 'found', 'Found'

    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLAIMED = 'claimed', 'Claimed'
        RESOLVED = 'resolved', 'Resolved'

    kind = models.CharField(max_length=5, choices=Kind.choices)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name='items')
    location = models.CharField(max_length=150, help_text='Where it was lost/found')
    date_occurred = models.DateField(help_text='Date it was lost/found')
    image = models.ImageField(upload_to='items/%Y/%m/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.OPEN)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['kind', 'status'])]

    def __str__(self):
        return f'[{self.kind}] {self.title}'


class Claim(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='claims')
    claimant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='claims')
    message = models.TextField(help_text='Proof of ownership / identifying details')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [models.UniqueConstraint(fields=['item', 'claimant'], name='one_claim_per_user_per_item')]

    def __str__(self):
        return f'{self.claimant} -> {self.item} ({self.status})'
