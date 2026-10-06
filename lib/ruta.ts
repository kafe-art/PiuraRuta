// ==========================================
// PiuraRuta - Generador y Gestor de Rutas (lib/ruta.ts)
// ==========================================

import { Business } from '../data/businesses';

export const PASOS = 4; // Cantidad fija de paradas requeridas para la ruta

export interface ParadaRuta {
  paso: number; // 1, 2, 3, 4
  business: Business;
  horaLlegada: string;       // "HH:MM"
  horaSalida: string;        // "HH:MM"
  minutosEstancia: number;   // ej. 45
  minutosTraslado: number;   // tiempo de traslado hasta esta parada
  distanciaDesdeAnteriorKm: number;
  estaAbierto: boolean;
  alertaHorario?: string;
}

export interface Ruta {
  id: string;
  nombre: string;
  fechaCreacion: string;
  paradas: ParadaRuta[];
  duracionTotalMinutos: number;
  costoEstimadoTotal: number;
  distanciaTotalKm: number;
  mensajesRelajacion: string[];
  advertenciasHorario: string[];
}

export interface CriteriosRuta {
  tiempoMinutos?: number;     // ej. 180 (3 horas)
  presupuesto?: 'BARATO' | 'MEDIO' | 'CARO' | 'TODOS';
  categoriaPreferida?: string;
  gustosSeleccionados?: string[];
  horaInicio?: string;        // "HH:MM", default "11:00"
  transporte?: 'PIE' | 'MOTO' | 'AUTO';
}

// -------------------------------------------------------------
// Utilidades de Horarios como Minutos desde Medianoche
// -------------------------------------------------------------

export function minutosDesdeMedianoche(hhmm: string): number {
  if (!hhmm || !hhmm.includes(':')) return 0;
  const [h, m] = hhmm.trim().split(':').map((num) => parseInt(num, 10) || 0);
  return h * 60 + m;
}

export function minutosAHora(minutos: number): string {
  const norm = ((minutos % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${hh}:${mm}`;
}

export function parseRangoHorario(openingHours: string): { apertura: number; cierre: number } | null {
  if (!openingHours) return null;
  const partes = openingHours.split('-').map((p) => p.trim());
  if (partes.length < 2) return null;
  return {
    apertura: minutosDesdeMedianoche(partes[0]),
    cierre: minutosDesdeMedianoche(partes[1]),
  };
}

export function estaAbiertoEnMinutos(business: Business, minutoDelDia: number): boolean {
  const rango = parseRangoHorario(business.openingHours);
  if (!rango) return true; // Si no hay rango estricto, asumir abierto
  if (rango.apertura <= rango.cierre) {
    return minutoDelDia >= rango.apertura && minutoDelDia <= rango.cierre;
  }
  // Cruza medianoche (e.g. 20:00 - 02:00)
  return minutoDelDia >= rango.apertura || minutoDelDia <= rango.cierre;
}

// -------------------------------------------------------------
// Utilidades de Distancia (Fórmula Haversine)
// -------------------------------------------------------------

export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// -------------------------------------------------------------
// Generador Principal de Ruta (Función Pura)
// -------------------------------------------------------------

export function generarRuta(
  criterios: CriteriosRuta,
  todosLosNegocios: Business[],
  gustosUsuario: string[] = []
): Ruta {
  const horaInicioStr = criterios.horaInicio || '11:00';
  let minutoActual = minutosDesdeMedianoche(horaInicioStr);
  const mensajesRelajacion: string[] = [];

  // Paso 1: Solo negocios aprobados
  let pool = todosLosNegocios.filter((b) => b.estado === 'aprobado');

  // Si no hay aprobados suficientes, fallback de emergencia
  if (pool.length === 0) {
    pool = todosLosNegocios;
    mensajesRelajacion.push('Se incluyeron puestos en proceso de verificación por falta de opciones.');
  }

  // Paso 2: Filtro inicial estricto de presupuesto
  const maxPrecioSegunPresupuesto = (p?: string) => {
    switch (p) {
      case 'BARATO':
        return 12;
      case 'MEDIO':
        return 22;
      case 'CARO':
        return 999;
      default:
        return 999;
    }
  };

  let candidatos = pool.filter((b) => b.price <= maxPrecioSegunPresupuesto(criterios.presupuesto));

  // Si no alcanzamos los 4 pasos, relajar filtro de presupuesto
  if (candidatos.length < PASOS && criterios.presupuesto && criterios.presupuesto !== 'TODOS') {
    candidatos = pool;
    mensajesRelajacion.push(
      'Se relajó el presupuesto para asegurar una ruta variada de 4 paradas recomendadas.'
    );
  }

  // Si aún faltan candidatos por alguna razón
  if (candidatos.length < PASOS) {
    candidatos = pool;
  }

  // Paso 3: Puntuación (Rating + Verificado + Gustos + Confianza)
  const gustosSet = new Set([...gustosUsuario, ...(criterios.gustosSeleccionados || [])]);

  const scored = candidatos.map((b) => {
    let score = (b.rating || 4.2) * 15;
    if (b.verified) score += 15;
    score += (b.confidence || 80) * 0.1;

    // Bonificación si coincide con algún gusto
    const tieneGusto =
      gustosSet.has(b.category.toLowerCase()) ||
      b.tags.some((t) => gustosSet.has(t.toLowerCase())) ||
      gustosSet.has(b.product.toLowerCase());

    if (tieneGusto) score += 25;

    // Bonificación si coincide con la categoría preferida
    if (criterios.categoriaPreferida && b.category.toLowerCase().includes(criterios.categoriaPreferida.toLowerCase())) {
      score += 20;
    }

    return { business: b, score };
  });

  // Ordenar por score descendente
  scored.sort((a, b) => b.score - a.score);

  // Tomamos los mejores candidatos (hasta 8 para tener variedad)
  const mejoresNegocios = scored.slice(0, Math.max(8, PASOS)).map((s) => s.business);

  // Paso 4: Ordenamiento por Vecino Más Cercano (Nearest Neighbor TSP)
  const paradasOrdenadas: Business[] = [];
  const disponibles = [...mejoresNegocios];

  // El primer negocio es el de más alto puntaje
  const primerLugar = disponibles.shift() || pool[0];
  paradasOrdenadas.push(primerLugar);

  while (paradasOrdenadas.length < PASOS && disponibles.length > 0) {
    const ultimo = paradasOrdenadas[paradasOrdenadas.length - 1];
    let indiceMasCercano = 0;
    let menorDistancia = Infinity;

    for (let i = 0; i < disponibles.length; i++) {
      const dist = calcularDistanciaKm(
        ultimo.latitude,
        ultimo.longitude,
        disponibles[i].latitude,
        disponibles[i].longitude
      );
      if (dist < menorDistancia) {
        menorDistancia = dist;
        indiceMasCercano = i;
      }
    }

    paradasOrdenadas.push(disponibles.splice(indiceMasCercano, 1)[0]);
  }

  // Paso 5: Cálculo de Tiempos, Horarios y Validación
  const advertenciasHorario: string[] = [];
  const paradasFinales: ParadaRuta[] = [];
  let distanciaTotal = 0;
  let costoTotal = 0;

  for (let i = 0; i < paradasOrdenadas.length; i++) {
    const b = paradasOrdenadas[i];
    costoTotal += b.price;

    let dist = 0;
    let trasladoMinutos = 0;

    if (i > 0) {
      const prev = paradasOrdenadas[i - 1];
      dist = calcularDistanciaKm(prev.latitude, prev.longitude, b.latitude, b.longitude);
      distanciaTotal += dist;

      // Velocidades estimadas según medio de transporte
      if (criterios.transporte === 'AUTO') {
        trasladoMinutos = Math.max(5, Math.round(dist * 4)); // ~15 km/h tráfico centro
      } else if (criterios.transporte === 'MOTO') {
        trasladoMinutos = Math.max(4, Math.round(dist * 3));
      } else {
        trasladoMinutos = Math.max(5, Math.round(dist * 12)); // Caminando a ~5 km/h
      }
    }

    minutoActual += trasladoMinutos;
    const horaLlegada = minutosAHora(minutoActual);

    // Tiempo de estancia según categoría
    let estanciaMinutos = 40;
    if (b.category === 'Gastronomía') estanciaMinutos = 50;
    if (b.category === 'Bebidas' || b.category === 'Chifles / Snacks') estanciaMinutos = 25;
    if (b.category === 'Artesanías') estanciaMinutos = 35;

    const horaSalida = minutosAHora(minutoActual + estanciaMinutos);

    // Validar si está abierto en el horario de visita
    const abierto = estaAbiertoEnMinutos(b, minutoActual);
    let alerta: string | undefined = undefined;

    if (!abierto) {
      alerta = `${b.name} podría estar cerrado a las ${horaLlegada} (Horario: ${b.openingHours})`;
      advertenciasHorario.push(alerta);
    }

    paradasFinales.push({
      paso: i + 1,
      business: b,
      horaLlegada,
      horaSalida,
      minutosEstancia: estanciaMinutos,
      minutosTraslado: trasladoMinutos,
      distanciaDesdeAnteriorKm: dist,
      estaAbierto: abierto,
      alertaHorario: alerta,
    });

    minutoActual += estanciaMinutos;
  }

  const duracionTotal = minutoActual - minutosDesdeMedianoche(horaInicioStr);

  return {
    id: `ruta-${Date.now()}`,
    nombre: `Ruta Piura Sabores & Tradición (${criterios.presupuesto || 'Variada'})`,
    fechaCreacion: new Date().toISOString(),
    paradas: paradasFinales,
    duracionTotalMinutos: duracionTotal,
    costoEstimadoTotal: costoTotal,
    distanciaTotalKm: parseFloat(distanciaTotal.toFixed(2)),
    mensajesRelajacion,
    advertenciasHorario,
  };
}

// -------------------------------------------------------------
// Función para recalcular horarios al reordenar o cambiar paradas
// -------------------------------------------------------------

export function recalcularItinerarioRuta(
  paradas: ParadaRuta[],
  horaInicio: string = '11:00',
  transporte: 'PIE' | 'MOTO' | 'AUTO' = 'PIE'
): { paradas: ParadaRuta[]; duracionTotal: number; advertencias: string[] } {
  let minutoActual = minutosDesdeMedianoche(horaInicio);
  const advertencias: string[] = [];

  const actualizadas: ParadaRuta[] = paradas.map((p, idx) => {
    let dist = 0;
    let trasladoMin = 0;

    if (idx > 0) {
      const ant = paradas[idx - 1].business;
      dist = calcularDistanciaKm(ant.latitude, ant.longitude, p.business.latitude, p.business.longitude);
      if (transporte === 'AUTO') trasladoMin = Math.max(5, Math.round(dist * 4));
      else if (transporte === 'MOTO') trasladoMin = Math.max(4, Math.round(dist * 3));
      else trasladoMin = Math.max(5, Math.round(dist * 12));
    }

    minutoActual += trasladoMin;
    const horaLlegada = minutosAHora(minutoActual);
    const estancia = p.minutosEstancia || 40;
    const horaSalida = minutosAHora(minutoActual + estancia);

    const abierto = estaAbiertoEnMinutos(p.business, minutoActual);
    let alerta: string | undefined = undefined;

    if (!abierto) {
      alerta = `${p.business.name} estará cerrado a las ${horaLlegada} (${p.business.openingHours})`;
      advertencias.push(alerta);
    }

    minutoActual += estancia;

    return {
      ...p,
      paso: idx + 1,
      horaLlegada,
      horaSalida,
      minutosTraslado: trasladoMin,
      distanciaDesdeAnteriorKm: dist,
      estaAbierto: abierto,
      alertaHorario: alerta,
    };
  });

  return {
    paradas: actualizadas,
    duracionTotal: minutoActual - minutosDesdeMedianoche(horaInicio),
    advertencias,
  };
}
