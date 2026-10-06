// ==========================================
// PiuraRuta - Mapa Interactivo Leaflet con Puente WebView (MapaWeb.tsx)
// ==========================================

import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Business } from '../data/businesses';
import { SafePoint } from '../data/safePoints';
import { ParadaRuta } from '../lib/ruta';
import { C } from '../lib/theme';

export interface MapaWebProps {
  negocios: Business[];
  safePoints?: SafePoint[];
  paradasRuta?: ParadaRuta[];
  mostrarRuta?: boolean;
  onSelectBusiness?: (business: Business) => void;
  onSelectSafePoint?: (safePoint: SafePoint) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export interface MapaWebRef {
  centrarEn: (lat: number, lng: number, zoom?: number) => void;
  centrarPiura: () => void;
  ajustarRuta: () => void;
}

const LEAFLET_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #F1F5F9; }
    
    /* Marcadores personalizados */
    .custom-pin {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      border: 2px solid #FFFFFF;
      cursor: pointer;
      font-family: sans-serif;
      font-weight: bold;
      transition: transform 0.15s ease;
    }
    .custom-pin:active {
      transform: scale(1.2);
    }
    
    .pin-aprobado {
      background: #2E7D32;
      color: #FFFFFF;
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
    
    /* PUESTOS EN EVALUACIÓN CON ÍCONO ⏳ */
    .pin-evaluacion {
      background: #D97706;
      color: #FFFFFF;
      width: 34px;
      height: 34px;
      font-size: 18px;
      border: 2px dashed #FFFFFF;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
    
    .pin-safepoint {
      background: #1565C0;
      color: #FFFFFF;
      width: 30px;
      height: 30px;
      font-size: 15px;
    }
    
    .pin-ruta {
      background: #FF8C00;
      color: #FFFFFF;
      width: 36px;
      height: 36px;
      font-size: 16px;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(255, 140, 0, 0.5);
    }
    
    /* Tooltips */
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .popup-title {
      font-size: 14px;
      font-weight: 700;
      color: #1A202C;
      margin-bottom: 2px;
    }
    .popup-sub {
      font-size: 12px;
      color: #718096;
    }
    .popup-badge {
      display: inline-block;
      margin-top: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([-5.1945, -80.6328], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var negociosLayer = L.layerGroup().addTo(map);
    var safePointsLayer = L.layerGroup().addTo(map);
    var rutaLayer = L.layerGroup().addTo(map);

    function sendToRN(type, payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
      }
    }

    map.on('click', function(e) {
      sendToRN('map_click', { lat: e.latlng.lat, lng: e.latlng.lng });
    });

    window.actualizarDatos = function(negocios, safePoints, paradasRuta, mostrarRuta) {
      negociosLayer.clearLayers();
      safePointsLayer.clearLayers();
      rutaLayer.clearLayers();

      // Conjunto de IDs que ya están en la ruta para no duplicar marcadores
      var enRutaIds = {};
      if (mostrarRuta && paradasRuta && paradasRuta.length > 0) {
        paradasRuta.forEach(function(p) {
          if (p.business && p.business.id) enRutaIds[p.business.id] = true;
        });
      }

      // Marcadores de Negocios
      if (negocios && negocios.length > 0) {
        negocios.forEach(function(b) {
          if (enRutaIds[b.id]) return; // Si está en la ruta se renderiza con el pin de ruta

          var isEval = b.estado === 'evaluacion';
          var iconHtml = isEval
            ? '<div class="custom-pin pin-evaluacion" title="En evaluación">⏳</div>'
            : '<div class="custom-pin pin-aprobado" title="Aprobado">🏪</div>';

          var customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: isEval ? [34, 34] : [32, 32],
            iconAnchor: isEval ? [17, 17] : [16, 16]
          });

          var marker = L.marker([b.latitude, b.longitude], { icon: customIcon });
          marker.on('click', function() {
            sendToRN('negocio_click', { id: b.id });
          });
          negociosLayer.addLayer(marker);
        });
      }

      // Marcadores de Puntos Seguros
      if (safePoints && safePoints.length > 0) {
        safePoints.forEach(function(sp) {
          var customIcon = L.divIcon({
            html: '<div class="custom-pin pin-safepoint" title="Punto Seguro">🛡️</div>',
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          var marker = L.marker([sp.latitude, sp.longitude], { icon: customIcon });
          marker.on('click', function() {
            sendToRN('safepoint_click', { id: sp.id });
          });
          safePointsLayer.addLayer(marker);
        });
      }

      // Marcadores y Polilínea de la Ruta Activa
      if (mostrarRuta && paradasRuta && paradasRuta.length > 0) {
        var rutaCoords = [];

        paradasRuta.forEach(function(p, idx) {
          var b = p.business;
          if (!b) return;

          rutaCoords.push([b.latitude, b.longitude]);

          var pasoNum = p.paso || (idx + 1);
          var iconHtml = '<div class="custom-pin pin-ruta">' + pasoNum + '</div>';

          var customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          var marker = L.marker([b.latitude, b.longitude], { icon: customIcon });
          marker.on('click', function() {
            sendToRN('negocio_click', { id: b.id });
          });
          rutaLayer.addLayer(marker);
        });

        if (rutaCoords.length > 1) {
          var polyline = L.polyline(rutaCoords, {
            color: '#FF8C00',
            weight: 5,
            opacity: 0.9,
            dashArray: '8, 8',
            lineJoin: 'round'
          });
          rutaLayer.addLayer(polyline);
        }
      }
    };

    window.centrarEn = function(lat, lng, zoom) {
      map.setView([lat, lng], zoom || 16, { animate: true, duration: 0.8 });
    };

    window.ajustarRuta = function(coords) {
      if (coords && coords.length > 0) {
        var bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    };

    // Notificar a React Native que Leaflet terminó de cargar
    setTimeout(function() {
      sendToRN('map_ready', {});
    }, 150);
  </script>
</body>
</html>
`;

export const MapaWeb = forwardRef<MapaWebRef, MapaWebProps>(
  (
    {
      negocios,
      safePoints = [],
      paradasRuta = [],
      mostrarRuta = true,
      onSelectBusiness,
      onSelectSafePoint,
      onMapClick,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    // Enviar datos actualizados a Leaflet sin recargar la página (injectJavaScript)
    const sincronizarDatos = useCallback(() => {
      if (!isMapReady || !webViewRef.current) return;

      const js = `
        if (window.actualizarDatos) {
          window.actualizarDatos(
            ${JSON.stringify(negocios)},
            ${JSON.stringify(safePoints)},
            ${JSON.stringify(paradasRuta)},
            ${Boolean(mostrarRuta)}
          );
        }
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }, [isMapReady, negocios, safePoints, paradasRuta, mostrarRuta]);

    useEffect(() => {
      sincronizarDatos();
    }, [sincronizarDatos]);

    useImperativeHandle(ref, () => ({
      centrarEn: (lat: number, lng: number, zoom: number = 16) => {
        webViewRef.current?.injectJavaScript(
          `if (window.centrarEn) window.centrarEn(${lat}, ${lng}, ${zoom}); true;`
        );
      },
      centrarPiura: () => {
        webViewRef.current?.injectJavaScript(
          `if (window.centrarEn) window.centrarEn(-5.1945, -80.6328, 15); true;`
        );
      },
      ajustarRuta: () => {
        if (!paradasRuta || paradasRuta.length === 0) return;
        const coords = paradasRuta
          .filter((p) => p.business)
          .map((p) => [p.business.latitude, p.business.longitude]);
        webViewRef.current?.injectJavaScript(
          `if (window.ajustarRuta) window.ajustarRuta(${JSON.stringify(coords)}); true;`
        );
      },
    }));

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.type) {
          case 'map_ready':
            setIsMapReady(true);
            break;
          case 'negocio_click':
            const b = negocios.find((item) => item.id === data.payload.id);
            if (b && onSelectBusiness) onSelectBusiness(b);
            break;
          case 'safepoint_click':
            const sp = safePoints.find((item) => item.id === data.payload.id);
            if (sp && onSelectSafePoint) onSelectSafePoint(sp);
            break;
          case 'map_click':
            if (onMapClick) onMapClick(data.payload.lat, data.payload.lng);
            break;
        }
      } catch (err) {
        console.error('Error parseando mensaje desde WebView:', err);
      }
    };

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: LEAFLET_HTML }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={C.primary} />
            </View>
          )}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
