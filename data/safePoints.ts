// ==========================================
// PiuraRuta - Puntos Seguros y Asistencia al Turista
// ==========================================

export interface SafePoint {
  id: number;
  name: string;
  type: 'Serenazgo' | 'Policía' | 'Comercio aliado';
  latitude: number;
  longitude: number;
  description: string;
  telefono?: string;
}

export const safePoints: SafePoint[] = [
  {
    id: 1,
    name: 'Módulo Serenazgo Plaza de Armas',
    type: 'Serenazgo',
    latitude: -5.1940,
    longitude: -80.6322,
    description: 'Puesto fijo de vigilancia municipal y auxilio rápido.',
    telefono: '(073) 307-777',
  },
  {
    id: 2,
    name: 'Policía de Turismo Piura',
    type: 'Policía',
    latitude: -5.1950,
    longitude: -80.6335,
    description: 'Comisaría y orientadores turísticos certificados.',
    telefono: '105 / 965 487 122',
  },
  {
    id: 3,
    name: 'Farmacia & Comercio Aliado Grau',
    type: 'Comercio aliado',
    latitude: -5.1953,
    longitude: -80.6315,
    description: 'Comercio participante con botón de pánico y recarga de batería.',
    telefono: '(073) 321-122',
  },
];