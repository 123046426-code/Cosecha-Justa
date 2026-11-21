import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

export const ProductFormScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const prodEdit = route.params?.producto;
  const isEditing = !!prodEdit;

  const [nombre, setNombre] = useState(prodEdit?.nombre || '');
  const [descripcion, setDescripcion] = useState(prodEdit?.descripcion || '');
  const [precio, setPrecio] = useState(prodEdit ? prodEdit.precio.toString() : '');
  const [cantidad, setCantidad] = useState(prodEdit ? prodEdit.cantidad_disponible.toString() : '');
  const [fotoUrl, setFotoUrl] = useState(prodEdit?.foto_url || '');
  const [categoriaId, setCategoriaId] = useState<number>(prodEdit?.id_categoria || 1);
  const [unidadId, setUnidadId] = useState<number>(prodEdit?.id_unidad || 1);
  const [cargando, setCargando] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim() || !precio || !cantidad) {
      Alert.alert('Campos requeridos', 'Ingresa nombre, precio y cantidad disponible.');
      return;
    }

    try {
      setCargando(true);
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: parseFloat(precio),
        cantidad_disponible: parseFloat(cantidad),
        foto_url: fotoUrl.trim() || null,
        id_categoria: categoriaId,
        id_unidad: unidadId,
      };

      if (isEditing) {
        await api.put(`/products/${prodEdit.id_producto}`, payload);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        await api.post('/products', payload);
        Alert.alert('Éxito', 'Producto registrado exitosamente');
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Editar Producto' : 'Registrar Nuevo Producto'}
      </Text>

      <Text style={styles.label}>Nombre del Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Jitomate Saladette"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 70 }]}
        placeholder="Cultivado de forma sustentable..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Precio ($ MXN)</Text>
          <TextInput
            style={styles.input}
            placeholder="35.00"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Cantidad Disponible</Text>
          <TextInput
            style={styles.input}
            placeholder="50"
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <Text style={styles.label}>URL de Fotografía</Text>
      <TextInput
        style={styles.input}
        placeholder="https://ejemplo.com/foto.jpg"
        value={fotoUrl}
        onChangeText={setFotoUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.btnSave, cargando && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSaveText}>{isEditing ? 'Guardar Cambios' : 'Publicar Producto'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnSave: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
