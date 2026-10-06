// ==========================================
// PiuraRuta - Módulo de Autenticación (Google OAuth & Demo)
// ==========================================

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export interface UsuarioSesion {
  id: string;
  nombre: string;
  email?: string;
  foto?: string;
  esInvitado: boolean;
  proveedor: 'google' | 'demo' | 'invitado';
}

const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '';
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '';
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '';

export const hasGoogleCredentials = (): boolean => {
  if (Platform.OS === 'android') return Boolean(ANDROID_CLIENT_ID);
  if (Platform.OS === 'ios') return Boolean(IOS_CLIENT_ID);
  return Boolean(WEB_CLIENT_ID);
};

export const createDemoUser = (): UsuarioSesion => ({
  id: 'usr-demo-001',
  nombre: 'Carlos Mendoza',
  email: 'carlos.mendoza@piuraruta.pe',
  foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  esInvitado: false,
  proveedor: 'demo',
});

export const createGuestUser = (): UsuarioSesion => ({
  id: `usr-guest-${Date.now()}`,
  nombre: 'Turista Invitado',
  esInvitado: true,
  proveedor: 'invitado',
});

/**
 * Hook para manejar autenticación con Google
 */
export function useGoogleAuth(onLoginSuccess?: (user: UsuarioSesion) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID || undefined,
    iosClientId: IOS_CLIENT_ID || undefined,
    webClientId: WEB_CLIENT_ID || undefined,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setLoading(true);
        fetchGoogleUserInfo(authentication.accessToken)
          .then((user) => {
            if (user && onLoginSuccess) {
              onLoginSuccess(user);
            }
          })
          .catch((err) => {
            console.error('Error al obtener usuario de Google:', err);
            setError('No se pudo obtener información del perfil de Google.');
          })
          .finally(() => setLoading(false));
      }
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Error durante la autenticación con Google');
    }
  }, [response]);

  const iniciarSesionGoogle = async () => {
    setError(null);
    if (!hasGoogleCredentials()) {
      // Si no están configuradas las credenciales de Google, entrar como Demo
      const demo = createDemoUser();
      onLoginSuccess?.(demo);
      return demo;
    }

    try {
      setLoading(true);
      await promptAsync();
    } catch (err: any) {
      console.warn('Google promptAsync error, usando fallback demo:', err);
      const demo = createDemoUser();
      onLoginSuccess?.(demo);
      return demo;
    } finally {
      setLoading(false);
    }
  };

  return {
    iniciarSesionGoogle,
    loading,
    error,
    isReady: Boolean(request),
    hasCredentials: hasGoogleCredentials(),
  };
}

async function fetchGoogleUserInfo(accessToken: string): Promise<UsuarioSesion | null> {
  try {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Respuesta inválida de Google API');
    const data = await res.json();
    return {
      id: data.id || `google-${Date.now()}`,
      nombre: data.name || data.given_name || 'Usuario Google',
      email: data.email,
      foto: data.picture,
      esInvitado: false,
      proveedor: 'google',
    };
  } catch (err) {
    console.error('fetchGoogleUserInfo error:', err);
    return null;
  }
}
