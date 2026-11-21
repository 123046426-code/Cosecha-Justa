import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export const ProductDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { producto } = route.params;
  const [cantidad, setCantidad] = useState(1);

  const agregarAlCarrito = () => {
    Alert.alert(
      '¡Producto agregado!',
      `Se agregaron ${cantidad} ${producto.abreviatura_unidad || 'unidades'} de ${producto.nombre} a tu pedido.`,
      [
        { text: 'Seguir comprando', onPress: () => navigation.goBack() },
        { text: 'Ver Carrito 🛒', onPress: () => navigation.navigate('Cart', { nuevoItem: { producto, cantidad } }) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {producto.foto_url ? (
        <Image source={{ uri: producto.foto_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImg]}>
          <Text style={{ fontSize: 60 }}>🌱</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.category}>{producto.nombre_categoria?.toUpperCase()}</Text>
        <Text style={styles.title}>{producto.nombre}</Text>
        <Text style={styles.producer}>Vendido por: {producto.nombre_productor || 'Don Pedro Huerta'}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${producto.precio}</Text>
          <Text style={styles.unit}>por {producto.abreviatura_unidad || 'kg'}</Text>
        </View>

        <Text style={styles.sectionHeader}>Descripción</Text>
        <Text style={styles.desc}>
          {producto.descripcion || 'Producto 100% fresco, cultivado de manera sustentable en la región de Querétaro.'}
        </Text>

        <Text style={styles.sectionHeader}>Existencia en Almacén</Text>
        <Text style={styles.stock}>{producto.cantidad_disponible} disponibles</Text>

        <View style={styles.qtyContainer}>
          <Text style={styles.qtyLabel}>Cantidad a comprar:</Text>
          <View style={styles.counter}>
            <TouchableOpacity
              style={styles.btnCount}
              onPress={() => setCantidad(Math.max(1, cantidad - 1))}
            >
              <Text style={styles.btnCountText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{cantidad}</Text>
            <TouchableOpacity
              style={styles.btnCount}
              onPress={() => setCantidad(Math.min(Number(producto.cantidad_disponible), cantidad + 1))}
            >
              <Text style={styles.btnCountText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btnAdd} onPress={agregarAlCarrito}>
          <Text style={styles.btnAddText}>
            Agregar al Carrito • ${(Number(producto.precio) * cantidad).toFixed(2)} MXN
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 260 },
  noImg: { backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  category: { fontSize: 12, fontWeight: 'bold', color: '#16a34a' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginVertical: 4 },
  producer: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 18 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginRight: 6 },
  unit: { fontSize: 15, color: '#64748b' },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#334155', marginTop: 12 },
  desc: { fontSize: 14, color: '#475569', lineHeight: 20, marginTop: 4 },
  stock: { fontSize: 13, color: '#64748b', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  qtyLabel: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnCount: { backgroundColor: '#e2e8f0', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  btnCountText: { fontSize: 20, fontWeight: 'bold', color: '#334155' },
  countText: { fontSize: 18, fontWeight: 'bold', minWidth: 24, textAlign: 'center' },
  btnAdd: { backgroundColor: '#2e7d32', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnAddText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
