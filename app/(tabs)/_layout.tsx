// ==========================================
// PiuraRuta - Navegación Principal por Pestañas (app/(tabs)/_layout.tsx)
// ==========================================

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { C } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primaryDark,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: C.borderLight,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...C.shadowMd,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {/* 1. Inicio / Asistente */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '🏠' : '🏡'}</Text>
          ),
        }}
      />

      {/* 2. Mapa Interactivo */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '🗺️' : '📍'}</Text>
          ),
        }}
      />

      {/* 3. BOTÓN CENTRAL "+" QUE ABRE /nuevo-negocio */}
      <Tabs.Screen
        name="nuevo"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.fabWrapper}
              onPress={() => router.push('/nuevo-negocio')}
            >
              <View style={styles.fabCircle}>
                <Text style={styles.fabPlusText}>+</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/nuevo-negocio');
          },
        }}
      />

      {/* 4. Mis Gustos */}
      <Tabs.Screen
        name="gustos"
        options={{
          title: 'Gustos',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '❤️' : '🤍'}</Text>
          ),
        }}
      />

      {/* 5. Mis Rutas / Editor */}
      <Tabs.Screen
        name="rutas"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 20, color }}>{focused ? '🧭' : '🧭'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
  },
  fabCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  fabPlusText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
    textAlign: 'center',
  },
});
