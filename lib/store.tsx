// ==========================================
// PiuraRuta - Estado Global y Persistencia (lib/store.tsx)
// ==========================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { businesses, Business, normalizarNegocio } from '../data/businesses';
import { resenasIniciales, Resena } from '../data/index';
import { UsuarioSesion, createDemoUser } from './auth';
import { Ruta, ParadaRuta, recalcularItinerarioRuta } from './ruta';

const STORAGE_KEY = '@PIURA_RUTA_GLOBAL_STATE_V1';

export interface ReporteItem {
  id: string;
  businessId: number;
  motivo: string;
  detalle: string;
  fecha: string;
}

export interface AppStateData {
  usuario: UsuarioSesion | null;
  gustos: string[];           // IDs de gustos seleccionados
  favoritos: number[];        // IDs de negocios favoritos
  negocios: Business[];       // Lista de negocios (aprobados y en evaluación)
  rutaActiva: Ruta | null;    // Ruta en curso
  rutasGuardadas: Ruta[];     // Historial de rutas
  resenas: Record<number, Resena[]>; // Reseñas organizadas por businessId
  reportes: ReporteItem[];    // Reportes enviados localmente
}

interface StoreContextType extends AppStateData {
  isLoaded: boolean;
  setUsuario: (user: UsuarioSesion | null) => void;
  toggleGusto: (gustoId: string) => void;
  setGustos: (gustos: string[]) => void;
  toggleFavorito: (businessId: number) => void;
  esFavorito: (businessId: number) => boolean;
  agregarNegocio: (nuevo: Omit<Business, 'id' | 'estado'>) => Business;
  agregarResena: (businessId: number, calificacion: number, comentario: string) => void;
  obtenerResenas: (businessId: number) => Resena[];
  agregarReporte: (businessId: number, motivo: string, detalle: string) => void;
  setRutaActiva: (ruta: Ruta | null) => void;
  guardarRuta: (ruta: Ruta) => void;
  eliminarRutaGuardada: (rutaId: string) => void;
  actualizarParadasRutaActiva: (
    paradas: ParadaRuta[],
    horaInicio?: string,
    transporte?: 'PIE' | 'MOTO' | 'AUTO'
  ) => void;
  limpiarTodo: () => Promise<void>;
}

// Convertir array inicial de reseñas a un mapa por businessId
const mapaResenasInicial: Record<number, Resena[]> = {};
for (const r of resenasIniciales) {
  if (!mapaResenasInicial[r.businessId]) {
    mapaResenasInicial[r.businessId] = [];
  }
  mapaResenasInicial[r.businessId].push(r);
}

const defaultState: AppStateData = {
  usuario: null,
  gustos: ['ceviche', 'chifles'],
  favoritos: [1, 4],
  negocios: businesses,
  rutaActiva: null,
  rutasGuardadas: [],
  resenas: mapaResenasInicial,
  reportes: [],
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppStateData>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Cargar estado de AsyncStorage al iniciar la app
  useEffect(() => {
    let montado = true;

    async function cargarEstado() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && montado) {
          const parsed = JSON.parse(raw);
          // Mezclar con defaultState para garantizar integridad de llaves
          setState((prev) => ({
            ...prev,
            ...parsed,
            // Asegurar que los negocios base siempre estén disponibles
            negocios:
              parsed.negocios && parsed.negocios.length >= businesses.length
                ? parsed.negocios.map(normalizarNegocio)
                : businesses,
          }));
        }
      } catch (err) {
        console.error('Error cargando estado de AsyncStorage:', err);
      } finally {
        if (montado) {
          // CRÍTICO: Marcamos isLoaded = true SOLO DESPUÉS de haber leído
          setIsLoaded(true);
        }
      }
    }

    cargarEstado();

    return () => {
      montado = false;
    };
  }, []);

  // 2. Guardar estado automáticamente en AsyncStorage en cada cambio
  // CRÍTICO: SOLO después de que isLoaded sea true, para evitar que el estado inicial pise el guardado
  useEffect(() => {
    if (!isLoaded) return;

    async function guardarEstado() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Error guardando estado en AsyncStorage:', err);
      }
    }

    guardarEstado();
  }, [state, isLoaded]);

  // Acciones
  const setUsuario = useCallback((usuario: UsuarioSesion | null) => {
    setState((prev) => ({ ...prev, usuario }));
  }, []);

  const toggleGusto = useCallback((gustoId: string) => {
    setState((prev) => {
      const existe = prev.gustos.includes(gustoId);
      const nuevos = existe
        ? prev.gustos.filter((g) => g !== gustoId)
        : [...prev.gustos, gustoId];
      return { ...prev, gustos: nuevos };
    });
  }, []);

  const setGustos = useCallback((gustos: string[]) => {
    setState((prev) => ({ ...prev, gustos }));
  }, []);

  const toggleFavorito = useCallback((businessId: number) => {
    setState((prev) => {
      const existe = prev.favoritos.includes(businessId);
      const nuevos = existe
        ? prev.favoritos.filter((id) => id !== businessId)
        : [...prev.favoritos, businessId];
      return { ...prev, favoritos: nuevos };
    });
  }, []);

  const esFavorito = useCallback(
    (businessId: number) => state.favoritos.includes(businessId),
    [state.favoritos]
  );

  const agregarNegocio = useCallback(
    (nuevo: Omit<Business, 'id' | 'estado'>): Business => {
      const nuevoId =
        state.negocios.length > 0
          ? Math.max(...state.negocios.map((b) => b.id)) + 1
          : 100;

      const negocioCompleto = normalizarNegocio({
        ...nuevo,
        id: nuevoId,
        estado: 'evaluacion', // ¡Siempre entra en evaluación!
      });

      setState((prev) => ({
        ...prev,
        negocios: [negocioCompleto, ...prev.negocios],
      }));

      return negocioCompleto;
    },
    [state.negocios]
  );

  const agregarResena = useCallback(
    (businessId: number, calificacion: number, comentario: string) => {
      const autor = state.usuario?.nombre || 'Turista Anónimo';
      const nuevaResena: Resena = {
        id: `res-${Date.now()}`,
        businessId,
        autor,
        calificacion,
        comentario,
        fecha: new Date().toISOString().split('T')[0],
      };

      setState((prev) => {
        const anteriores = prev.resenas[businessId] || [];
        return {
          ...prev,
          resenas: {
            ...prev.resenas,
            [businessId]: [nuevaResena, ...anteriores],
          },
        };
      });
    },
    [state.usuario]
  );

  const obtenerResenas = useCallback(
    (businessId: number): Resena[] => {
      return state.resenas[businessId] || [];
    },
    [state.resenas]
  );

  const agregarReporte = useCallback(
    (businessId: number, motivo: string, detalle: string) => {
      const nuevoReporte: ReporteItem = {
        id: `rep-${Date.now()}`,
        businessId,
        motivo,
        detalle,
        fecha: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        reportes: [nuevoReporte, ...prev.reportes],
      }));
    },
    []
  );

  const setRutaActiva = useCallback((rutaActiva: Ruta | null) => {
    setState((prev) => ({ ...prev, rutaActiva }));
  }, []);

  const guardarRuta = useCallback((ruta: Ruta) => {
    setState((prev) => {
      const existe = prev.rutasGuardadas.some((r) => r.id === ruta.id);
      const actualizadas = existe
        ? prev.rutasGuardadas.map((r) => (r.id === ruta.id ? ruta : r))
        : [ruta, ...prev.rutasGuardadas];
      return { ...prev, rutasGuardadas: actualizadas };
    });
  }, []);

  const eliminarRutaGuardada = useCallback((rutaId: string) => {
    setState((prev) => ({
      ...prev,
      rutasGuardadas: prev.rutasGuardadas.filter((r) => r.id !== rutaId),
    }));
  }, []);

  const actualizarParadasRutaActiva = useCallback(
    (
      paradas: ParadaRuta[],
      horaInicio?: string,
      transporte?: 'PIE' | 'MOTO' | 'AUTO'
    ) => {
      setState((prev) => {
        if (!prev.rutaActiva) return prev;
        const re = recalcularItinerarioRuta(
          paradas,
          horaInicio || prev.rutaActiva.paradas[0]?.horaLlegada || '11:00',
          transporte || 'PIE'
        );

        const nuevaRuta: Ruta = {
          ...prev.rutaActiva,
          paradas: re.paradas,
          duracionTotalMinutos: re.duracionTotal,
          costoEstimadoTotal: re.paradas.reduce((acc, p) => acc + p.business.price, 0),
          advertenciasHorario: re.advertencias,
        };

        return {
          ...prev,
          rutaActiva: nuevaRuta,
        };
      });
    },
    []
  );

  const limpiarTodo = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setIsLoaded(true);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        isLoaded,
        setUsuario,
        toggleGusto,
        setGustos,
        toggleFavorito,
        esFavorito,
        agregarNegocio,
        agregarResena,
        obtenerResenas,
        agregarReporte,
        setRutaActiva,
        guardarRuta,
        eliminarRutaGuardada,
        actualizarParadasRutaActiva,
        limpiarTodo,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useApp() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un StoreProvider');
  }
  return context;
}
