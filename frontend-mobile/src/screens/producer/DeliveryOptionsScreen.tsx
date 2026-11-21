import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import api from '../../services/api';

export const DeliveryOptionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [opciones, setOpciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados locales para cada opción
  const [domicilioActivo, setDomicilioActivo] = useState(true);
  const [costoDomicilio, setCostoDomicilio] = useState('35.00');

  const [fincaActivo, setFincaActivo] = useState(true);
  const [costoFinca, setCostoFinca] = useState('0.00');

  const [puntoEncuentroActivo, setPuntoEncuentroActivo] = useState(false);
  const [costoPuntoEncuentro, setCostoPuntoEncuentro] = useState('15.00');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/catalogs/delivery-options');
        setOpciones(res.data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      const opcionesSeleccionadas = [];

      if (domicilioActivo) {
        opcionesSeleccionadas.push({
          id_opcion: 1,
          costo_envio: parseFloat(costoDomicilio) || 0,
        });
      }
      if (fincaActivo) {
        opcionesSeleccionadas.push({
          id_opcion: 2,
          costo_envio: parseFloat(costoFinca) || 0,
        });
      }
      if (puntoEncuentroActivo) {
        opcionesSeleccionadas.push({
          id_opcion: 3,
          costo_envio: parseFloat(costoPuntoEncuentro) || 0,
        });
      }

      await api.put('/producers/me/delivery-options', opcionesSeleccionadas);
      Alert.alert('Éxito', 'Opciones de entrega actualizadas correctamente.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Opciones de Entrega (RF-PRO-11)</Text>
      <Text style={styles.subtitle}>
        Define cómo pueden recibir tus productos los consumidores y establece las tarifas de flete o recolección.
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.form}>
          {/* Opción 1: Entrega a domicilio */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>🚚 Entrega a Domicilio</Text>
                <Text style={styles.cardDesc}>Llevas el pedido a la dirección del consumidor</Text>
              </View>
              <Switch
                value={domicilioActivo}
                onValueChange={setDomicilioActivo}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={domicilioActivo ? '#16a34a' : '#f8fafc'}
              />
            </View>
            {domicilioActivo && (
              <View style={styles.costContainer}>
                <Text style={styles.costLabel}>Costo de Envío ($ MXN):</Text>
                <TextInput
                  style={styles.costInput}
                  value={costoDomicilio}
                  onChangeText={setCostoDomicilio}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>

          {/* Opción 2: Recolección en finca */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>🏡 Recolección en Finca / Huerto</Text>
                <Text style={styles.cardDesc}>El consumidor acude directamente a recoger</Text>
              </View>
              <Switch
                value={fincaActivo}
                onValueChange={setFincaActivo}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={fincaActivo ? '#16a34a' : '#f8fafc'}
              />
            </View>
            {fincaActivo && (
              <View style={styles.costContainer}>
                <Text style={styles.costLabel}>Costo de Entrega ($ MXN):</Text>
                <TextInput
                  style={styles.costInput}
                  value={costoFinca}
                  onChangeText={setCostoFinca}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>

          {/* Opción 3: Punto medio de encuentro */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>📍 Punto Medio de Encuentro</Text>
                <Text style={styles.cardDesc}>Acuerdo mutuo en plaza o mercado local</Text>
              </View>
              <Switch
                value={puntoEncuentroActivo}
                onValueChange={setPuntoEncuentroActivo}
                trackColor={{ false: '#cbd5e1', true: '#86efac' }}
                thumbColor={puntoEncuentroActivo ? '#16a34a' : '#f8fafc'}
              />
            </View>
            {puntoEncuentroActivo && (
              <View style={styles.costContainer}>
                <Text style={styles.costLabel}>Costo de Traslado ($ MXN):</Text>
                <TextInput
                  style={styles.costInput}
                  value={costoPuntoEncuentro}
                  onChangeText={setCostoPuntoEncuentro}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.btnSave, guardando && { opacity: 0.6 }]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnSaveText}>Guardar Opciones de Entrega</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 18 },
  form: { gap: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  cardDesc: { fontSize: 12, color: '#64748b', marginTop: 2, maxWidth: 220 },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  costLabel: { fontSize: 13, fontWeight: '600', color: '#334155' },
  costInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 90,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnSave: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
