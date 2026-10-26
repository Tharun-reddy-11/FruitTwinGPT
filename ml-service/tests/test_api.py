import unittest
from fastapi.testclient import TestClient
from app.main import app

class ApiTests(unittest.TestCase):
    def setUp(self): self.client = TestClient(app)
    def test_health(self): self.assertEqual(self.client.get("/health").status_code, 200)
    def test_research_mode_fails_closed(self): self.assertEqual(self.client.post("/predict/multimodal", json={"mode":"research","plant_id":1,"growth_stage":"flowering"}).status_code, 409)
    def test_demo_mode_is_explicitly_labelled(self):
        response=self.client.post("/predict/multimodal", json={"mode":"demo","plant_id":1,"growth_stage":"flowering","soil_ph":6.5})
        self.assertEqual(response.status_code, 200); self.assertEqual(response.json()["status"], "DEMONSTRATION_ONLY")

if __name__ == "__main__": unittest.main()
