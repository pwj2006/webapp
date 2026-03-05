from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthApiTests(APITestCase):
    def test_register_login_and_me(self):
        register_url = reverse("register")
        login_url = reverse("login")
        me_url = reverse("me")

        register_res = self.client.post(
            register_url,
            {"username": "alice", "password": "securepass123"},
            format="json",
        )
        self.assertEqual(register_res.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", register_res.data)

        login_res = self.client.post(
            login_url,
            {"username": "alice", "password": "securepass123"},
            format="json",
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

        token = login_res.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

        me_res = self.client.get(me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["username"], "alice")
