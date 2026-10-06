export interface Business {
  id: number;
  name: string;
  category: string;
  product: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  verified: boolean;
  confidence: number;
  paymentMethods: string[];
  openingHours: string;
  // CAMPOS DE LA TABLA LUGARES
  id_categoria?: number;
  id_presupuesto?: number;
  direccion?: string;
  foto_portada_url?: string;
  calificacion_promedio?: number;
  total_reseñas?: number;
  estado_apertura?: boolean;
}

export const businesses: Business[] = [
  {
    id: 1,
    name: 'La Piuranita',
    category: 'Gastronomía',
    product: 'Seco de Chabelo',
    description: 'Comida tradicional piurana preparada con plátano verde y carne aliñada.',
    price: 12,
    latitude: -5.1945,
    longitude: -80.6328,
    verified: true,
    confidence: 92,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '11:00 - 17:00',
    // DATOS DE LUGARES
    id_categoria: 1,
    id_presupuesto: 2,
    direccion: 'Jr. Ayacucho 456, Centro de Piura',
    foto_portada_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    calificacion_promedio: 4.8,
    total_reseñas: 124,
    estado_apertura: true,
  },
  {
    id: 2,
    name: 'Jugos Norte',
    category: 'Bebidas',
    product: 'Algarrobina',
    description: 'Jugos y bebidas tradicionales a base de algarrobina piurana.',
    price: 6,
    latitude: -5.1938,
    longitude: -80.6318,
    verified: true,
    confidence: 87,
    paymentMethods: ['Yape', 'Plin', 'Efectivo'],
    openingHours: '09:00 - 16:00',
    id_categoria: 2,
    id_presupuesto: 1,
    direccion: 'Calle Cusco 789, Piura',
    foto_portada_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
    calificacion_promedio: 4.5,
    total_reseñas: 89,
    estado_apertura: true,
  },
  // Repite la estructura para el resto de elementos...
];