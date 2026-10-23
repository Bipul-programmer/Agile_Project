import tempfile
from datetime import date

from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import Item

User = get_user_model()


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class FlowTests(APITestCase):
    def setUp(self):
        self.finder = User.objects.create_user('finder', 'f@x.edu', 'pw-12345-xyz')
        self.owner = User.objects.create_user('owner', 'o@x.edu', 'pw-12345-xyz')
        self.other = User.objects.create_user('other', 'x@x.edu', 'pw-12345-xyz')
        self.payload = {'kind': 'found', 'title': 'Blue wallet', 'location': 'Library',
                        'date_occurred': date.today().isoformat()}

    def test_anonymous_can_read_not_write(self):
        self.assertEqual(self.client.get('/api/items/').status_code, 200)
        self.assertEqual(self.client.post('/api/items/', self.payload).status_code, 401)

    def test_only_reporter_can_edit(self):
        self.client.force_authenticate(self.finder)
        item_id = self.client.post('/api/items/', self.payload).data['id']
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.patch(f'/api/items/{item_id}/', {'title': 'x'}).status_code, 403)

    def test_future_date_rejected(self):
        self.client.force_authenticate(self.finder)
        self.payload['date_occurred'] = '2999-01-01'
        self.assertEqual(self.client.post('/api/items/', self.payload).status_code, 400)

    def test_claim_approve_flow(self):
        self.client.force_authenticate(self.finder)
        item_id = self.client.post('/api/items/', self.payload).data['id']

        self.client.force_authenticate(self.owner)
        r = self.client.post(f'/api/items/{item_id}/claim/', {'message': 'Has my student ID inside'})
        self.assertEqual(r.status_code, 201)
        claim_id = r.data['id']
        self.assertEqual(self.client.post(f'/api/items/{item_id}/claim/', {'message': 'again'}).status_code, 400)

        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post(f'/api/claims/{claim_id}/approve/').status_code, 404)  # not involved

        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.post(f'/api/claims/{claim_id}/approve/').status_code, 403)  # claimant != reporter

        self.client.force_authenticate(self.finder)
        r = self.client.post(f'/api/claims/{claim_id}/approve/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['contact_email'], 'o@x.edu')
        self.assertEqual(Item.objects.get(pk=item_id).status, 'claimed')

    def test_cannot_claim_own_item(self):
        self.client.force_authenticate(self.finder)
        item_id = self.client.post('/api/items/', self.payload).data['id']
        self.assertEqual(self.client.post(f'/api/items/{item_id}/claim/', {'message': 'mine'}).status_code, 400)

    def test_register_and_login(self):
        r = self.client.post('/api/auth/register/', {'username': 'new', 'email': 'n@x.edu', 'password': 'Str0ng-pass-99'})
        self.assertEqual(r.status_code, 201)
        self.assertIn('token', r.data)
        r = self.client.post('/api/auth/login/', {'username': 'new', 'password': 'Str0ng-pass-99'})
        self.assertEqual(r.status_code, 200)
