// ==========================================
// PiuraRuta - Chat Cuestionario Asistente (ChatRuta.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../lib/store';
import { generarRuta, Ruta, CriteriosRuta, PASOS } from '../lib/ruta';
import { C } from '../lib/theme';

interface MensajeChat {
  id: string;
  remitente: 'bot' | 'usuario';
  texto: string;
  opciones?: { label: string; valor: any }[];
  rutaGenerada?: Ruta;
}

interface ChatRutaProps {
  onVerRutaCompleta?: (ruta: Ruta) => void;
}

export default function ChatRuta({ onVerRutaCompleta }: ChatRutaProps) {
  const { negocios, gustos, setRutaActiva } = useApp();

  const [pasoActual, setPasoActual] = useState(1);
  const [criterios, setCriterios] = useState<CriteriosRuta>({
    tiempoMinutos: 180,
    presupuesto: 'MEDIO',
    categoriaPreferida: 'Gastronomía',
    transporte: 'PIE',
    horaInicio: '11:00',
  });
  const [cargandoRuta, setCargandoRuta] = useState(false);

  // Historial de mensajes en el chat
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: 'msg-1',
      remitente: 'bot',
      texto:
        '¡Hola! Soy tu asistente de PiuraRuta 🌞. Te armaré una ruta personalizada de 4 paradas tradicionales. Primero: ¿Cuánto tiempo tienes disponible hoy?',
      opciones: [
        { label: '⚡ 2 horas (Ruta Express)', valor: 120 },
        { label: '☀️ 3 a 4 horas (Recomendado)', valor: 210 },
        { label: '🌴 Todo el día (Paseo Completo)', valor: 360 },
      ],
    },
  ]);

  const responderPregunta = (opcion: { label: string; valor: any }) => {
    // 1. Agregar respuesta del usuario
    const nuevoMensajeUsuario: MensajeChat = {
      id: `usr-${Date.now()}`,
      remitente: 'usuario',
      texto: opcion.label,
    };

    // Actualizar criterios según el paso
    let nuevosCriterios = { ...criterios };

    if (pasoActual === 1) {
      nuevosCriterios.tiempoMinutos = opcion.valor;
      setCriterios(nuevosCriterios);
      setPasoActual(2);

      const siguientePregunta: MensajeChat = {
        id: `bot-2`,
        remitente: 'bot',
        texto:
          '¡Perfecto! Ahora dime, ¿cuál es tu presupuesto aproximado por parada?',
        opciones: [
          { label: '🟢 Económico (S/5 - S/12)', valor: 'BARATO' },
          { label: '🟡 Medio (S/13 - S/22)', valor: 'MEDIO' },
          { label: '🔴 Sin límite / Darse un gusto', valor: 'CARO' },
        ],
      };
      setMensajes((prev) => [...prev, nuevoMensajeUsuario, siguientePregunta]);
    } else if (pasoActual === 2) {
      nuevosCriterios.presupuesto = opcion.valor;
      setCriterios(nuevosCriterios);
      setPasoActual(3);

      const siguientePregunta: MensajeChat = {
        id: `bot-3`,
        remitente: 'bot',
        texto: '¿Qué tipo de experiencia se te antoja priorizar hoy?',
        opciones: [
          { label: '🍛 Gastronomía típica (Ceviche / Seco)', valor: 'Gastronomía' },
          { label: '🥨 Chifles y snacks tradicionales', valor: 'Chifles / Snacks' },
          { label: '🏺 Artesanías y recuerdos de Catacaos', valor: 'Artesanías' },
          { label: '🍹 Jugos y algarrobina bien helada', valor: 'Bebidas' },
        ],
      };
      setMensajes((prev) => [...prev, nuevoMensajeUsuario, siguientePregunta]);
    } else if (pasoActual === 3) {
      nuevosCriterios.categoriaPreferida = opcion.valor;
      setCriterios(nuevosCriterios);
      setPasoActual(4);

      const siguientePregunta: MensajeChat = {
        id: `bot-4`,
        remitente: 'bot',
        texto: 'Por último: ¿Cómo prefieres desplazarte entre cada parada?',
        opciones: [
          { label: '🚶 Caminando (Paseo a pie)', valor: 'PIE' },
          { label: '🛺 En mototaxi piurano', valor: 'MOTO' },
          { label: '🚖 En taxi / auto', valor: 'AUTO' },
        ],
      };
      setMensajes((prev) => [...prev, nuevoMensajeUsuario, siguientePregunta]);
    } else if (pasoActual === 4) {
      nuevosCriterios.transporte = opcion.valor;
      setCriterios(nuevosCriterios);
      setPasoActual(5);

      setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
      setCargandoRuta(true);

      // Generar ruta calculada con PASOS = 4
      setTimeout(() => {
        const ruta = generarRuta(nuevosCriterios, negocios, gustos);
        setRutaActiva(ruta);

        const mensajeResultado: MensajeChat = {
          id: `bot-5`,
          remitente: 'bot',
          texto: `¡Listo! He diseñado tu itinerario de ${PASOS} paradas optimizado por cercanía geográfica.`,
          rutaGenerada: ruta,
        };

        setMensajes((prev) => [...prev, mensajeResultado]);
        setCargandoRuta(false);
      }, 600);
    }
  };

  const reiniciarChat = () => {
    setPasoActual(1);
    setCriterios({
      tiempoMinutos: 180,
      presupuesto: 'MEDIO',
      categoriaPreferida: 'Gastronomía',
      transporte: 'PIE',
      horaInicio: '11:00',
    });
    setMensajes([
      {
        id: 'msg-1',
        remitente: 'bot',
        texto:
          '¡Hola de nuevo! Vamos a crear una nueva ruta de 4 pasos. ¿Cuánto tiempo tienes disponible hoy?',
        opciones: [
          { label: '⚡ 2 horas (Ruta Express)', valor: 120 },
          { label: '☀️ 3 a 4 horas (Recomendado)', valor: 210 },
          { label: '🌴 Todo el día (Paseo Completo)', valor: 360 },
        ],
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.chatScroll}
        showsVerticalScrollIndicator={false}
      >
        {mensajes.map((msg, index) => {
          const esBot = msg.remitente === 'bot';
          const esUltimo = index === mensajes.length - 1;

          return (
            <View key={msg.id} style={styles.messageWrapper}>
              {/* Burbuja del mensaje */}
              <View
                style={[
                  styles.bubble,
                  esBot ? styles.botBubble : styles.userBubble,
                ]}
              >
                {esBot && (
                  <View style={styles.botAvatar}>
                    <Text style={styles.botAvatarText}>PR</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    esBot ? styles.botText : styles.userText,
                  ]}
                >
                  {msg.texto}
                </Text>
              </View>

              {/* Tarjeta de Ruta Generada */}
              {msg.rutaGenerada && (
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{msg.rutaGenerada.nombre}</Text>
                    <Text style={styles.resultSub}>
                      {PASOS} Paradas • S/{msg.rutaGenerada.costoEstimadoTotal} •{' '}
                      {Math.round(msg.rutaGenerada.duracionTotalMinutos / 60)}h{' '}
                      {msg.rutaGenerada.duracionTotalMinutos % 60}m aprox.
                    </Text>
                  </View>

                  {/* Avisos de relajación si los hubo */}
                  {msg.rutaGenerada.mensajesRelajacion.length > 0 && (
                    <View style={styles.noticeBox}>
                      <Text style={styles.noticeText}>
                        💡 {msg.rutaGenerada.mensajesRelajacion[0]}
                      </Text>
                    </View>
                  )}

                  {/* Lista de las 4 paradas */}
                  <View style={styles.stopsList}>
                    {msg.rutaGenerada.paradas.map((p) => (
                      <View key={p.paso} style={styles.stopRow}>
                        <View style={styles.stopNumberBadge}>
                          <Text style={styles.stopNumberText}>{p.paso}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.stopName}>{p.business.name}</Text>
                          <Text style={styles.stopDetail}>
                            {p.horaLlegada} - {p.horaSalida} • {p.business.product}
                          </Text>
                        </View>
                        <Text style={styles.stopPrice}>S/{p.business.price}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Botones de acción de la ruta generada */}
                  <TouchableOpacity
                    style={styles.openEditorBtn}
                    onPress={() => {
                      if (onVerRutaCompleta && msg.rutaGenerada) {
                        onVerRutaCompleta(msg.rutaGenerada);
                      }
                    }}
                  >
                    <Text style={styles.openEditorBtnText}>
                      🧭 Ver y Editar Ruta Completa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.restartBtn}
                    onPress={reiniciarChat}
                  >
                    <Text style={styles.restartBtnText}>
                      🔄 Probar otras preferencias
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Opciones interactivas si es el último mensaje y tiene opciones */}
              {esUltimo && msg.opciones && (
                <View style={styles.optionsContainer}>
                  {msg.opciones.map((op, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.optionBtn}
                      onPress={() => responderPregunta(op)}
                    >
                      <Text style={styles.optionBtnText}>{op.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {cargandoRuta && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={C.primary} />
            <Text style={styles.loadingText}>
              Buscando los mejores puestos y armando tus 4 pasos...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 30,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  bubble: {
    maxWidth: '86%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },
  botBubble: {
    backgroundColor: C.card,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: C.borderLight,
    ...C.shadowSm,
  },
  userBubble: {
    backgroundColor: C.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  botAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.primaryDark,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: C.textPrimary,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 10,
    paddingLeft: 4,
    gap: 8,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: C.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  optionBtnText: {
    color: C.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: C.card,
    padding: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  loadingText: {
    fontSize: 12,
    color: C.textSecondary,
    fontStyle: 'italic',
  },
  resultCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: C.primary,
    ...C.shadowMd,
  },
  resultHeader: {
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    paddingBottom: 10,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
  },
  resultSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 3,
  },
  noticeBox: {
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '500',
  },
  stopsList: {
    gap: 8,
    marginBottom: 14,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    padding: 8,
    borderRadius: 10,
  },
  stopNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  stopDetail: {
    fontSize: 11,
    color: C.textSecondary,
  },
  stopPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: C.primaryDark,
  },
  openEditorBtn: {
    backgroundColor: C.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  openEditorBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  restartBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  restartBtnText: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
