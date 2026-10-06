// ==========================================
// PiuraRuta - Marcador de Negocio Nativo (BusinessMarker.tsx)
// ==========================================

import React from 'react';
import { Marker } from 'react-native-maps';
import { Business } from '../data/businesses';

export interface BusinessMarkerProps {
  business: Business;
  onPress: (business: Business) => void;
  isRouteStop?: boolean;
  stopNumber?: number;
}

export default function BusinessMarker({
  business,
  onPress,
  isRouteStop,
  stopNumber,
}: BusinessMarkerProps) {
  const isEval = business.estado === 'evaluacion';

  // Lógica unificada de pines:
  // - En ruta activa: Naranja (#FF8C00)
  // - En evaluación: Ámbar (#D97706) con prefijo ⏳
  // - Verificado: Verde (#2E7D32)
  // - Otro: Gris (#718096)
  const pinColor = isRouteStop
    ? '#FF8C00'
    : isEval
    ? '#D97706'
    : business.verified
    ? '#2E7D32'
    : '#718096';

  const title = isRouteStop
    ? `${stopNumber}. ${business.name}`
    : isEval
    ? `⏳ ${business.name} (En evaluación)`
    : business.name;

  const description = `${business.product || 'Especialidad tradicional'} • S/${
    business.price || 0
  }`;

  return (
    <Marker
      coordinate={{
        latitude: business.latitude,
        longitude: business.longitude,
      }}
      title={title}
      description={description}
      pinColor={pinColor}
      onPress={() => onPress(business)}
    />
  );
}