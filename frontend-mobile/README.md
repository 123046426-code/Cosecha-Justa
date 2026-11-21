# Aplicación Móvil (React Native) - Cosecha Justa

Este módulo contiene el desarrollo de la aplicación móvil híbrida (Android e iOS) desarrollada en **React Native / Expo**, requerida como entregable del **Avance 1**.

## 📱 Perfiles Integrados en una Sola App

La aplicación cuenta con cambio de contexto y vistas diferenciadas según el rol del usuario autenticado:

### 🌾 1. Perfil Productor
- **RF-PRO-01**: Registro e inicio de sesión seguro.
- **RF-PRO-02**: Administración de datos de contacto y perfil de finca/negocio.
- **RF-PRO-03**: Alta de productos con selector de categoría, fotos, precio y existencias.
- **RF-PRO-04**: Actualización rápida de precios.
- **RF-PRO-05**: Ajuste de inventario/cantidades disponibles.
- **RF-PRO-06**: Pausar y republicar productos sin eliminarlos.
- **RF-PRO-07**: Lista y detalle de pedidos recibidos en tiempo real.
- **RF-PRO-08**: Aceptar o rechazar pedidos de compra.
- **RF-PRO-09**: Avance de estados del pedido (*Aceptado -> En preparación -> Listo -> Entregado*).
- **RF-PRO-10**: Gráficas de ventas y productos más solicitados.
- **RF-PRO-11**: Configuración de costos y opciones de entrega (finca, domicilio, punto medio).

### 🛒 2. Perfil Consumidor
- **RF-CON-01**: Creación y edición de cuenta y dirección de entrega.
- **RF-CON-02**: Buscador de productos con filtros por categoría, sector y rango de precio.
- **RF-CON-03**: Perfil transparente del productor y sus cosechas disponibles.
- **RF-CON-04**: Comparador de precios entre diferentes productores locales.
- **RF-CON-05**: Carrito de compras con cálculo automático de totales.
- **RF-CON-06**: Generación de pedidos divididos por productor y selección de entrega.
- **RF-CON-07 / RF-CON-08**: Historial de pedidos y trazabilidad de estatus en tiempo real.
- **RF-CON-09**: Calificación con estrellas (1 a 5) y comentarios para pedidos entregados.

## 🔌 Conexión con FastAPI (Desacoplado)

Toda la aplicación móvil interactúa con la API REST a través de un cliente centralizado Axios/Fetch:

```typescript
// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:8000/api/v1'; // 10.0.2.2 para emulador Android, o IP LAN

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@cosecha_justa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
