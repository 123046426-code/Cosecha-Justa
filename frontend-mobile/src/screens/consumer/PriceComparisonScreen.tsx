import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../../services/api';

export const PriceComparisonScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/products');
        setProductos(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>⚖️ Comparador de Precios y Transparencia</Text>
      <Text style={styles.headerSubtitle}>
        Cumpliendo con RF-CON-04: Transparencia total de precios entre productores de la región.
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id_producto.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.left}>
                <Text style={styles.prodName}>{item.nombre}</Text>
                <Text style={styles.producer}>👨‍🌾 {item.nombre_productor || 'Productor local'}</Text>
                <Text style={styles.cat}>{item.nombre_categoria}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.price}>${item.precio}</Text>
                <Text style={styles.unit}>por {item.abreviatura_unidad}</Text>
                <TouchableOpacity
                  style={styles.btnVer}
                  onPress={() => navigation.navigate('ProductDetail', { producto: item })}
                >
                  <Text style={styles.btnVerText}>Ver</Text>
                </TouchableOpacity>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', paddingHorizontal: 16, paddingTop: 16 },
  headerSubtitle: { fontSize: 13, color: '#64748b', paddingHorizontal: 16, marginTop: 4, marginBottom: 10 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  left: { flex: 1 },
  prodName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  producer: { fontSize: 13, color: '#2e7d32', marginTop: 2 },
  cat: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  right: { alignItems: 'flex-end', marginLeft: 12 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  unit: { fontSize: 11, color: '#64748b' },
  btnVer: { backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginTop: 6 },
  btnVerText: { color: '#2e7d32', fontWeight: 'bold', fontSize: 12 },
});
