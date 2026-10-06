// ==========================================
// PiuraRuta - Pantalla de Rutas y Editor (app/(tabs)/rutas.tsx)
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
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../lib/store';
import RutaEditor from '../../components/RutaEditor';
import { C } from '../../lib/theme';

export default function RutasScreen() {
  const { rutaActiva, setRutaActiva, rutasGuardadas, eliminarRutaGuardada } = useApp();
  const [tab, setTab] = useState<'activa' | 'guardadas'>('activa');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Itinerario & Rutas</Text>
          <Text style={styles.headerSub}>Edita tus paradas, horarios y exporta tu viaje</Text>
        </View>
      </View>

      {/* Selector de Pestaña: Ruta Activa vs Historial Guardado */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'activa' && styles.tabBtnActive]}
          onPress={() => setTab('activa')}
        >
          <Text style={[styles.tabBtnText, tab === 'activa' && styles.tabBtnTextActive]}>
            Ruta Activa {rutaActiva ? '(1)' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'guardadas' && styles.tabBtnActive]}
          onPress={() => setTab('guardadas')}
        >
          <Text
            style={[styles.tabBtnText, tab === 'guardadas' && styles.tabBtnTextActive]}
          >
            Guardadas ({rutasGuardadas.length})
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'activa' ? (
        <RutaEditor onVerEnMapa={() => router.push('/(tabs)/mapa')} />
      ) : (
        <ScrollView contentContainerStyle={styles.savedScroll}>
          {rutasGuardadas.length === 0 ? (
            <View style={styles.emptySaved}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>📂</Text>
              <Text style={styles.emptySavedTitle}>No tienes rutas guardadas</Text>
              <Text style={styles.emptySavedSub}>
                Cuando personalices una ruta en el editor, presiona "Guardar en Mis Rutas" para conservarla aquí.
              </Text>
            </View>
          ) : (
            rutasGuardadas.map((r) => (
              <View key={r.id} style={styles.savedCard}>
                <View style={styles.savedHeader}>
                  <Text style={styles.savedTitle}>{r.nombre}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Eliminar Ruta',
                        '¿Deseas quitar esta ruta de tu historial?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: () => eliminarRutaGuardada(r.id),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.savedInfo}>
                  {r.paradas.length} paradas • S/{r.costoEstimadoTotal} •{' '}
                  {Math.round(r.duracionTotalMinutos / 60)}h{' '}
                  {r.duracionTotalMinutos % 60}m
                </Text>

                <View style={styles.savedStopsPreview}>
                  {r.paradas.map((p) => (
                    <Text key={p.paso} style={styles.stopPill}>
                      {p.paso}. {p.business.name}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.loadRouteBtn}
                  onPress={() => {
                    setRutaActiva(r);
                    setTab('activa');
                  }}
                >
                  <Text style={styles.loadRouteBtnText}>Cargar en el Editor</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    ...C.shadowSm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  tabBtnTextActive: {
    color: C.primaryDark,
    fontWeight: '800',
  },
  savedScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  emptySaved: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySavedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
  },
  emptySavedSub: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  savedCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
    ...C.shadowSm,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.textPrimary,
    flex: 1,
  },
  deleteText: {
    fontSize: 16,
    color: C.textMuted,
    padding: 4,
  },
  savedInfo: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  savedStopsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  stopPill: {
    fontSize: 11,
    backgroundColor: C.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: C.secondary,
  },
  loadRouteBtn: {
    backgroundColor: C.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadRouteBtnText: {
    color: C.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
