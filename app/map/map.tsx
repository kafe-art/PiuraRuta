// ==========================================
// PiuraRuta - Mapa Nativo Integrado (app/map/map.tsx)
// ==========================================

import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

import BusinessMarker from '../../components/BusinessMarker';
import NegocioSheet from '../../components/NegocioSheet';
import { useApp } from '../../lib/store';
import { safePoints, SafePoint } from '../../data/safePoints';
import { Business } from '../../data/businesses';
import { C } from '../../lib/theme';

export default function NativeMapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const {
    negocios,
    rutaActiva,
    actualizarParadasRutaActiva,
  } = useApp();

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showRoute, setShowRoute] = useState(true);

  // Coordenadas del centro de Piura
  const piuraRegion = {
    latitude: -5.1945,
    longitude: -80.6328,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  // Coordenadas calculadas desde la ruta activa global
  const routeCoordinates = useMemo(() => {
    if (!rutaActiva || !rutaActiva.paradas) return [];
    return rutaActiva.paradas
      .filter((p) => p.business)
      .map((p) => ({
        latitude: p.business.latitude,
        longitude: p.business.longitude,
      }));
  }, [rutaActiva]);

  // Centrar el mapa en Piura
  const centerMap = () => {
    mapRef.current?.animateToRegion(piuraRegion, 800);
  };

  // Centrar el mapa mostrando toda la ruta
  const showFullRoute = () => {
    if (routeCoordinates.length === 0) {
      Alert.alert('Aviso', 'Aún no hay una ruta activa generada.');
      return;
    }

    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: {
        top: 120,
        right: 60,
        bottom: 220,
        left: 60,
      },
      animated: true,
    });
  };

  const handleAgregarARuta = (b: Business) => {
    if (!rutaActiva) {
      Alert.alert('Sin ruta', 'Crea primero una ruta en la pestaña de Inicio.');
      return;
    }
    const yaEsta = rutaActiva.paradas.some((p) => p.business.id === b.id);
    if (yaEsta) {
      Alert.alert('Aviso', 'Este puesto ya forma parte de tu ruta.');
      return;
    }

    const nuevaParada = {
      paso: rutaActiva.paradas.length + 1,
      business: b,
      horaLlegada: '13:00',
      horaSalida: '13:45',
      minutosEstancia: 40,
      minutosTraslado: 10,
      distanciaDesdeAnteriorKm: 0.5,
      estaAbierto: true,
    };
    actualizarParadasRutaActiva([...rutaActiva.paradas, nuevaParada]);
    setSelectedBusiness(null);
    Alert.alert('¡Agregado!', `"${b.name}" ha sido agregado a tu ruta.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ENCABEZADO */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mapa Nativo Piura</Text>
          <Text style={styles.subtitle}>Negocios tradicionales y puntos seguros</Text>
        </View>

        {/* Botón para alternar al Mapa Web (Leaflet) */}
        <TouchableOpacity
          style={styles.switchMapBtn}
          onPress={() => router.push('/(tabs)/mapa')}
        >
          <Text style={styles.switchMapText}>🌐 Mapa Web</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerButton} onPress={centerMap}>
          <Text style={styles.centerButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* MAPA NATIVO */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={piuraRegion}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsPointsOfInterests={true}
          loadingEnabled={true}
          loadingIndicatorColor={C.primary}
          loadingBackgroundColor="#FFFFFF"
        >
          {/* NEGOCIOS (incluye verificados y en evaluación ⏳) */}
          {negocios.map((business) => {
            const paradaEnRuta = rutaActiva?.paradas.find(
              (p) => p.business.id === business.id
            );
            return (
              <BusinessMarker
                key={business.id}
                business={business}
                isRouteStop={Boolean(paradaEnRuta)}
                stopNumber={paradaEnRuta?.paso}
                onPress={(b) => setSelectedBusiness(b)}
              />
            );
          })}

          {/* PUNTOS SEGUROS */}
          {safePoints.map((point) => (
            <Marker
              key={`safe-${point.id}`}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={`🛡️ ${point.name}`}
              description={point.description}
              pinColor="#1565C0"
              onPress={() =>
                Alert.alert(
                  `🛡️ ${point.name}`,
                  `${point.description}\n\nContacto: ${point.telefono || '105'}`
                )
              }
            />
          ))}

          {/* POLILÍNEA DE LA RUTA ACTIVA */}
          {showRoute && routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={C.primary}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {/* LEYENDA UNIFICADA */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
            <Text style={styles.legendText}>Verificado</Text>
          </View>

          <View style={styles.legendItem}>
            <Text style={{ fontSize: 11, marginRight: 2 }}>⏳</Text>
            <Text style={styles.legendText}>En evaluación</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1565C0' }]} />
            <Text style={styles.legendText}>Punto seguro</Text>
          </View>

          {routeCoordinates.length > 0 && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF8C00' }]} />
              <Text style={styles.legendText}>En tu ruta</Text>
            </View>
          )}
        </View>
      </View>

      {/* PANEL INFERIOR DE RUTA */}
      <View style={styles.bottomPanel}>
        <View style={styles.routeHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeTitle}>
              {rutaActiva ? `🌴 ${rutaActiva.nombre}` : 'Sin ruta activa'}
            </Text>

            <Text style={styles.routeInfo}>
              {rutaActiva
                ? `${rutaActiva.paradas.length} paradas • S/${rutaActiva.costoEstimadoTotal} • ${Math.round(
                    rutaActiva.duracionTotalMinutos / 60
                  )}h ${rutaActiva.duracionTotalMinutos % 60}m`
                : 'Genera tu recorrido con el Asistente en Inicio'}
            </Text>
          </View>

          {routeCoordinates.length > 0 && (
            <TouchableOpacity
              style={[styles.routeToggle, !showRoute && styles.routeToggleInactive]}
              onPress={() => setShowRoute(!showRoute)}
            >
              <Text style={styles.routeToggleText}>
                {showRoute ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {routeCoordinates.length > 0 && (
            <TouchableOpacity
              style={[styles.routeButton, { flex: 1, backgroundColor: C.secondary }]}
              onPress={showFullRoute}
            >
              <Text style={styles.routeButtonText}>🧭 Ver ruta completa</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.routeButton, { flex: 1.2 }]}
            onPress={() => router.push('/(tabs)/rutas')}
          >
            <Text style={styles.routeButtonText}>
              {rutaActiva ? '⚙️ Editar Itinerario' : 'Crear Nueva Ruta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HOJA INFERIOR DETALLE DE NEGOCIO */}
      <NegocioSheet
        business={selectedBusiness}
        visible={Boolean(selectedBusiness)}
        onClose={() => setSelectedBusiness(null)}
        onAgregarARuta={rutaActiva ? handleAgregarARuta : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 68,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 11,
    color: '#718096',
    marginTop: 1,
  },
  switchMapBtn: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchMapText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.primaryDark,
  },
  centerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonText: {
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#4A5568',
    fontWeight: '600',
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D3748',
  },
  routeInfo: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  routeToggle: {
    backgroundColor: '#FFF4E8',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  routeToggleInactive: {
    backgroundColor: '#EDF2F7',
  },
  routeToggleText: {
    color: '#E67E00',
    fontSize: 11,
    fontWeight: '700',
  },
  routeButton: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  routeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
