import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface UserSession {
  userId: number;
  roleId: number; // 1: Admin, 2: Productor, 3: Consumidor
  name: string;
  token: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<UserSession>;
  logout: () => Promise<void>;
  switchRolePreview?: (roleId: number) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@cosecha_justa_token');
        const storedUser = await AsyncStorage.getItem('@cosecha_justa_user');
        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error restaurando sesión:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (correo: string, contrasena: string): Promise<UserSession> => {
    const response = await api.post('/auth/login', { correo, contrasena });
    const data = response.data;

    const session: UserSession = {
      userId: data.user_id,
      roleId: data.role_id,
      name: data.name,
      token: data.access_token,
    };

    await AsyncStorage.setItem('@cosecha_justa_token', session.token);
    await AsyncStorage.setItem('@cosecha_justa_user', JSON.stringify(session));
    setUser(session);
    return session;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@cosecha_justa_token');
    await AsyncStorage.removeItem('@cosecha_justa_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
