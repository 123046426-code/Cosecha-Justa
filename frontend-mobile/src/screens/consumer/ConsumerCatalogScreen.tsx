import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ConsumerCatalogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { logout } = useAuth();
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [sectorFiltro, setSectorFiltro] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarCatalogo = async () => {
    try {
      let url = '/products?';
      if (busqueda.trim()) url += `search=${encodeURIComponent(busqueda.trim())}&`;
      if (sectorFiltro) url += `sector=${sectorFiltro}&`;

      const res = await api.get(url);
      setProductos(res.data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, [busqueda, sectorFiltro]);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.title}>Cosecha Justa 🌿</Text>
          <Text style={styles.subtitle}>Directo de manos locales a tu mesa</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnLogoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar jitomate, manzana, queso..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <View style={styles.filterChips}>
        <TouchableOpacity
          style={[styles.chip, sectorFiltro === null && styles.chipActive]}
          onPress={() => setSectorFiltro(null)}
        >
          <Text style={[styles.chipText, sectorFiltro === null && styles.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, sectorFiltro === 'agricola' && styles.chipActive]}
          onPress={() => setSectorFiltro('agricola')}
        >
          <Text style={[styles.chipText, sectorFiltro === 'agricola' && styles.chipTextActive]}>
            🌾 Agrícola
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, sectorFiltro === 'ganadero' && styles.chipActive]}
          onPress={() => setSectorFiltro('ganadero')}
        >
          <Text style={[styles.chipText, sectorFiltro === 'ganadero' && styles.chipTextActive]}>
            🐄 Ganadero
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, { backgroundColor: '#e0f2fe' }]}
          onPress={() => navigation.navigate('PriceComparison')}
        >
          <Text style={[styles.chipText, { color: '#0369a1', fontWeight: 'bold' }]}>⚖️ Comparar</Text>
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
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { producto: item })}
            >
              {item.foto_url ? (
                <Image source={{ uri: item.foto_url }} style={styles.prodImg} />
              ) : (
                <View style={[styles.prodImg, styles.noImg]}>
                  <Text style={{ fontSize: 28 }}>🍎</Text>
                </View>
              )}
              <View style={styles.prodDetails}>
                <Text style={styles.prodName}>{item.nombre}</Text>
                <Text style={styles.producerName}>👨‍🌾 {item.nombre_productor || 'Productor local'}</Text>
                <Text style={styles.categoryBadge}>{item.nombre_categoria}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.prodPrice}>
                    ${item.precio} <Text style={styles.prodUnit}>/ {item.abreviatura_unidad}</Text>
                  </Text>
                  <Text style={styles.prodStock}>Disponibles: {item.cantidad_disponible}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#c8e6c9', marginTop: 2 },
  btnLogout: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnLogoutText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  searchBar: { paddingHorizontal: 16, marginTop: 14 },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  filterChips: { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 12, gap: 8 },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  prodImg: { width: 110, height: 115 },
  noImg: { backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  prodDetails: { flex: 1, padding: 12, justifyContent: 'space-between' },
  prodName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  producerName: { fontSize: 12, color: '#2e7d32', fontWeight: '600', marginTop: 2 },
  categoryBadge: { fontSize: 11, color: '#64748b' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  prodPrice: { fontSize: 17, fontWeight: 'bold', color: '#2e7d32' },
  prodUnit: { fontSize: 12, color: '#64748b', fontWeight: 'normal' },
  prodStock: { fontSize: 11, color: '#94a3b8' },
});
