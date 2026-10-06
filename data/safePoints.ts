export interface SafePoint {
  id: number;
  name: string;
  type: 'Serenazgo' | 'Policía' | 'Comercio aliado';
  latitude: number;
  longitude: number;
  description: string;
}

export const safePoints: SafePoint[] = [
  {
    id: 1,
    name: 'Punto Seguro Centro',
    type: 'Serenazgo',
    latitude: -5.1940,
    longitude: -80.6322,
    description: 'Punto de asistencia al turista.',
  },

  {
    id: 2,
    name: 'Comercio Aliado',
    type: 'Comercio aliado',
    latitude: -5.1953,
    longitude: -80.6315,
    description: 'Comercio participante de la red PiuraRuta.',
  },
];