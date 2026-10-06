// ==========================================
// PiuraRuta - Base de Negocios y Puestos Tradicionales
// ==========================================

export type EstadoNegocio = 'aprobado' | 'evaluacion' | 'rechazado';

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
  rating: number;
  paymentMethods: string[];
  openingHours: string; // Formato "HH:MM - HH:MM"
  estado: EstadoNegocio;
  tags: string[];
  referencia: string;
  direccion: string;
  foto: string;

  // Campos complementarios sincronizados para compatibilidad entre módulos
  id_categoria?: number;
  id_presupuesto?: number;
  foto_portada_url: string;
  calificacion_promedio: number;
  total_reseñas: number;
  estado_apertura: boolean;
}

/**
 * Función normalizadora que asegura que todos los campos (inglés, español, camelCase y snake_case)
 * existan y estén sincronizados en cada negocio, eliminando discrepancias entre componentes.
 */
export function normalizarNegocio(
  b: Partial<Business> & { id: number; name: string }
): Business {
  const rating = b.rating ?? b.calificacion_promedio ?? 4.5;
  const foto =
    b.foto ??
    b.foto_portada_url ??
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800';
  const direccion = b.direccion ?? b.referencia ?? 'Centro de Piura';
  const referencia = b.referencia ?? b.direccion ?? 'Piura';
  const estado: EstadoNegocio = b.estado ?? 'aprobado';
  const estadoApertura = b.estado_apertura ?? (estado === 'aprobado');

  return {
    id: b.id,
    name: b.name,
    category: b.category ?? 'Gastronomía',
    product: b.product ?? 'Especialidad tradicional',
    description: b.description ?? 'Puesto tradicional de Piura.',
    price: b.price ?? 12,
    latitude: b.latitude ?? -5.1945,
    longitude: b.longitude ?? -80.6328,
    verified: b.verified ?? (estado === 'aprobado'),
    confidence: b.confidence ?? 85,
    rating: rating,
    calificacion_promedio: rating,
    total_reseñas: b.total_reseñas ?? 15,
    paymentMethods: b.paymentMethods ?? ['Efectivo', 'Yape'],
    openingHours: b.openingHours ?? '09:00 - 18:00',
    estado: estado,
    estado_apertura: estadoApertura,
    tags: b.tags ?? [b.category?.toLowerCase() || 'general'],
    referencia: referencia,
    direccion: direccion,
    foto: foto,
    foto_portada_url: foto,
    id_categoria: b.id_categoria,
    id_presupuesto: b.id_presupuesto,
  };
}

export const businesses: Business[] = [
  normalizarNegocio({
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
    id_categoria: 1,
    id_presupuesto: 2,
    total_reseñas: 124,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Av. Grau 320, Piura',
    foto: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    id_categoria: 2,
    id_presupuesto: 1,
    total_reseñas: 86,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Calle Lima 210, Piura',
    foto: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
    id_categoria: 3,
    id_presupuesto: 1,
    total_reseñas: 54,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Malecón Eguiguren 145, Piura',
    foto: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80',
    id_categoria: 1,
    id_presupuesto: 2,
    total_reseñas: 198,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Jr. Ayacucho 580, Piura',
    foto: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    id_categoria: 4,
    id_presupuesto: 1,
    total_reseñas: 110,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Jr. Callao 102, Piura',
    foto: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    id_categoria: 5,
    id_presupuesto: 3,
    total_reseñas: 64,
    estado_apertura: true,
  }),
  normalizarNegocio({
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
    direccion: 'Calle Tacna 720, Piura',
    foto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    id_categoria: 1,
    id_presupuesto: 2,
    total_reseñas: 142,
    estado_apertura: true,
  }),
  normalizarNegocio({
    id: 8,
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
    id_categoria: 5,
    id_presupuesto: 2,
    total_reseñas: 89,
    estado_apertura: true,
  }),
  normalizarNegocio({
    id: 9,
    name: 'El Rincón Piurano (Anticuchos y Picarones)',
    category: 'Chifles / Snacks',
    product: 'Picarones de Camote con Miel de Higo',
    description: 'Puesto nocturno tradicional con picarones calientes recién dorados.',
    price: 8,
    latitude: -5.1970,
    longitude: -80.6322,
    verified: false,
    confidence: 72,
    rating: 4.4,
    paymentMethods: ['Efectivo', 'Yape'],
    openingHours: '17:00 - 22:30',
    estado: 'evaluacion', // PUESTO EN EVALUACIÓN CON ÍCONO ⏳
    tags: ['picarones', 'postres', 'noche', 'calle', 'anticuchos'],
    referencia: 'Frente al Óvalo Bolognesi',
    direccion: 'Av. Bolognesi 880, Piura',
    foto: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    id_categoria: 4,
    id_presupuesto: 1,
    total_reseñas: 18,
    estado_apertura: false,
  }),
  normalizarNegocio({
    id: 10,
    name: 'Sombreros de Paja Don Teodoro',
    category: 'Artesanías',
    product: 'Sombreros de Paja Toquilla',
    description: 'Tejido fino a mano por maestros artesanos del bajo Piura.',
    price: 35,
    latitude: -5.1948,
    longitude: -80.6305,
    verified: false,
    confidence: 68,
    rating: 4.3,
    paymentMethods: ['Efectivo', 'Yape'],
    openingHours: '09:00 - 17:00',
    estado: 'evaluacion', // PUESTO EN EVALUACIÓN CON ÍCONO ⏳
    tags: ['sombreros', 'toquilla', 'artesania', 'hecho a mano'],
    referencia: 'Paso peatonal Jr. Arequipa',
    direccion: 'Jr. Arequipa 340, Piura',
    foto: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    id_categoria: 5,
    id_presupuesto: 3,
    total_reseñas: 12,
    estado_apertura: false,
  }),
];