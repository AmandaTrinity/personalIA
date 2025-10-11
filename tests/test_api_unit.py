import unittest
import requests
import json
from bson import ObjectId

BASE_URL = "http://localhost:8000"

class TestPersonalIAAPI(unittest.TestCase):
    def setUp(self):
        self.user_id = str(ObjectId())
        self.base_url = BASE_URL

    def test_get_empty_treinos(self):
        response = requests.get(f"{self.base_url}/treinos/{self.user_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 0)

    def test_post_and_get_single_treino(self):
        # Faz um POST simples
        treino_data = {
            "nivel": "iniciante",
            "objetivo": "perda de peso",
            "equipamentos": ["halteres", "esteira"],
            "frequencia": "3x por semana",
            "mensagem_usuario": "Teste objetivo: perda de peso"
        }
        response = requests.post(
            f"{self.base_url}/treinos/{self.user_id}",
            json=treino_data,
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("treino", result)
        treino = result["treino"]
        self.assertIn("plano_gerado", treino)
        self.assertIsInstance(treino["plano_gerado"], str)

        # Agora verifica se há 1 treino para o usuário
        response = requests.get(f"{self.base_url}/treinos/{self.user_id}")
        self.assertEqual(response.status_code, 200)
        treinos = response.json()
        self.assertEqual(len(treinos), 1)
        self.assertEqual(treinos[0]["objetivo"], "perda de peso")
        