// ==========================================
// PiuraRuta - Hoja Inferior Detalle de Negocio (NegocioSheet.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Business } from '../data/businesses';
import { useApp } from '../lib/store';
import { estaAbiertoEnMinutos, minutosDesdeMedianoche } from '../lib/ruta';
import { C } from '../lib/theme';

interface NegocioSheetProps {
  business: Business | null;
  visible: boolean;
  onClose: () => void;
  onAgregarARuta?: (business: Business) => void;
}

const { height } = Dimensions.get('window');

export default function NegocioSheet({
  business,
  visible,
  onClose,
  onAgregarARuta,
}: NegocioSheetProps) {
  const {
    esFavorito,
    toggleFavorito,
    obtenerResenas,
    agregarResena,
    agregarReporte,
  } = useApp();

  const [tab, setTab] = useState<'info' | 'resenas' | 'reportar'>('info');

  // Estados para formulario de reseña
  const [estrellas, setEstrellas] = useState(5);
  const [comentarioResena, setComentarioResena] = useState('');

  // Estados para formulario de reporte
  const [motivoReporte, setMotivoReporte] = useState('Datos incorrectos');
  const [detalleReporte, setDetalleReporte] = useState('');

  if (!business) return null;

  const resenas = obtenerResenas(business.id);
  const fav = esFavorito(business.id);

  // Calcular si está abierto en este momento
  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const abiertoAhora = estaAbiertoEnMinutos(business, minutosAhora);

  const handleEnviarResena = () => {
    if (!comentarioResena.trim()) {
      Alert.alert('Atención', 'Por favor ingresa un comentario para tu reseña.');
      return;
    }
    agregarResena(business.id, estrellas, comentarioResena.trim());
    setComentarioResena('');
    setEstrellas(5);
    Alert.alert('¡Gracias!', 'Tu reseña ha sido guardada localmente.');
  };

  const handleEnviarReporte = () => {
    if (!detalleReporte.trim()) {
      Alert.alert('Atención', 'Por favor escribe el detalle de lo ocurrido.');
      return;
    }
    agregarReporte(business.id, motivoReporte, detalleReporte.trim());
    setDetalleReporte('');
    setTab('info');
    Alert.alert(
      'Reporte enviado',
      'Gracias por cuidar la comunidad. El reporte ha sido registrado localmente.'
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Manija deslizante superior */}
          <View style={styles.handleBar} />

          {/* Header con botón cerrar */}
          <View style={styles.header}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.businessTitle}>{business.name}</Text>
              <Text style={styles.businessCategory}>{business.category}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Badges de Estado */}
          <View style={styles.badgeRow}>
            {business.estado === 'evaluacion' ? (
              <View style={[styles.badge, styles.badgeEval]}>
                <Text style={styles.badgeEvalText}>⏳ En evaluación</Text>
              </View>
            ) : business.verified ? (
              <View style={[styles.badge, styles.badgeVerified]}>
                <Text style={styles.badgeVerifiedText}>✓ Mercado Seguro</Text>
              </View>
            ) : null}

            <View
              style={[
                styles.badge,
                abiertoAhora ? styles.badgeOpen : styles.badgeClosed,
              ]}
            >
              <Text
                style={[
                  styles.badgeStatusText,
                  abiertoAhora ? styles.textSuccess : styles.textDanger,
                ]}
              >
                {abiertoAhora ? '● Abierto ahora' : '○ Cerrado ahora'}
              </Text>
            </View>

            <View style={[styles.badge, styles.badgeRating]}>
              <Text style={styles.badgeRatingText}>⭐ {business.rating || 4.5}</Text>
            </View>
          </View>

          {/* Selector de Pestañas */}
          <View style={styles.tabNav}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'info' && styles.tabBtnActive]}
              onPress={() => setTab('info')}
            >
              <Text style={[styles.tabText, tab === 'info' && styles.tabTextActive]}>
                Detalles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, tab === 'resenas' && styles.tabBtnActive]}
              onPress={() => setTab('resenas')}
            >
              <Text style={[styles.tabText, tab === 'resenas' && styles.tabTextActive]}>
                Reseñas ({resenas.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, tab === 'reportar' && styles.tabBtnActive]}
              onPress={() => setTab('reportar')}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === 'reportar' && styles.tabTextActive,
                  { color: tab === 'reportar' ? C.danger : C.textSecondary },
                ]}
              >
                Reportar
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* PESTAÑA 1: DETALLES */}
            {tab === 'info' && (
              <View>
                {/* Foto si existe */}
                {business.foto && (
                  <Image source={{ uri: business.foto }} style={styles.businessPhoto} />
                )}

                {/* Producto estrella & Precio */}
                <View style={styles.productCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productLabel}>Especialidad:</Text>
                    <Text style={styles.productName}>{business.product}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Desde</Text>
                    <Text style={styles.priceValue}>S/{business.price}</Text>
                  </View>
                </View>

                {/* Descripción */}
                <Text style={styles.descriptionText}>{business.description}</Text>

                {/* Horario y Métodos de pago */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🕒</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>Horario de atención</Text>
                    <Text style={styles.infoValue}>{business.openingHours}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>💳</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>Métodos de pago aceptados</Text>
                    <View style={styles.paymentChips}>
                      {business.paymentMethods.map((metodo, idx) => (
                        <View key={idx} style={styles.chip}>
                          <Text style={styles.chipText}>{metodo}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>Ubicación y referencia</Text>
                    <Text style={styles.infoValue}>{business.referencia}</Text>
                    {business.direccion && (
                      <Text style={styles.infoSub}>{business.direccion}</Text>
                    )}
                  </View>
                </View>

                {/* Confianza */}
                <View style={styles.confidenceRow}>
                  <Text style={styles.confidenceText}>
                    Índice de confianza PiuraRuta: {business.confidence}/100
                  </Text>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.favBtn, fav && styles.favBtnActive]}
                    onPress={() => toggleFavorito(business.id)}
                  >
                    <Text style={[styles.favBtnText, fav && styles.favBtnTextActive]}>
                      {fav ? '★ Guardado' : '☆ Favorito'}
                    </Text>
                  </TouchableOpacity>

                  {onAgregarARuta && (
                    <TouchableOpacity
                      style={styles.addRouteBtn}
                      onPress={() => onAgregarARuta(business)}
                    >
                      <Text style={styles.addRouteBtnText}>+ Agregar a Ruta</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* PESTAÑA 2: RESEÑAS */}
            {tab === 'resenas' && (
              <View>
                {/* Formulario para agregar reseña */}
                <View style={styles.newReviewCard}>
                  <Text style={styles.sectionTitle}>Escribe tu experiencia</Text>

                  {/* Selector de estrellas */}
                  <View style={styles.starSelector}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <TouchableOpacity key={val} onPress={() => setEstrellas(val)}>
                        <Text style={styles.starIcon}>
                          {val <= estrellas ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.starScoreText}>({estrellas}/5)</Text>
                  </View>

                  <TextInput
                    style={styles.textInput}
                    placeholder="¿Qué tal estuvo la atención y la comida?"
                    placeholderTextColor={C.textMuted}
                    value={comentarioResena}
                    onChangeText={setComentarioResena}
                    multiline
                    numberOfLines={3}
                  />

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleEnviarResena}
                  >
                    <Text style={styles.primaryBtnText}>Publicar Reseña</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de reseñas existentes */}
                <Text style={styles.sectionTitle}>Opiniones de visitantes</Text>
                {resenas.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Aún no hay reseñas registradas para este puesto. ¡Sé el primero en opinar!
                  </Text>
                ) : (
                  resenas.map((r) => (
                    <View key={r.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewAuthor}>{r.autor}</Text>
                        <Text style={styles.reviewStars}>
                          {'★'.repeat(r.calificacion)}
                        </Text>
                      </View>
                      <Text style={styles.reviewComment}>{r.comentario}</Text>
                      <Text style={styles.reviewDate}>{r.fecha}</Text>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* PESTAÑA 3: REPORTAR */}
            {tab === 'reportar' && (
              <View style={styles.reportContainer}>
                <Text style={styles.sectionTitle}>Reportar inconsistencia</Text>
                <Text style={styles.reportDesc}>
                  Ayúdanos a mantener la información de PiuraRuta verificada. Todos los reportes se procesan localmente.
                </Text>

                <Text style={styles.inputLabel}>Motivo del reporte:</Text>
                <View style={styles.motivoOptions}>
                  {[
                    'Datos incorrectos',
                    'Cerrado permanentemente',
                    'Ubicación errónea',
                    'Precio diferente',
                  ].map((mot) => (
                    <TouchableOpacity
                      key={mot}
                      style={[
                        styles.motivoBtn,
                        motivoReporte === mot && styles.motivoBtnActive,
                      ]}
                      onPress={() => setMotivoReporte(mot)}
                    >
                      <Text
                        style={[
                          styles.motivoBtnText,
                          motivoReporte === mot && styles.motivoBtnTextActive,
                        ]}
                      >
                        {mot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Detalle adicional:</Text>
                <TextInput
                  style={[styles.textInput, { height: 90 }]}
                  placeholder="Explica brevemente qué información es incorrecta..."
                  placeholderTextColor={C.textMuted}
                  value={detalleReporte}
                  onChangeText={setDetalleReporte}
                  multiline
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: C.danger }]}
                  onPress={handleEnviarReporte}
                >
                  <Text style={styles.primaryBtnText}>Enviar Reporte</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    ...C.shadowLg,
  },
  handleBar: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  businessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
  },
  businessCategory: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: C.textSecondary,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeVerified: {
    backgroundColor: C.successBg,
  },
  badgeVerifiedText: {
    color: C.success,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeEval: {
    backgroundColor: C.warningBg,
  },
  badgeEvalText: {
    color: C.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeOpen: {
    backgroundColor: C.successBg,
  },
  badgeClosed: {
    backgroundColor: C.dangerBg,
  },
  badgeStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSuccess: {
    color: C.success,
  },
  textDanger: {
    color: C.danger,
  },
  badgeRating: {
    backgroundColor: '#FFFBEB',
  },
  badgeRatingText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  tabNav: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: C.primary,
  },
  tabText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: C.primaryDark,
    fontWeight: '700',
  },
  contentScroll: {
    maxHeight: height * 0.58,
  },
  businessPhoto: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 14,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  productLabel: {
    fontSize: 11,
    color: C.textSecondary,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: C.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: C.primaryDark,
  },
  descriptionText: {
    fontSize: 14,
    color: C.textPrimary,
    lineHeight: 20,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  infoTitle: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: C.textPrimary,
    marginTop: 1,
  },
  infoSub: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  paymentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: C.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    color: C.secondary,
    fontWeight: '600',
  },
  confidenceRow: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 16,
  },
  favBtn: {
    flex: 1,
    backgroundColor: C.borderLight,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#FEF3C7',
  },
  favBtnText: {
    fontSize: 14,
    color: C.textPrimary,
    fontWeight: '700',
  },
  favBtnTextActive: {
    color: '#B45309',
  },
  addRouteBtn: {
    flex: 1.2,
    backgroundColor: C.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  addRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 10,
  },
  newReviewCard: {
    backgroundColor: C.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },
  starSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starIcon: {
    fontSize: 26,
    color: '#F59E0B',
    marginRight: 4,
  },
  starScoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: C.textSecondary,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    fontSize: 14,
    color: C.textPrimary,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: C.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    color: C.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  reviewItem: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.borderLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  reviewStars: {
    color: '#F59E0B',
    fontSize: 13,
  },
  reviewComment: {
    fontSize: 13,
    color: C.secondary,
    lineHeight: 18,
  },
  reviewDate: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 6,
  },
  reportContainer: {
    paddingVertical: 4,
  },
  reportDesc: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 8,
  },
  motivoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  motivoBtn: {
    backgroundColor: C.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  motivoBtnActive: {
    backgroundColor: C.dangerBg,
    borderColor: C.danger,
    borderWidth: 1,
  },
  motivoBtnText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: '600',
  },
  motivoBtnTextActive: {
    color: C.danger,
    fontWeight: '700',
  },
});
