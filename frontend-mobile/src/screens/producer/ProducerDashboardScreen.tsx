import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ProducerDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/producers/me/statistics');
      setStats(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>¡Hola, {user?.name.split(' ')[0]}! 👨‍🌾</Text>
          <Text style={styles.subwelcome}>Panel de Productor Local</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnLogoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.content}>
          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, { backgroundColor: '#e8f5e9' }]}>
              <Text style={styles.kpiValue}>${stats?.total_ventas_monto || '0.00'}</Text>
              <Text style={styles.kpiLabel}>Ventas Totales</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#fff3e0' }]}>
              <Text style={[styles.kpiValue, { color: '#e65100' }]}>
                {stats?.pedidos_pendientes || 0}
              </Text>
              <Text style={styles.kpiLabel}>Pedidos Pendientes</Text>
            </View>
          </View>

          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, { backgroundColor: '#e3f2fd' }]}>
              <Text style={[styles.kpiValue, { color: '#1565c0' }]}>{stats?.total_pedidos || 0}</Text>
              <Text style={styles.kpiLabel}>Total Órdenes</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: '#f1f8e9' }]}>
              <Text style={[styles.kpiValue, { color: '#33691e' }]}>
                {stats?.pedidos_completados || 0}
              </Text>
              <Text style={styles.kpiLabel}>Entregados</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('MyProducts')}
            >
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionText}>Mis Productos y Precios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ProducerOrders')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>Atender Pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('DeliveryOptions')}
            >
              <Text style={styles.actionIcon}>🚚</Text>
              <Text style={styles.actionText}>Opciones de Entrega</Text>
            </TouchableOpacity>
          </View>

          {stats?.productos_mas_vendidos?.length > 0 && (
            <View style={styles.topProducts}>
              <Text style={styles.sectionTitle}>Productos Más Solicitados</Text>
              {stats.productos_mas_vendidos.map((p: any, idx: number) => (
                <View key={idx} style={styles.topItem}>
                  <Text style={styles.topItemName}>{p.producto}</Text>
                  <Text style={styles.topItemQty}>{p.cantidad_vendida} unid.</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subwelcome: { fontSize: 13, color: '#c8e6c9', marginTop: 2 },
  btnLogout: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnLogoutText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  content: { padding: 18 },
  kpiGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  kpiCard: {
    flex: 0.48,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  kpiValue: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32' },
  kpiLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginVertical: 14 },
  actions: { gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIcon: { fontSize: 24, marginRight: 14 },
  actionText: { fontSize: 15, fontWeight: '600', color: '#334155' },
  topProducts: { marginTop: 14 },
  topItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  topItemName: { fontSize: 14, color: '#333', fontWeight: '500' },
  topItemQty: { fontSize: 14, fontWeight: 'bold', color: '#2e7d32' },
});
