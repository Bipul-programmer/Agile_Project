from django.contrib import admin

from .models import Category, Claim, Item


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ['name']


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'kind', 'status', 'location', 'reporter', 'created_at']
    list_filter = ['kind', 'status', 'category']
    search_fields = ['title', 'description', 'location', 'reporter__username']


@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ['item', 'claimant', 'status', 'created_at']
    list_filter = ['status']
