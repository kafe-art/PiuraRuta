// ==========================================
// PiuraRuta - Enrutador Raíz y Proveedor Global (app/_layout.tsx)
// ==========================================

import React from 'react';
import { Stack } from 'expo-router';
import { StoreProvider } from '../lib/store';

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pestañas principales */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal para postular nuevo puesto */}
        <Stack.Screen
          name="nuevo-negocio"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </StoreProvider>
  );
}
