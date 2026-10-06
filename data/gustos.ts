// ==========================================
// PiuraRuta - Catálogo de Gustos / Preferencias
// ==========================================

export interface GustoItem {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  emoji: string;
  color: string;
  foto?: string; // Solo "Ceviche" y "Artesanía" usan foto por defecto
}

export const GUSTOS_CATALOGO: GustoItem[] = [
  {
    id: 'ceviche',
    nombre: 'Ceviche Piurano',
    categoria: 'Gastronomía',
    descripcion: 'Mero fresco, cabrilla, zarandaja y chifles crujientes.',
    emoji: '🐟',
    color: '#0284C7',
    foto: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'artesania',
    nombre: 'Artesanía de Catacaos',
    categoria: 'Artesanías',
    descripcion: 'Filigrana de plata, sombreros de paja toquilla y tallados.',
    emoji: '🏺',
    color: '#8B5CF6',
    foto: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'seco-chabelo',
    nombre: 'Seco de Chabelo',
    categoria: 'Gastronomía',
    descripcion: 'Plátano verde majado con cecina aliñada piurana.',
    emoji: '🍌',
    color: '#EAB308',
  },
  {
    id: 'chifles',
    nombre: 'Chifles al Paso',
    categoria: 'Chifles / Snacks',
    descripcion: 'Chifles crocantes con cancha salada y chicharrón.',
    emoji: '🥨',
    color: '#F97316',
  },
  {
    id: 'algarrobina',
    nombre: 'Algarrobina y Jugos',
    categoria: 'Bebidas',
    descripcion: 'Cóctel de algarrobina, macerados y jugos de fruta norteña.',
    emoji: '🍹',
    color: '#78350F',
  },
  {
    id: 'natillas',
    nombre: 'Natillas y Manjar',
    categoria: 'Dulces',
    descripcion: 'Dulces de leche de cabra, chancaca y miel piurana.',
    emoji: '🍮',
    color: '#EC4899',
  },
  {
    id: 'chicha-jora',
    nombre: 'Chicha de Jora y Picantería',
    categoria: 'Bebidas',
    descripcion: 'Chicha en poto o clarito tradicional de picantería.',
    emoji: '🏺',
    color: '#10B981',
  },
  {
    id: 'malacon',
    nombre: 'Paseo y Cultura',
    categoria: 'Cultura',
    descripcion: 'Puente Bolognesi, Malecón Eguiguren y Plaza de Armas.',
    emoji: '🌴',
    color: '#06B6D4',
  },
];
