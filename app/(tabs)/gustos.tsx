// ==========================================
// PiuraRuta - Pantalla de Gustos y Preferencias (app/(tabs)/gustos.tsx)
// ==========================================

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../lib/store';
import { GUSTOS_CATALOGO, GustoItem } from '../../data/gustos';
import { C } from '../../lib/theme';

export default function GustosScreen() {
  const { gustos, toggleGusto } = useApp();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Mis Gustos & Antojos</Text>
          <Text style={styles.headerSub}>
            Selecciona lo que te apasiona para personalizar tus rutas.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{gustos.length} elegidos</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.infoBanner}>
          ✨ Tus preferencias se guardan automáticamente en tu dispositivo y guían a tu asistente al generar tus recorridos.
        </Text>

        {/* Cuadrícula de Gustos */}
        <View style={styles.gridContainer}>
          {GUSTOS_CATALOGO.map((item: GustoItem) => {
            const seleccionado = gustos.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.gustoCard,
                  seleccionado && styles.gustoCardActive,
                ]}
                activeOpacity={0.8}
                onPress={() => toggleGusto(item.id)}
              >
                {/* Checkmark en esquina */}
                <View
                  style={[
                    styles.checkBadge,
                    seleccionado ? styles.checkBadgeActive : styles.checkBadgeInactive,
                  ]}
                >
                  <Text style={styles.checkText}>
                    {seleccionado ? '✓' : '+'}
                  </Text>
                </View>

                {/* Si tiene foto (Ceviche o Artesanía), mostrar imagen */}
                {item.foto ? (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: item.foto }} style={styles.photo} />
                    <View style={styles.photoOverlay}>
                      <Text style={styles.photoName}>{item.nombre}</Text>
                      <Text style={styles.photoCategory}>{item.categoria}</Text>
                    </View>
                  </View>
                ) : (
                  /* Si no tiene foto, mostrar color de acento + emoji */
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.emojiCircle,
                        { backgroundColor: item.color + '22' },
                      ]}
                    >
                      <Text style={styles.emojiText}>{item.emoji}</Text>
                    </View>
                    <Text style={styles.gustoName}>{item.nombre}</Text>
                    <Text style={styles.gustoCategory}>{item.categoria}</Text>
                    <Text style={styles.gustoDesc} numberOfLines={2}>
                      {item.descripcion}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón de acción para crear ruta con estos gustos */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.actionBtnText}>
            🧭 Crear Ruta con mis Gustos Guardados
          </Text>
        </TouchableOpacity>
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
  countBadge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countBadgeText: {
    color: C.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoBanner: {
    fontSize: 12,
    color: C.textSecondary,
    backgroundColor: C.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
    marginBottom: 16,
    lineHeight: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gustoCard: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...C.shadowSm,
    position: 'relative',
    minHeight: 160,
  },
  gustoCardActive: {
    borderColor: C.primary,
    backgroundColor: '#FFFDF9',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...C.shadowSm,
  },
  checkBadgeActive: {
    backgroundColor: C.primary,
  },
  checkBadgeInactive: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: C.border,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  photoContainer: {
    width: '100%',
    height: 165,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 10,
  },
  photoName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  photoCategory: {
    color: '#E2E8F0',
    fontSize: 11,
    marginTop: 2,
  },
  cardContent: {
    padding: 14,
    alignItems: 'flex-start',
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emojiText: {
    fontSize: 22,
  },
  gustoName: {
    fontSize: 14,
    fontWeight: '800',
    color: C.textPrimary,
  },
  gustoCategory: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  gustoDesc: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 6,
    lineHeight: 15,
  },
  actionBtn: {
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...C.shadowMd,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
