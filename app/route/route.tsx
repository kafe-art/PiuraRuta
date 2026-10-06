// ==========================================
// PiuraRuta - Pantalla de Ruta Dedicada (app/route/route.tsx)
// ==========================================

import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import RutaEditor from '../../components/RutaEditor';
import { C } from '../../lib/theme';

export default function RouteScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Itinerario de Ruta</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Editor interactivo de ruta */}
      <RutaEditor onVerEnMapa={() => router.push('/(tabs)/mapa')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    ...C.shadowSm,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backBtnText: {
    fontSize: 14,
    color: C.primaryDark,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
  },
});
