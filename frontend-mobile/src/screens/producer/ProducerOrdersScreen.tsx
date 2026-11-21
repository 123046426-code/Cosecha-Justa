import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../../services/api';

export const ProducerOrdersScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    try {
      const res = await api.get('/orders/history/me');
      setPedidos(res.data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const actualizarEstado = async (idPedido: number, nuevoEstadoId: number) => {
    try {
      await api.patch(`/orders/${idPedido}/status`, { id_estado: nuevoEstadoId });
      Alert.alert('Estado Actualizado', 'El pedido avanzó en el flujo correctamente.');
      cargarPedidos();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return '#f59e0b';
      case 'aceptado':
        return '#3b82f6';
      case 'en preparación':
        return '#8b5cf6';
      case 'listo':
        return '#06b6d4';
      case 'entregado':
        return '#10b981';
      default:
        return '#ef4444';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Pedidos Recibidos</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id_pedido.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tienes pedidos registrados por el momento.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.folio}>Folio #{item.id_pedido}</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: getStatusColor(item.nombre_estado) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: getStatusColor(item.nombre_estado) },
                    ]}
                  >
                    {item.nombre_estado?.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.total}>Total: ${item.total} MXN</Text>
              <Text style={styles.date}>Fecha: {new Date(item.fecha_pedido).toLocaleDateString()}</Text>

              {item.id_estado === 1 && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnAccept]}
                    onPress={() => actualizarEstado(item.id_pedido, 2)}
                  >
                    <Text style={styles.btnText}>Aceptar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnReject]}
                    onPress={() => actualizarEstado(item.id_pedido, 6)}
                  >
                    <Text style={[styles.btnText, { color: '#dc2626' }]}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.id_estado === 2 && (
                <TouchableOpacity
                  style={[styles.btn, styles.btnNext]}
                  onPress={() => actualizarEstado(item.id_pedido, 3)}
                >
                  <Text style={styles.btnText}>Iniciar Preparación 👨‍🍳</Text>
                </TouchableOpacity>
              )}

              {item.id_estado === 3 && (
                <TouchableOpacity
                  style={[styles.btn, styles.btnNext]}
                  onPress={() => actualizarEstado(item.id_pedido, 4)}
                >
                  <Text style={styles.btnText}>Marcar como Listo 📦</Text>
                </TouchableOpacity>
              )}

              {item.id_estado === 4 && (
                <TouchableOpacity
                  style={[styles.btn, styles.btnSuccess]}
                  onPress={() => actualizarEstado(item.id_pedido, 5)}
                >
                  <Text style={styles.btnText}>Marcar como Entregado ✅</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  folio: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  total: { fontSize: 17, fontWeight: 'bold', color: '#2e7d32', marginTop: 8 },
  date: { fontSize: 12, color: '#64748b', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnAccept: { backgroundColor: '#2e7d32' },
  btnReject: { backgroundColor: '#fee2e2' },
  btnNext: { backgroundColor: '#3b82f6', marginTop: 12 },
  btnSuccess: { backgroundColor: '#10b981', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8' },
});
