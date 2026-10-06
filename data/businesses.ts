// ==========================================
// PiuraRuta - Base de Negocios y Puestos Tradicionales
// ==========================================

export type EstadoNegocio = 'aprobado' | 'evaluacion' | 'rechazado';

export interface Business {
  id: number;
  name: string;
  category: string;
  product?: string;
  description?: string;
  price?: number;
  latitude: number;
  longitude: number;
  verified: boolean;
  confidence: number;
  rating: number;
  paymentMethods: string[];
  openingHours: string; // Formato "HH:MM - HH:MM"
  estado: EstadoNegocio;
  tags: string[];
  referencia: string;
  direccion: string;
  foto?: string;

  // Campos de compatibilidad con base de datos
  id_categoria?: number;
  id_presupuesto?: number;
  foto_portada_url?: string;
  calificacion_promedio?: number;
  total_reseñas?: number;
  estado_apertura?: boolean;
}

export const businesses: Business[] = [
  
   {
    id: 1,
    name: 'El Buen Sabor Piurano',
    category: 'Gastronomía',
    product: 'Seco de Chabelo',
    description: 'Comida tradicional piurana preparada con plátano verde y carne aliñada.',
    price: 12,
    latitude: -5.1945,
    longitude: -80.6328,
    verified: true,
    confidence: 92,
    rating: 4.8,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '11:00 - 17:00',
    estado: 'aprobado',
    tags: ['almuerzo', 'criollo', 'tradicional', 'seco de chabelo'],
    referencia: 'A media cuadra de la plaza',
    direccion: 'Jr. Ayacucho 456, Centro de Piura',
    foto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',

    // Campos complementarios
    id_categoria: 1,
    id_presupuesto: 2,
    foto_portada_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    calificacion_promedio: 4.8,
    total_reseñas: 124,
    estado_apertura: true,
  },
  {
    id: 2,
    name: 'Jugos Norte y Algarrobina',
    category: 'Bebidas',
    product: 'Algarrobina & Jugos Especiales',
    description: 'Bebidas refrescantes hechas con algarroba pura de los bosques secos de Piura.',
    price: 7,
    latitude: -5.1938,
    longitude: -80.6318,
    verified: true,
    confidence: 90,
    rating: 4.7,
    paymentMethods: ['Yape', 'Plin', 'Efectivo'],
    openingHours: '08:30 - 18:00',
    estado: 'aprobado',
    tags: ['jugos', 'refrescos', 'algarrobina', 'helados', 'frutas'],
    referencia: 'Frente al Parque Infantil Miguel Cortés',
    direccion: 'Av. Grau 320',
    foto: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Dulces Piuranos Don Manuel',
    category: 'Dulces',
    product: 'Natilla Tradicional y Acanelados',
    description: 'Dulces tradicionales de leche de cabra en perol de cobre y alfeñiques.',
    price: 8,
    latitude: -5.1951,
    longitude: -80.6332,
    verified: true,
    confidence: 91,
    rating: 4.6,
    paymentMethods: ['Efectivo', 'Yape'],
    openingHours: '09:00 - 19:30',
    estado: 'aprobado',
    tags: ['postres', 'natillas', 'dulces', 'recuerdos', 'artesanal'],
    referencia: 'Costado de la Iglesia San Francisco',
    direccion: 'Calle Lima 210',
    foto: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Cevichería Don Lucho',
    category: 'Gastronomía',
    product: 'Ceviche de Mero al Paso',
    description: 'Ceviche fresco al instante con cebolla crujiente, chifle, sarandaja y ají limo.',
    price: 15,
    latitude: -5.1935,
    longitude: -80.6340,
    verified: true,
    confidence: 96,
    rating: 4.9,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '10:00 - 16:00',
    estado: 'aprobado',
    tags: ['mariscos', 'ceviche', 'pescado', 'fresco', 'picante'],
    referencia: 'Paseo Eguiguren con Jr. Tacna',
    direccion: 'Malecón Eguiguren 145',
    foto: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Chifles Doña Rosa',
    category: 'Chifles / Snacks',
    product: 'Chifles Ondulados con Cancha',
    description: 'Chifles artesanales fritos en paila caliente y envasados en el día.',
    price: 5,
    latitude: -5.1957,
    longitude: -80.6314,
    verified: true,
    confidence: 89,
    rating: 4.5,
    paymentMethods: ['Efectivo', 'Yape'],
    openingHours: '08:00 - 20:00',
    estado: 'aprobado',
    tags: ['chifles', 'snacks', 'platanitos', 'cancha', 'llevar'],
    referencia: 'A espaldas del Mercado Central',
    direccion: 'Jr. Ayacucho 580',
    foto: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Artesanías y Filigrana Catacaos',
    category: 'Artesanías',
    product: 'Filigrana de Plata & Cerámica',
    description: 'Muestra de orfebres y artesanos de la Heroica Villa de Catacaos.',
    price: 22,
    latitude: -5.1962,
    longitude: -80.6338,
    verified: true,
    confidence: 88,
    rating: 4.6,
    paymentMethods: ['Yape', 'Efectivo', 'Tarjeta'],
    openingHours: '09:00 - 18:30',
    estado: 'aprobado',
    tags: ['plata', 'artesania', 'joyeria', 'sombreros', 'recuerdos'],
    referencia: 'Feria Artesanal del Malecón',
    direccion: 'Jr. Callao 102',
    foto: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Picantería La Chabela',
    category: 'Gastronomía',
    product: 'Malarrabia y Chicha de Jora',
    description: 'Auténtica sazón norteña servida con arroz, menestra, pescado frito y chicha fresca.',
    price: 18,
    latitude: -5.1925,
    longitude: -80.6350,
    verified: true,
    confidence: 93,
    rating: 4.8,
    paymentMethods: ['Yape', 'Plin', 'Efectivo'],
    openingHours: '11:00 - 16:00',
    estado: 'aprobado',
    tags: ['picanteria', 'chicha', 'malarrabia', 'tradicional', 'almuerzo'],
    referencia: 'Cerca del Puente San Miguel',
    direccion: 'Calle Tacna 720',
    foto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Puesto Calle Cusco',
    category: 'Artesanías',
    product: 'Productos artesanales piuranos',
    description: 'Venta de productos tradicionales hechos a mano.',
    price: 15,
    latitude: -5.1965,
    longitude: -80.6285,
    verified: true,
    confidence: 85,
    rating: 4.5,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '09:00 - 16:00',
    estado: 'aprobado',
    tags: ['artesania', 'recuerdos', 'hecho a mano'],
    referencia: 'Cerca a la plaza principal',
    direccion: 'Calle Cusco 789, Piura',
    foto: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',

    // Campos adicionales compatibles
    id_categoria: 2,
    id_presupuesto: 1,
    foto_portada_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800',
    calificacion_promedio: 4.5,
    total_reseñas: 89,
    estado_apertura: true,
  }
];