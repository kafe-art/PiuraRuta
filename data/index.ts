// ==========================================
// PiuraRuta - Exportación central de Datos
// ==========================================

export * from './businesses';
export * from './gustos';
export * from './safePoints';

import rawResenas from './resenas.json';

export interface Resena {
  id: string;
  businessId: number;
  autor: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export const resenasIniciales: Resena[] = rawResenas as Resena[];
