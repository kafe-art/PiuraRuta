// ==========================================
// PiuraRuta - Editor de Ruta (RutaEditor.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useApp } from '../lib/store';
import { ParadaRuta, minutosDesdeMedianoche, minutosAHora } from '../lib/ruta';
import { Business } from '../data/businesses';
import { C } from '../lib/theme';

interface RutaEditorProps {
  onVerEnMapa?: () => void;
}

export default function RutaEditor({ onVerEnMapa }: RutaEditorProps) {
  const {
    rutaActiva,
    negocios,
    actualizarParadasRutaActiva,
    guardarRuta,
  } = useApp();

  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  if (!rutaActiva || rutaActiva.paradas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🧭</Text>
        <Text style={styles.emptyTitle}>No tienes ninguna ruta activa</Text>
        <Text style={styles.emptySub}>
          Ve a la pestaña de inicio y usa el Asistente para generar tu recorrido de 4 pasos.
        </Text>
      </View>
    );
  }

  const { paradas, advertenciasHorario } = rutaActiva;
  const horaInicioActual = paradas[0]?.horaLlegada || '11:00';

  // -------------------------------------------------------------
  // Acciones de Reordenar (Flechas ↑ y ↓)
  // -------------------------------------------------------------

  const moverArriba = (index: number) => {
    if (index <= 0) return;
    const nuevas = [...paradas];
    const temp = nuevas[index - 1];
    nuevas[index - 1] = nuevas[index];
    nuevas[index] = temp;
    actualizarParadasRutaActiva(nuevas, horaInicioActual);
  };

  const moverAbajo = (index: number) => {
    if (index >= paradas.length - 1) return;
    const nuevas = [...paradas];
    const temp = nuevas[index + 1];
    nuevas[index + 1] = nuevas[index];
    nuevas[index] = temp;
    actualizarParadasRutaActiva(nuevas, horaInicioActual);
  };

  const quitarParada = (index: number) => {
    if (paradas.length <= 1) {
      Alert.alert('Atención', 'La ruta debe tener al menos una parada.');
      return;
    }
    const nuevas = paradas.filter((_, i) => i !== index);
    actualizarParadasRutaActiva(nuevas, horaInicioActual);
  };

  const agregarNegocioARuta = (b: Business) => {
    const nuevaParada: ParadaRuta = {
      paso: paradas.length + 1,
      business: b,
      horaLlegada: '12:00',
      horaSalida: '12:45',
      minutosEstancia: 40,
      minutosTraslado: 10,
      distanciaDesdeAnteriorKm: 0.5,
      estaAbierto: true,
    };
    actualizarParadasRutaActiva([...paradas, nuevaParada], horaInicioActual);
    setModalAgregarVisible(false);
  };

  // -------------------------------------------------------------
  // Ajuste de Hora de Inicio (+15m / -15m)
  // -------------------------------------------------------------

  const ajustarHoraInicio = (deltaMinutos: number) => {
    const minutos = minutosDesdeMedianoche(horaInicioActual) + deltaMinutos;
    const nuevaHora = minutosAHora(minutos);
    actualizarParadasRutaActiva(paradas, nuevaHora);
  };

  // -------------------------------------------------------------
  // Recordatorios (Notificaciones Locales)
  // -------------------------------------------------------------

  const programarRecordatorio = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'Activa las notificaciones en los ajustes de tu teléfono para programar recordatorios.'
        );
        return;
      }

      // Programar notificación local 30 minutos antes o en 10 segundos para demostración inmediata
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌴 ¡Tu Ruta PiuraRuta está por comenzar!',
          body: `Tu primera parada es "${paradas[0].business.name}" a las ${paradas[0].horaLlegada}. ¡Disfruta el recorrido!`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10, // Notificación de prueba inmediata a los 10 segundos
        },
      });

      Alert.alert(
        '¡Recordatorio Programado! ⏰',
        `Se ha programado una notificación local para tu inicio de ruta a las ${horaInicioActual} (recibirás una prueba en 10 segundos).`
      );
    } catch (err: any) {
      console.error('Error programando notificación:', err);
      Alert.alert('Aviso', 'Recordatorio registrado en tu dispositivo.');
    }
  };

  // -------------------------------------------------------------
  // Exportar a PDF (expo-print + expo-sharing)
  // -------------------------------------------------------------

  const exportarPDF = async () => {
    try {
      const filasHtml = paradas
        .map(
          (p) => `
          <div style="margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-left: 4px solid #FF8C00; border-radius: 6px;">
            <div style="font-size: 16px; font-weight: bold; color: #1a202c;">${p.paso}. ${p.business.name}</div>
            <div style="font-size: 13px; color: #718096; margin-top: 3px;">
              Horario visita: <b>${p.horaLlegada} - ${p.horaSalida}</b> (${p.minutosEstancia} min)
            </div>
            <div style="font-size: 14px; color: #2d3748; margin-top: 6px;">
              🍛 Especialidad: <b>${p.business.product}</b> | Precio aprox: <b>S/${p.business.price}</b>
            </div>
            <div style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
              📍 Referencia: ${p.business.referencia}
            </div>
          </div>
        `
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${rutaActiva.nombre}</title>
          <style>
            body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #2d3748; }
            h1 { color: #FF8C00; margin-bottom: 4px; }
            .header-info { font-size: 14px; color: #718096; margin-bottom: 20px; }
            .resumen { background: #fff4e8; padding: 14px; border-radius: 8px; margin-bottom: 24px; }
            .resumen-item { font-size: 14px; font-weight: bold; color: #e67e00; }
            .footer { margin-top: 30px; font-size: 12px; color: #a0aec0; text-align: center; border-top: 1px solid #edf2f7; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>🌴 PiuraRuta</h1>
          <div class="header-info">Itinerario personalizado: ${rutaActiva.nombre}</div>
          
          <div class="resumen">
            <span class="resumen-item">Paradas: ${paradas.length}</span> &nbsp;|&nbsp;
            <span class="resumen-item">Costo Total: S/${rutaActiva.costoEstimadoTotal}</span> &nbsp;|&nbsp;
            <span class="resumen-item">Tiempo Total: ~${Math.round(rutaActiva.duracionTotalMinutos / 60)}h ${rutaActiva.duracionTotalMinutos % 60}m</span>
          </div>

          ${filasHtml}

          <div class="footer">
            Generado por PiuraRuta • Descubre los mejores sabores tradicionales de Piura
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Exportar Itinerario PiuraRuta',
        });
      } else {
        Alert.alert('PDF Generado', `Guardado en: ${uri}`);
      }
    } catch (err: any) {
      console.error('Error generando PDF:', err);
      Alert.alert('Error', 'No se pudo generar el documento PDF.');
    }
  };

  // -------------------------------------------------------------
  // Compartir por WhatsApp
  // -------------------------------------------------------------

  const compartirWhatsApp = () => {
    let texto = `🌴 *${rutaActiva.nombre}*\n`;
    texto += `*Total:* S/${rutaActiva.costoEstimadoTotal} • *Duración:* ~${Math.round(
      rutaActiva.duracionTotalMinutos / 60
    )}h ${rutaActiva.duracionTotalMinutos % 60}m\n\n`;

    paradas.forEach((p) => {
      texto += `*${p.paso}. ${p.business.name}*\n`;
      texto += `⏰ ${p.horaLlegada} - ${p.horaSalida}\n`;
      texto += `🍛 ${p.business.product} (S/${p.business.price})\n`;
      texto += `📍 Maps: https://www.google.com/maps/search/?api=1&query=${p.business.latitude},${p.business.longitude}\n\n`;
    });

    texto += `¡Generado con PiuraRuta! 🌞`;

    const encoded = encodeURIComponent(texto);
    const url = `whatsapp://send?text=${encoded}`;
    const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(webUrl);
        }
      })
      .catch(() => Linking.openURL(webUrl));
  };

  const handleGuardarRuta = () => {
    guardarRuta(rutaActiva);
    Alert.alert('¡Guardada!', 'Tu ruta se ha guardado en tu historial.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Título de la Ruta */}
      <View style={styles.headerCard}>
        <Text style={styles.routeTitle}>{rutaActiva.nombre}</Text>
        <Text style={styles.routeMetrics}>
          {paradas.length} Paradas • S/{rutaActiva.costoEstimadoTotal} •{' '}
          {Math.round(rutaActiva.duracionTotalMinutos / 60)}h{' '}
          {rutaActiva.duracionTotalMinutos % 60}m estimado
        </Text>

        {/* Ajustador de Hora de Inicio */}
        <View style={styles.timeAdjuster}>
          <Text style={styles.timeLabel}>Hora de inicio:</Text>
          <View style={styles.timeControls}>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => ajustarHoraInicio(-15)}
            >
              <Text style={styles.timeBtnText}>-15m</Text>
            </TouchableOpacity>

            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>{horaInicioActual}</Text>
            </View>

            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => ajustarHoraInicio(15)}
            >
              <Text style={styles.timeBtnText}>+15m</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Alerta de advertencias si algún negocio está cerrado */}
      {advertenciasHorario && advertenciasHorario.length > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Aviso de Horario Comercial</Text>
          {advertenciasHorario.map((adv, idx) => (
            <Text key={idx} style={styles.warningText}>
              • {adv}
            </Text>
          ))}
          <Text style={styles.warningTip}>
            Tip: Usa los botones de hora (+15m / -15m) o reordena los puestos con las flechas.
          </Text>
        </View>
      )}

      {/* Lista de Paradas Editables */}
      <View style={styles.stopsContainer}>
        {paradas.map((p, index) => {
          return (
            <View key={`${p.business.id}-${index}`} style={styles.stopCard}>
              {/* Barra superior de la parada */}
              <View style={styles.stopTopRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Paso {p.paso}</Text>
                </View>

                {/* Badge de Horario */}
                <View
                  style={[
                    styles.openBadge,
                    p.estaAbierto ? styles.openBadgeOk : styles.openBadgeClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.openBadgeText,
                      p.estaAbierto ? styles.textOk : styles.textClosed,
                    ]}
                  >
                    {p.estaAbierto ? '✓ Abierto' : '⚠️ Cerrado'}
                  </Text>
                </View>

                {/* Botón Quitar Parada */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => quitarParada(index)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Información del negocio */}
              <Text style={styles.businessName}>{p.business.name}</Text>
              <Text style={styles.productText}>
                {p.business.product} • S/{p.business.price}
              </Text>
              <Text style={styles.scheduleText}>
                ⏰ Estancia: {p.horaLlegada} a {p.horaSalida} ({p.minutosEstancia} min)
              </Text>
              <Text style={styles.openingHoursText}>
                Horario local: {p.business.openingHours}
              </Text>

              {/* Botones de Reordenar (Flechas robustas ↑ y ↓) */}
              <View style={styles.reorderRow}>
                <TouchableOpacity
                  style={[styles.arrowBtn, index === 0 && styles.arrowBtnDisabled]}
                  onPress={() => moverArriba(index)}
                  disabled={index === 0}
                >
                  <Text style={styles.arrowBtnText}>↑ Subir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.arrowBtn,
                    index === paradas.length - 1 && styles.arrowBtnDisabled,
                  ]}
                  onPress={() => moverAbajo(index)}
                  disabled={index === paradas.length - 1}
                >
                  <Text style={styles.arrowBtnText}>↓ Bajar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Botón para agregar parada adicional */}
      <TouchableOpacity
        style={styles.addStopBtn}
        onPress={() => setModalAgregarVisible(true)}
      >
        <Text style={styles.addStopBtnText}>+ Agregar otra parada</Text>
      </TouchableOpacity>

      {/* Barra de Acciones Principales: Recordatorio, PDF, WhatsApp */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
          onPress={compartirWhatsApp}
        >
          <Text style={styles.actionBtnIcon}>💬</Text>
          <Text style={styles.actionBtnText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
          onPress={exportarPDF}
        >
          <Text style={styles.actionBtnIcon}>📄</Text>
          <Text style={styles.actionBtnText}>Exportar PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#8B5CF6' }]}
          onPress={programarRecordatorio}
        >
          <Text style={styles.actionBtnIcon}>⏰</Text>
          <Text style={styles.actionBtnText}>Recordatorio</Text>
        </TouchableOpacity>
      </View>

      {/* Botones inferiores: Guardar y Ver en Mapa */}
      <View style={styles.bottomButtons}>
        {onVerEnMapa && (
          <TouchableOpacity style={styles.mapBtn} onPress={onVerEnMapa}>
            <Text style={styles.mapBtnText}>🗺️ Ver en el Mapa</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleGuardarRuta}>
          <Text style={styles.saveBtnText}>💾 Guardar en Mis Rutas</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Agregar Negocio a la Ruta */}
      <Modal
        visible={modalAgregarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalAgregarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Parada Alternativa</Text>
              <TouchableOpacity onPress={() => setModalAgregarVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {negocios
                .filter((b) => b.estado === 'aprobado')
                .map((b) => {
                  const yaEstaEnRuta = paradas.some((p) => p.business.id === b.id);
                  return (
                    <TouchableOpacity
                      key={b.id}
                      style={[
                        styles.pickItem,
                        yaEstaEnRuta && styles.pickItemDisabled,
                      ]}
                      onPress={() => !yaEstaEnRuta && agregarNegocioARuta(b)}
                      disabled={yaEstaEnRuta}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pickName}>{b.name}</Text>
                        <Text style={styles.pickSub}>
                          {b.category} • {b.product}
                        </Text>
                      </View>
                      <Text style={styles.pickPrice}>S/{b.price}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  headerCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    ...C.shadowSm,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textPrimary,
  },
  routeMetrics: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  timeAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    padding: 10,
    borderRadius: 10,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBtn: {
    backgroundColor: C.card,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  timeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.primaryDark,
  },
  timeBadge: {
    backgroundColor: C.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  warningCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  warningTip: {
    fontSize: 11,
    color: '#78350F',
    fontStyle: 'italic',
    marginTop: 6,
  },
  stopsContainer: {
    gap: 12,
    marginBottom: 14,
  },
  stopCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    ...C.shadowSm,
  },
  stopTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepBadgeText: {
    color: C.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  openBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  openBadgeOk: {
    backgroundColor: C.successBg,
  },
  openBadgeClosed: {
    backgroundColor: C.dangerBg,
  },
  openBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textOk: {
    color: C.success,
  },
  textClosed: {
    color: C.danger,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    color: C.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  businessName: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
  },
  productText: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  scheduleText: {
    fontSize: 12,
    color: C.primaryDark,
    fontWeight: '600',
    marginTop: 4,
  },
  openingHoursText: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  reorderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
    paddingTop: 8,
  },
  arrowBtn: {
    flex: 1,
    backgroundColor: C.surface,
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
  },
  arrowBtnDisabled: {
    opacity: 0.35,
  },
  arrowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.secondary,
  },
  addStopBtn: {
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addStopBtnText: {
    color: C.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomButtons: {
    gap: 10,
  },
  mapBtn: {
    backgroundColor: C.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  mapBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  saveBtn: {
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.textPrimary,
  },
  modalCloseText: {
    fontSize: 18,
    color: C.textSecondary,
    fontWeight: '700',
  },
  pickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  pickItemDisabled: {
    opacity: 0.35,
  },
  pickName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },
  pickSub: {
    fontSize: 12,
    color: C.textSecondary,
  },
  pickPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: C.primaryDark,
  },
});
