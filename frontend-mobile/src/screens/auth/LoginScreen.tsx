import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('productor@cosechajusta.upq.edu.mx');
  const [contrasena, setContrasena] = useState('Productor1234*');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !contrasena) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setCargando(true);
      await login(correo.trim(), contrasena);
    } catch (error: any) {
      Alert.alert('Error de acceso', error.message || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  const setTestAccount = (tipo: 'productor' | 'consumidor') => {
    if (tipo === 'productor') {
      setCorreo('productor@cosechajusta.upq.edu.mx');
      setContrasena('Productor1234*');
    } else {
      setCorreo('consumidor@cosechajusta.upq.edu.mx');
      setContrasena('Consumidor1234*');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🌾</Text>
          <Text style={styles.title}>Cosecha Justa</Text>
          <Text style={styles.subtitle}>Comercio directo entre productores y consumidores</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@cosechajusta.upq.edu.mx"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btnPrimary, cargando && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.quickAccess}>
            <Text style={styles.quickTitle}>Accesos de prueba rápidos:</Text>
            <View style={styles.quickButtons}>
              <TouchableOpacity
                style={styles.btnQuick}
                onPress={() => setTestAccount('productor')}
              >
                <Text style={styles.btnQuickText}>👨‍🌾 Productor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnQuick}
                onPress={() => setTestAccount('consumidor')}
              >
                <Text style={styles.btnQuickText}>🛒 Consumidor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scroll: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 28 },
  logoIcon: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1b5e20' },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
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
  quickAccess: { marginTop: 22, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  quickTitle: { fontSize: 12, color: '#777', textAlign: 'center', marginBottom: 10 },
  quickButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btnQuick: {
    flex: 0.48,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnQuickText: { color: '#2e7d32', fontWeight: '600', fontSize: 13 },
  registerLink: { marginTop: 24, alignItems: 'center' },
  registerText: { fontSize: 14, color: '#666' },
  registerTextBold: { color: '#2e7d32', fontWeight: 'bold' },
});
