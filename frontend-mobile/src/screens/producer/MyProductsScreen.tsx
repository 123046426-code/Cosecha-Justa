import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import api from '../../services/api';

export const MyProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    try {
      // Obtenemos los productos del productor autenticado
      const res = await api.get('/products');
      setProductos(res.data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      cargarProductos();
    });
    return unsub;
  }, [navigation]);

  const toggleEstado = async (id: number, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'publicado' ? 'pausado' : 'publicado';
    try {
      await api.patch(`/products/${id}/status?nuevo_estado=${nuevoEstado}`);
      cargarProductos();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Mis Productos</Text>
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Text style={styles.btnAddText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id_producto.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.foto_url ? (
                <Image source={{ uri: item.foto_url }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.noImage]}>
                  <Text style={{ fontSize: 30 }}>🥦</Text>
                </View>
              )}
              <View style={styles.info}>
                <View style={styles.rowBetween}>
                  <Text style={styles.name}>{item.nombre}</Text>
                  <View
                    style={[
                      styles.badge,
                      item.estado === 'publicado' ? styles.badgeSuccess : styles.badgeWarn,
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.estado.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.category}>{item.nombre_categoria || 'Categoría'}</Text>
                <Text style={styles.price}>
                  ${item.precio} / {item.abreviatura_unidad || 'ud.'}
                </Text>
                <Text style={styles.stock}>Existencia: {item.cantidad_disponible} disponibles</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.btnAction}
                    onPress={() => toggleEstado(item.id_producto, item.estado)}
                  >
                    <Text style={styles.btnActionText}>
                      {item.estado === 'publicado' ? '⏸️ Pausar' : '▶️ Publicar'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnAction, styles.btnEdit]}
                    onPress={() => navigation.navigate('ProductForm', { producto: item })}
                  >
                    <Text style={[styles.btnActionText, { color: '#1565c0' }]}>✏️ Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  btnAdd: { backgroundColor: '#2e7d32', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnAddText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  image: { width: 100, height: 130 },
  noImage: { backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', flex: 1 },
  category: { fontSize: 12, color: '#64748b', marginTop: 2 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginTop: 4 },
  stock: { fontSize: 12, color: '#475569' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeSuccess: { backgroundColor: '#dcfce7' },
  badgeWarn: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#166534' },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnAction: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnEdit: { backgroundColor: '#e0f2fe' },
  btnActionText: { fontSize: 12, fontWeight: '600', color: '#334155' },
});
