import React, { useMemo, useRef, useState } from 'react';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

import BusinessMarker from '../../components/BusinessMarker';

import { businesses, Business } from '../../data/businesses';
import { safePoints } from '../../data/safePoints';

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [showRoute, setShowRoute] = useState(true);

  /*
   * Centro inicial del mapa.
   *
   * Estas coordenadas corresponden a la zona
   * de demostración que estamos utilizando.
   */
  const piuraRegion = {
    latitude: -5.1945,
    longitude: -80.6328,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  /*
   * Negocios que forman nuestra ruta de demostración.
   *
   * Posteriormente esto será generado por el
   * recomendador según presupuesto, categoría y tiempo.
   */
  const routeBusinesses = useMemo(() => {
    return businesses.filter(
      (business) =>
        business.verified &&
        [1, 2, 3].includes(business.id)
    );
  }, []);

  /*
   * Coordenadas que utilizará Polyline.
   */
  const routeCoordinates = routeBusinesses.map((business) => ({
    latitude: business.latitude,
    longitude: business.longitude,
  }));

  /*
   * Cuando se pulsa un negocio.
   */
  const handleBusinessPress = (business: Business) => {
    setSelectedBusiness(business);
  };

  /*
   * Centrar el mapa nuevamente sobre Piura.
   */
  const centerMap = () => {
    mapRef.current?.animateToRegion(
      piuraRegion,
      800
    );
  };

  /*
   * Centrar el mapa mostrando toda la ruta.
   */
  const showFullRoute = () => {
    if (routeCoordinates.length === 0) {
      return;
    }

    mapRef.current?.fitToCoordinates(
      routeCoordinates,
      {
        edgePadding: {
          top: 120,
          right: 50,
          bottom: 220,
          left: 50,
        },
        animated: true,
      }
    );
  };

  /*
   * Mostrar información del negocio seleccionado.
   */
  const openBusiness = () => {
    if (!selectedBusiness) {
      return;
    }

    Alert.alert(
      selectedBusiness.name,
      `${selectedBusiness.product}\n\n` +
        `Precio: S/${selectedBusiness.price}\n` +
        `Confianza: ${selectedBusiness.confidence}/100\n\n` +
        `Horario: ${selectedBusiness.openingHours}\n` +
        `Pago: ${selectedBusiness.paymentMethods.join(', ')}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ENCABEZADO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Explorar Piura
          </Text>

          <Text style={styles.subtitle}>
            Negocios y puntos seguros
          </Text>
        </View>

        <TouchableOpacity
          style={styles.centerButton}
          onPress={centerMap}
        >
          <Text style={styles.centerButtonText}>
            📍
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAPA */}
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
          loadingIndicatorColor="#FF8C00"
          loadingBackgroundColor="#FFFFFF"
        >
          {/* NEGOCIOS */}
          {businesses.map((business) => (
            <BusinessMarker
              key={business.id}
              business={business}
              onPress={handleBusinessPress}
            />
          ))}

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
            />
          ))}

          {/* RUTA */}
          {showRoute &&
            routeCoordinates.length > 1 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#FF8C00"
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />
            )}
        </MapView>

        {/* LEYENDA */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: '#2E7D32',
                },
              ]}
            />

            <Text style={styles.legendText}>
              Verificado
            </Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: '#9E9E9E',
                },
              ]}
            />

            <Text style={styles.legendText}>
              Pendiente
            </Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor: '#1565C0',
                },
              ]}
            />

            <Text style={styles.legendText}>
              Punto seguro
            </Text>
          </View>
        </View>
      </View>

      {/* BOTONES INFERIORES */}
      <View style={styles.bottomPanel}>
        <View style={styles.routeHeader}>
          <View>
            <Text style={styles.routeTitle}>
              🌴 Ruta Sabores de Piura
            </Text>

            <Text style={styles.routeInfo}>
              3 paradas • S/26 • 75 minutos
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.routeToggle,
              !showRoute && styles.routeToggleInactive,
            ]}
            onPress={() => setShowRoute(!showRoute)}
          >
            <Text style={styles.routeToggleText}>
              {showRoute ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.routeButton}
          onPress={showFullRoute}
        >
          <Text style={styles.routeButtonText}>
            🧭 Ver ruta completa
          </Text>
        </TouchableOpacity>
      </View>

      {/* TARJETA DEL NEGOCIO SELECCIONADO */}
      {selectedBusiness && (
        <View style={styles.businessCard}>
          <View style={styles.businessHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.businessName}>
                {selectedBusiness.name}
              </Text>

              <Text style={styles.businessCategory}>
                {selectedBusiness.category}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setSelectedBusiness(null)
              }
            >
              <Text style={styles.closeButton}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.businessProduct}>
            🍛 {selectedBusiness.product}
          </Text>

          <View style={styles.businessRow}>
            <Text style={styles.businessPrice}>
              S/{selectedBusiness.price}
            </Text>

            {selectedBusiness.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>
                  ✓ Mercado Seguro
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.confidence}>
            ⭐ Confianza {selectedBusiness.confidence}/100
          </Text>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={openBusiness}
          >
            <Text style={styles.detailsButtonText}>
              Ver información
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    height: 72,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3748',
  },

  subtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },

  centerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerButtonText: {
    fontSize: 20,
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
    top: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  legendText: {
    fontSize: 10,
    color: '#4A5568',
    fontWeight: '600',
  },

  bottomPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },

  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  routeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3748',
  },

  routeInfo: {
    fontSize: 12,
    color: '#718096',
    marginTop: 3,
  },

  routeToggle: {
    backgroundColor: '#FFF4E8',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
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
    backgroundColor: '#FF8C00',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },

  routeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  businessCard: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 145,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  businessHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  businessName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3748',
  },

  businessCategory: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },

  closeButton: {
    fontSize: 18,
    color: '#A0AEC0',
    paddingLeft: 10,
  },

  businessProduct: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 12,
  },

  businessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  businessPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E67E00',
  },

  verifiedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  verifiedText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '800',
  },

  confidence: {
    fontSize: 12,
    color: '#718096',
    marginTop: 7,
  },

  detailsButton: {
    backgroundColor: '#2D3748',
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});