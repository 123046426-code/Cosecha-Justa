import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../../services/api';

export const OrderHistoryScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarHistorial = async () => {
    try {
      const res = await api.get('/orders/history/me');
      setPedidos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const calificarPedido = async (idPedido: number) => {
    try {
      await api.post(`/orders/${idPedido}/reviews`, {
        id_pedido: idPedido,
        puntuacion: 5,
        comentario: 'Excelente producto, fresco y de calidad. ¡Muy recomendado!',
      });
      Alert.alert('¡Gracias!', 'Tu reseña de 5 estrellas ha sido registrada.');
      cargarHistorial();
    } catch (e: any) {
      Alert.alert('Aviso', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Compras y Seguimiento 📦</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id_pedido.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Aún no has realizado ninguna compra.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.folio}>Pedido #{item.id_pedido}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.nombre_estado?.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.producer}>👨‍🌾 Productor: {item.nombre_negocio_productor || 'Don Pedro Huerta'}</Text>
              <Text style={styles.total}>Total: ${item.total} MXN</Text>
              <Text style={styles.date}>Fecha: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>

              {item.id_estado === 5 && (
                <TouchableOpacity
                  style={styles.btnCalificar}
                  onPress={() => calificarPedido(item.id_pedido)}
                >
                  <Text style={styles.btnCalificarText}>⭐ Calificar Compra (5 estrellas)</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', padding: 16, color: '#1e293b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  folio: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  badge: { backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#334155' },
  producer: { fontSize: 14, color: '#2e7d32', fontWeight: '500', marginTop: 6 },
  total: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  date: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  btnCalificar: {
    backgroundColor: '#fef3c7',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  btnCalificarText: { color: '#b45309', fontWeight: 'bold', fontSize: 13 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
});
