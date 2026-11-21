import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Pantallas de Autenticación
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';

// Pantallas Productor
import { ProducerDashboardScreen } from './src/screens/producer/ProducerDashboardScreen';
import { MyProductsScreen } from './src/screens/producer/MyProductsScreen';
import { ProductFormScreen } from './src/screens/producer/ProductFormScreen';
import { ProducerOrdersScreen } from './src/screens/producer/ProducerOrdersScreen';
import { DeliveryOptionsScreen } from './src/screens/producer/DeliveryOptionsScreen';

// Pantallas Consumidor
import { ConsumerCatalogScreen } from './src/screens/consumer/ConsumerCatalogScreen';
import { ProductDetailScreen } from './src/screens/consumer/ProductDetailScreen';
import { PriceComparisonScreen } from './src/screens/consumer/PriceComparisonScreen';
import { CartScreen } from './src/screens/consumer/CartScreen';
import { OrderHistoryScreen } from './src/screens/consumer/OrderHistoryScreen';

const Stack = createStackNavigator();

const NavigationContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!user ? (
          // Pila pública de inicio de sesión y registro
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Registro de Cuenta' }}
            />
          </>
        ) : user.roleId === 2 ? (
          // Pila exclusiva de Productor (RF-PRO-01 al RF-PRO-11)
          <>
            <Stack.Screen
              name="ProducerDashboard"
              component={ProducerDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MyProducts"
              component={MyProductsScreen}
              options={{ title: 'Gestión de Productos' }}
            />
            <Stack.Screen
              name="ProductForm"
              component={ProductFormScreen}
              options={{ title: 'Publicar / Editar' }}
            />
            <Stack.Screen
              name="ProducerOrders"
              component={ProducerOrdersScreen}
              options={{ title: 'Atención de Pedidos' }}
            />
            <Stack.Screen
              name="DeliveryOptions"
              component={DeliveryOptionsScreen}
              options={{ title: 'Opciones de Entrega' }}
            />
          </>
        ) : (
          // Pila exclusiva de Consumidor (RF-CON-01 al RF-CON-09)
          <>
            <Stack.Screen
              name="ConsumerCatalog"
              component={ConsumerCatalogScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: 'Detalle de Producto' }}
            />
            <Stack.Screen
              name="PriceComparison"
              component={PriceComparisonScreen}
              options={{ title: 'Comparador de Precios' }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'Carrito de Compras' }}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{ title: 'Mis Pedidos y Seguimiento' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContent />
    </AuthProvider>
  );
}
