// ==========================================
// PiuraRuta - Mapa con Lupa Funcional (app/(tabs)/mapa.tsx)
// ==========================================

import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useApp } from '../../lib/store';
import { safePoints, SafePoint } from '../../data/safePoints';
import { Business } from '../../data/businesses';
import { MapaWeb, MapaWebRef } from '../../components/MapaWeb';
import NegocioSheet from '../../components/NegocioSheet';
import { C } from '../../lib/theme';

// Función para remover tildes y normalizar texto
function quitarTildes(texto: string): string {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function MapaScreen() {
  const { negocios, rutaActiva, setRutaActiva, actualizarParadasRutaActiva } = useApp();

  const mapaRef = useRef<MapaWebRef>(null);

  // Estados de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estados de selección y visualización
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [mostrarRuta, setMostrarRuta] = useState(true);

  // -------------------------------------------------------------
  // LUPA FUNCIONAL: Búsqueda sin tildes por nombre, tipo, etiquetas, referencia
  // -------------------------------------------------------------
  const resultadosBusqueda = useMemo(() => {
    const q = quitarTildes(busqueda);
    if (!q) return [];

    return negocios.filter((b) => {
      const matchNombre = quitarTildes(b.name).includes(q);
      const matchTipo = quitarTildes(b.category).includes(q);
      const matchProducto = quitarTildes(b.product).includes(q);
      const matchReferencia = quitarTildes(b.referencia).includes(q);
      const matchDireccion = b.direccion ? quitarTildes(b.direccion).includes(q) : false;
      const matchTags = b.tags && b.tags.some((t) => quitarTildes(t).includes(q));

      return (
        matchNombre ||
        matchTipo ||
        matchProducto ||
        matchReferencia ||
        matchDireccion ||
        matchTags
      );
    });
  }, [busqueda, negocios]);

  const handleSeleccionarNegocio = (b: Business) => {
    setSelectedBusiness(b);
    setMostrarResultados(false);
    // Centrar mapa suavemente en las coordenadas del negocio
    mapaRef.current?.centrarEn(b.latitude, b.longitude, 17);
  };

  const handleSeleccionarSafePoint = (sp: SafePoint) => {
    Alert.alert(
      `🛡️ ${sp.name}`,
      `Tipo: ${sp.type}\n\n${sp.description}\n\nTeléfono de emergencia: ${
        sp.telefono || '105'
      }`
    );
  };

  const handleAgregarARuta = (b: Business) => {
    if (!rutaActiva) {
      Alert.alert(
        'Sin ruta activa',
        'Genera primero una ruta desde el Asistente en la pestaña Inicio.'
      );
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
      distanciaDesdeAnteriorKm: 0.6,
      estaAbierto: true,
    };

    actualizarParadasRutaActiva([...rutaActiva.paradas, nuevaParada]);
    setSelectedBusiness(null);
    Alert.alert('¡Agregado!', `"${b.name}" ha sido agregado a tu ruta.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* BARRA SUPERIOR CON LUPA FUNCIONAL */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, comida, chifles, artesanía..."
            placeholderTextColor={C.textMuted}
            value={busqueda}
            onChangeText={(texto) => {
              setBusqueda(texto);
              setMostrarResultados(texto.trim().length > 0);
            }}
            onFocus={() => {
              if (busqueda.trim().length > 0) setMostrarResultados(true);
            }}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setBusqueda('');
                setMostrarResultados(false);
              }}
              style={styles.clearSearchBtn}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botón Centrar Piura */}
        <TouchableOpacity
          style={styles.centerBtn}
          onPress={() => mapaRef.current?.centrarPiura()}
        >
          <Text style={styles.centerBtnText}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* DESPLEGABLE DE RESULTADOS DE LA LUPA */}
      {mostrarResultados && (
        <View style={styles.searchResultsDropdown}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCountText}>
              {resultadosBusqueda.length}{' '}
              {resultadosBusqueda.length === 1 ? 'coincidencia' : 'coincidencias'}
            </Text>
            <TouchableOpacity onPress={() => setMostrarResultados(false)}>
              <Text style={styles.resultsCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {resultadosBusqueda.length === 0 ? (
            <Text style={styles.noResultsText}>
              No se encontraron negocios con esos términos.
            </Text>
          ) : (
            <ScrollView style={styles.resultsScroll} keyboardShouldPersistTaps="handled">
              {resultadosBusqueda.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultItem}
                  onPress={() => handleSeleccionarNegocio(item)}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.resultItemTitleRow}>
                      <Text style={styles.resultItemName}>{item.name}</Text>
                      {item.estado === 'evaluacion' && (
                        <Text style={styles.evalBadgeText}>⏳</Text>
                      )}
                    </View>
                    <Text style={styles.resultItemCategory}>
                      {item.category} • {item.product}
                    </Text>
                    <Text style={styles.resultItemRef} numberOfLines={1}>
                      📍 {item.referencia}
                    </Text>
                  </View>
                  <Text style={styles.resultItemPrice}>S/{item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* CONTENEDOR DEL MAPA (Leaflet WebView Bridge) */}
      <View style={styles.mapContainer}>
        <MapaWeb
          ref={mapaRef}
          negocios={negocios}
          safePoints={safePoints}
          paradasRuta={rutaActiva?.paradas || []}
          mostrarRuta={mostrarRuta}
          onSelectBusiness={handleSeleccionarNegocio}
          onSelectSafePoint={handleSeleccionarSafePoint}
        />

        {/* LEYENDA VISUAL FLOTANTE */}
        <View style={styles.floatingLegend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
            <Text style={styles.legendLabel}>Aprobado</Text>
          </View>
          <View style={styles.legendRow}>
            <Text style={{ fontSize: 11, marginRight: 3 }}>⏳</Text>
            <Text style={styles.legendLabel}>En evaluación</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#1565C0' }]} />
            <Text style={styles.legendLabel}>Punto Seguro</Text>
          </View>
          {rutaActiva && (
            <TouchableOpacity
              style={styles.toggleRouteBadge}
              onPress={() => setMostrarRuta(!mostrarRuta)}
            >
              <Text style={styles.toggleRouteText}>
                {mostrarRuta ? '🟠 Ocultar Ruta' : '⚪ Ver Ruta'}
              </Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    zIndex: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.textPrimary,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: C.textMuted,
    fontWeight: '700',
  },
  centerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtnText: {
    fontSize: 20,
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 64,
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    maxHeight: 280,
    zIndex: 99,
    padding: 10,
    borderWidth: 1,
    borderColor: C.border,
    ...C.shadowLg,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    marginBottom: 6,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textSecondary,
  },
  resultsCloseText: {
    fontSize: 12,
    color: C.primaryDark,
    fontWeight: '700',
  },
  resultsScroll: {
    maxHeight: 220,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  resultItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  evalBadgeText: {
    fontSize: 12,
  },
  resultItemCategory: {
    fontSize: 11,
    color: C.textSecondary,
  },
  resultItemRef: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 1,
  },
  resultItemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: C.primaryDark,
    marginLeft: 8,
  },
  noResultsText: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: 'center',
    paddingVertical: 14,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingLegend: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...C.shadowSm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: C.secondary,
    fontWeight: '600',
  },
  toggleRouteBadge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  toggleRouteText: {
    fontSize: 10,
    color: C.primaryDark,
    fontWeight: '700',
  },
});
