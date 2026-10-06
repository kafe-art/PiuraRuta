// ==========================================
// PiuraRuta - Pantalla de Inicio y Asistente (app/(tabs)/index.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../lib/store';
import { useGoogleAuth, createDemoUser, createGuestUser } from '../../lib/auth';
import ChatRuta from '../../components/ChatRuta';
import { C } from '../../lib/theme';

export default function HomeScreen() {
  const { usuario, setUsuario, rutaActiva } = useApp();

  const { iniciarSesionGoogle, hasCredentials, loading: authLoading } = useGoogleAuth(
    (u) => setUsuario(u)
  );

  const handleLoginGoogle = async () => {
    try {
      const user = await iniciarSesionGoogle();
      if (user) {
        setUsuario(user);
        if (!hasCredentials) {
          Alert.alert(
            'Modo Demo Activado',
            'Como aún no se han configurado los Client IDs en .env, has iniciado como "Usuario demo" para explorar todas las funciones.'
          );
        }
      }
    } catch (err) {
      console.error('Error login:', err);
    }
  };

  const handleLoginGuest = () => {
    const guest = createGuestUser();
    setUsuario(guest);
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Barra Superior / Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>🌴 PiuraRuta</Text>
          {usuario ? (
            <Text style={styles.userSubtitle}>
              Hola, <Text style={{ fontWeight: '700' }}>{usuario.nombre}</Text> •{' '}
              {usuario.esInvitado ? 'Modo Invitado' : 'Turista'}
            </Text>
          ) : (
            <Text style={styles.userSubtitle}>Descubre los mejores sabores a pie</Text>
          )}
        </View>

        {usuario ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Salir</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authActionRow}>
            <TouchableOpacity
              style={styles.loginGoogleBtn}
              onPress={handleLoginGoogle}
              disabled={authLoading}
            >
              <Text style={styles.loginGoogleBtnText}>
                {authLoading ? '...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestSmallBtn} onPress={handleLoginGuest}>
              <Text style={styles.guestSmallBtnText}>Invitado</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner de Bienvenida si no ha iniciado sesión */}
        {!usuario && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerTitle}>¡Bienvenido a PiuraRuta!</Text>
            <Text style={styles.guestBannerDesc}>
              Explora puestos artesanales, cevicherías tradicionales y puntos seguros en Piura.
              Inicia sesión con Google o prueba en modo demo.
            </Text>
          </View>
        )}

        {/* Tarjeta de Ruta Activa si existe */}
        {rutaActiva && (
          <View style={styles.activeRouteCard}>
            <View style={styles.activeRouteHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeRouteTag}>TU RUTA EN CURSO</Text>
                <Text style={styles.activeRouteName}>{rutaActiva.nombre}</Text>
                <Text style={styles.activeRouteInfo}>
                  {rutaActiva.paradas.length} paradas • S/{rutaActiva.costoEstimadoTotal} •{' '}
                  {Math.round(rutaActiva.duracionTotalMinutos / 60)}h{' '}
                  {rutaActiva.duracionTotalMinutos % 60}m
                </Text>
              </View>

              <TouchableOpacity
                style={styles.activeRouteBtn}
                onPress={() => router.push('/(tabs)/rutas')}
              >
                <Text style={styles.activeRouteBtnText}>Ver / Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sección: Asistente Chat-Cuestionario */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Asistente de Rutas Inteligente</Text>
          <Text style={styles.sectionBadge}>4 Pasos</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Responde 4 preguntas y calcularemos un itinerario a tu medida ordenado por cercanía.
        </Text>

        <View style={styles.chatCardWrapper}>
          <ChatRuta
            onVerRutaCompleta={() => {
              router.push('/(tabs)/rutas');
            }}
          />
        </View>

        {/* Acceso Rápido al Mapa */}
        <View style={styles.quickCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickTitle}>Explorar el Mapa Completo</Text>
            <Text style={styles.quickSub}>
              Busca puestos por nombre o producto, y revisa los puntos seguros con 🛡️.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => router.push('/(tabs)/mapa')}
          >
            <Text style={styles.quickBtnText}>Abrir Mapa 🗺️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    ...C.shadowSm,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.primaryDark,
  },
  userSubtitle: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: C.dangerBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: C.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  authActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loginGoogleBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  loginGoogleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  guestSmallBtn: {
    backgroundColor: C.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
  },
  guestSmallBtnText: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  guestBanner: {
    backgroundColor: C.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  guestBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.primaryDark,
  },
  guestBannerDesc: {
    fontSize: 13,
    color: C.secondary,
    marginTop: 4,
    lineHeight: 18,
  },
  activeRouteCard: {
    backgroundColor: C.secondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    ...C.shadowMd,
  },
  activeRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeRouteTag: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeRouteName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  activeRouteInfo: {
    color: '#CBD5E0',
    fontSize: 12,
    marginTop: 2,
  },
  activeRouteBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.textPrimary,
  },
  sectionBadge: {
    backgroundColor: C.primaryLight,
    color: C.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  chatCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.borderLight,
    minHeight: 380,
    marginBottom: 18,
    ...C.shadowSm,
  },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
    ...C.shadowSm,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  quickSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  quickBtn: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickBtnText: {
    color: C.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
