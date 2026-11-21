import unittest
import httpx

BASE_URL = "http://127.0.0.1:8000/api/v1"

class TestCosechaJustaAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = httpx.Client(base_url=BASE_URL, timeout=10.0)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()

    def test_01_health_and_docs(self):
        """Verifica que la documentación OpenAPI y Swagger responden con 200"""
        res = httpx.get("http://127.0.0.1:8000/docs", timeout=5.0)
        self.assertEqual(res.status_code, 200)

    def test_02_login_admin(self):
        """Autenticación exitosa del Administrador (Rol 1)"""
        res = self.client.post("/auth/login", json={
            "correo": "admin@cosechajusta.upq.edu.mx",
            "contrasena": "Admin1234*"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["role_id"], 1)

    def test_03_login_productor(self):
        """Autenticación exitosa del Productor (Rol 2)"""
        res = self.client.post("/auth/login", json={
            "correo": "productor@cosechajusta.upq.edu.mx",
            "contrasena": "Productor1234*"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["role_id"], 2)

    def test_04_login_consumidor(self):
        """Autenticación exitosa del Consumidor (Rol 3)"""
        res = self.client.post("/auth/login", json={
            "correo": "consumidor@cosechajusta.upq.edu.mx",
            "contrasena": "Consumidor1234*"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["role_id"], 3)

    def test_05_login_invalid_password(self):
        """Rechazo con 401 para credenciales incorrectas"""
        res = self.client.post("/auth/login", json={
            "correo": "admin@cosechajusta.upq.edu.mx",
            "contrasena": "PasswordErroneo999"
        })
        self.assertEqual(res.status_code, 401)

    def test_06_public_catalogs(self):
        """Consulta pública de catálogos base (categorías y unidades)"""
        res_cat = self.client.get("/catalogs/categories")
        self.assertEqual(res_cat.status_code, 200)
        cats = res_cat.json()
        self.assertIsInstance(cats, list)
        self.assertGreater(len(cats), 0)

        res_units = self.client.get("/catalogs/measurement-units")
        self.assertEqual(res_units.status_code, 200)
        units = res_units.json()
        self.assertIsInstance(units, list)
        self.assertGreater(len(units), 0)

    def test_07_public_products(self):
        """Consulta y filtrado público de productos en catálogo"""
        res = self.client.get("/products")
        self.assertEqual(res.status_code, 200)
        prods = res.json()
        self.assertIsInstance(prods, list)

        # Filtrar por sector agrícola
        res_sec = self.client.get("/products?sector=agricola")
        self.assertEqual(res_sec.status_code, 200)

    def test_08_admin_dashboard_metrics(self):
        """Acceso a métricas administrativas con token Bearer"""
        # Login admin
        token = self.client.post("/auth/login", json={
            "correo": "admin@cosechajusta.upq.edu.mx",
            "contrasena": "Admin1234*"
        }).json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        res = self.client.get("/admin/dashboard", headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_usuarios", data)
        self.assertIn("total_productores", data)
        self.assertIn("total_productos_activos", data)

    def test_09_admin_orders_and_reports(self):
        """Acceso a lista global de pedidos y reportes consolidados"""
        token = self.client.post("/auth/login", json={
            "correo": "admin@cosechajusta.upq.edu.mx",
            "contrasena": "Admin1234*"
        }).json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        # Pedidos
        res_ord = self.client.get("/admin/orders", headers=headers)
        self.assertEqual(res_ord.status_code, 200)
        self.assertIsInstance(res_ord.json(), list)

        # Reporte de ventas
        res_rep = self.client.get("/admin/reports/sales", headers=headers)
        self.assertEqual(res_rep.status_code, 200)
        rep = res_rep.json()
        self.assertIn("monto_total_ventas", rep)
        self.assertIn("ticket_promedio", rep)

    def test_10_rbac_access_control(self):
        """Control de acceso RBAC: Consumidor no puede acceder al panel administrativo"""
        token_cons = self.client.post("/auth/login", json={
            "correo": "consumidor@cosechajusta.upq.edu.mx",
            "contrasena": "Consumidor1234*"
        }).json()["access_token"]

        headers = {"Authorization": f"Bearer {token_cons}"}
        res = self.client.get("/admin/dashboard", headers=headers)
        self.assertEqual(res.status_code, 403)

if __name__ == "__main__":
    unittest.main()
