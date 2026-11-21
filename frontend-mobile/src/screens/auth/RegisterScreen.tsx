import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [rolId, setRolId] = useState<number>(3); // 2: Productor, 3: Consumidor
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim() || !apellidos.trim() || !correo.trim() || !contrasena) {
      Alert.alert('Campos obligatorios', 'Por favor completa todos los campos.');
      return;
    }

    try {
      setCargando(true);
      await api.post('/auth/register', {
        id_rol: rolId,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim() || null,
        contrasena,
      });

      Alert.alert('¡Cuenta creada!', 'Iniciando sesión automáticamente...');
      await login(correo.trim().toLowerCase(), contrasena);
    } catch (error: any) {
      Alert.alert('Error en registro', error.message || 'No se pudo completar el registro');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Crear Nueva Cuenta</Text>
      <Text style={styles.subtitle}>Selecciona tu perfil en Cosecha Justa</Text>

      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleBtn, rolId === 3 && styles.roleBtnActive]}
          onPress={() => setRolId(3)}
        >
          <Text style={[styles.roleText, rolId === 3 && styles.roleTextActive]}>
            🛒 Consumidor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, rolId === 2 && styles.roleBtnActive]}
          onPress={() => setRolId(2)}
        >
          <Text style={[styles.roleText, rolId === 2 && styles.roleTextActive]}>
            👨‍🌾 Productor
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre(s)</Text>
        <TextInput
          style={styles.input}
          placeholder="Juan Carlos"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          placeholder="Hernández Flores"
          value={apellidos}
          onChangeText={setApellidos}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu_correo@ejemplo.com"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="4421234567"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btnPrimary, cargando && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Registrarme</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 24, backgroundColor: '#f4f6f8' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1b5e20', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  roleSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  roleBtn: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  roleBtnActive: { borderColor: '#2e7d32', backgroundColor: '#e8f5e9' },
  roleText: { fontSize: 15, fontWeight: '600', color: '#666' },
  roleTextActive: { color: '#2e7d32', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 5 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 14,
  },
  btnPrimary: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { marginTop: 20, alignItems: 'center', marginBottom: 30 },
  loginText: { fontSize: 14, color: '#666' },
  loginTextBold: { color: '#2e7d32', fontWeight: 'bold' },
});
