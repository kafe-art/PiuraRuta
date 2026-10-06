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
}

export const businesses: Business[] = [
  {
    id: 1,
    name: 'La Piuranita',
    category: 'Gastronomía',
    product: 'Seco de Chabelo',
    description: 'Comida tradicional piurana.',
    price: 12,
    latitude: -5.1945,
    longitude: -80.6328,
    verified: true,
    confidence: 92,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '11:00 - 17:00',
  },

  {
    id: 2,
    name: 'Jugos Norte',
    category: 'Bebidas',
    product: 'Algarrobina',
    description: 'Jugos y bebidas tradicionales.',
    price: 6,
    latitude: -5.1938,
    longitude: -80.6318,
    verified: true,
    confidence: 87,
    paymentMethods: ['Yape', 'Plin', 'Efectivo'],
    openingHours: '09:00 - 16:00',
  },

  {
    id: 3,
    name: 'Dulces Piuranos',
    category: 'Dulces',
    product: 'Dulce tradicional',
    description: 'Dulces y productos tradicionales de Piura.',
    price: 8,
    latitude: -5.1951,
    longitude: -80.6332,
    verified: true,
    confidence: 90,
    paymentMethods: ['Efectivo'],
    openingHours: '10:00 - 18:00',
  },

  {
    id: 4,
    name: 'Cevichería Don Lucho',
    category: 'Gastronomía',
    product: 'Ceviche tradicional',
    description: 'Ceviche preparado al momento.',
    price: 15,
    latitude: -5.1935,
    longitude: -80.6340,
    verified: true,
    confidence: 94,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '10:00 - 16:00',
  },

  {
    id: 5,
    name: 'Chifles Doña Rosa',
    category: 'Chifles / Snacks',
    product: 'Chifles artesanales',
    description: 'Chifles y snacks tradicionales.',
    price: 5,
    latitude: -5.1957,
    longitude: -80.6314,
    verified: true,
    confidence: 85,
    paymentMethods: ['Efectivo'],
    openingHours: '08:00 - 18:00',
  },

  {
    id: 6,
    name: 'Artesanías del Norte',
    category: 'Artesanías',
    product: 'Artesanía piurana',
    description: 'Productos artesanales de productores locales.',
    price: 20,
    latitude: -5.1962,
    longitude: -80.6338,
    verified: false,
    confidence: 65,
    paymentMethods: ['Yape', 'Efectivo'],
    openingHours: '09:00 - 17:00',
  },
];