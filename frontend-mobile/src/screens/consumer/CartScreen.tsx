import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

export const CartScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  // Inicialmente contiene el item de ejemplo o el que se añadió
  const nuevo = route.params?.nuevoItem;
  const [items, setItems] = useState<any[]>([
    nuevo || {
      producto: {
        id_producto: 1,
        id_productor: 1,
        nombre: 'Jitomate Saladette Orgánico',
        precio: 28.50,
        abreviatura_unidad: 'kg',
      },
      cantidad: 2,
    },
  ]);
  const [cargando, setCargando] = useState(false);
  const costoEnvio = 35.00;

  const subtotal = items.reduce(
    (acc, it) => acc + Number(it.producto.precio) * it.cantidad,
    0
  );
  const total = subtotal + costoEnvio;

  const confirmarPedido = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de confirmar.');
      return;
    }

    try {
      setCargando(true);
      const producerId = items[0].producto.id_productor;
      const orderItems = items.map((it) => ({
        id_producto: it.producto.id_producto,
        cantidad: it.cantidad,
      }));

      await api.post('/orders', {
        id_productor: producerId,
        id_opcion: 1, // Entrega a domicilio
        direccion_entrega: 'Av. de la Luz 450, Col. Satélite, Querétaro',
        items: orderItems,
      });

      Alert.alert(
        '¡Pedido generado con éxito! 🎉',
        'El productor ha recibido tu orden y te notificará cuando sea aceptada.',
        [{ text: 'Ver mis pedidos', onPress: () => navigation.navigate('OrderHistory') }]
      );
      setItems([]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Carrito de Compras 🛒</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.producto.id_producto.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Tu carrito está vacío.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.producto.nombre}</Text>
              <Text style={styles.itemSub}>
                ${item.producto.precio} x {item.cantidad} {item.producto.abreviatura_unidad || 'ud.'}
              </Text>
            </View>
            <Text style={styles.itemTotal}>
              ${(Number(item.producto.precio) * item.cantidad).toFixed(2)}
            </Text>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal productos:</Text>
            <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Costo de envío estimado:</Text>
            <Text style={styles.summaryVal}>${costoEnvio.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total a pagar:</Text>
            <Text style={styles.totalVal}>${total.toFixed(2)} MXN</Text>
          </View>

          <TouchableOpacity
            style={[styles.btnConfirm, cargando && { opacity: 0.6 }]}
            onPress={confirmarPedido}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnConfirmText}>Confirmar y Enviar Pedido</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', padding: 16, color: '#1e293b' },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  itemSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  itemTotal: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 6,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryVal: { fontSize: 14, fontWeight: '600', color: '#334155' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  totalVal: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  btnConfirm: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  btnConfirmText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
});
