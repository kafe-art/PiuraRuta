// ==========================================
// PiuraRuta - Ficha Completa del Negocio (app/business/business.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useApp } from '../../lib/store';
import { estaAbiertoEnMinutos } from '../../lib/ruta';
import { businesses as defaultBusinesses } from '../../data/businesses';
import { C } from '../../lib/theme';

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    negocios,
    esFavorito,
    toggleFavorito,
    obtenerResenas,
    agregarResena,
    agregarReporte,
    rutaActiva,
    actualizarParadasRutaActiva,
  } = useApp();

  // Buscar el negocio en el almacén global (incluye los postulados en evaluación)
  const negocio =
    negocios.find((b) => b.id === Number(id)) ||
    defaultBusinesses.find((b) => b.id === Number(id));

  // Estados de formularios
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mostrarFormReporte, setMostrarFormReporte] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState('Datos incorrectos');
  const [detalleReporte, setDetalleReporte] = useState('');

  if (!negocio) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Puesto no encontrado</Text>
        <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
          <Text style={styles.backButtonTextSimple}>Volver al mapa</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Cálculo de apertura en tiempo real basado en minutos
  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const estadoApertura = estaAbiertoEnMinutos(negocio, minutosAhora);

  const resenas = obtenerResenas(negocio.id);
  const fav = esFavorito(negocio.id);
  const isEval = negocio.estado === 'evaluacion';
  const ratingPromedio = negocio.rating ?? negocio.calificacion_promedio ?? 4.5;
  const fotoUrl = negocio.foto ?? negocio.foto_portada_url;

  // Acciones conectadas con el store
  const handleEnviarResena = () => {
    if (!nuevoComentario.trim()) {
      Alert.alert('Atención', 'Por favor ingresa un comentario sobre tu experiencia.');
      return;
    }
    agregarResena(negocio.id, nuevaCalificacion, nuevoComentario.trim());
    setNuevoComentario('');
    setNuevaCalificacion(5);
    Alert.alert('¡Gracias!', 'Tu reseña ha sido guardada en PiuraRuta.');
  };

  const handleEnviarReporte = () => {
    if (!detalleReporte.trim()) {
      Alert.alert('Atención', 'Por favor explica la irregularidad observada.');
      return;
    }
    agregarReporte(negocio.id, motivoReporte, detalleReporte.trim());
    setDetalleReporte('');
    setMostrarFormReporte(false);
    Alert.alert('Reporte enviado', 'El reporte fue registrado localmente para evaluación.');
  };

  const handleAgregarARuta = () => {
    if (!rutaActiva) {
      Alert.alert(
        'Sin ruta activa',
        'Genera primero una ruta con tu Asistente en la pestaña Inicio.'
      );
      return;
    }

    const yaEsta = rutaActiva.paradas.some((p) => p.business.id === negocio.id);
    if (yaEsta) {
      Alert.alert('Aviso', 'Este puesto ya forma parte de tu ruta activa.');
      return;
    }

    const nuevaParada = {
      paso: rutaActiva.paradas.length + 1,
      business: negocio,
      horaLlegada: '13:00',
      horaSalida: '13:45',
      minutosEstancia: 40,
      minutosTraslado: 10,
      distanciaDesdeAnteriorKm: 0.5,
      estaAbierto: estadoApertura,
    };

    actualizarParadasRutaActiva([...rutaActiva.paradas, nuevaParada]);
    Alert.alert('¡Agregado a tu Ruta!', `"${negocio.name}" se sumó como nueva parada.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* IMAGEN DE PORTADA */}
        <View style={styles.imageContainer}>
          {fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📍 {negocio.name}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Botón Favorito Flotante */}
          <TouchableOpacity
            style={[styles.floatingFavButton, fav && styles.floatingFavButtonActive]}
            onPress={() => toggleFavorito(negocio.id)}
          >
            <Text style={styles.favIcon}>{fav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN DEL LUGAR */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{negocio.name}</Text>

            {/* ESTADO DE APERTURA EN TIEMPO REAL */}
            <View style={[styles.badge, estadoApertura ? styles.badgeOpen : styles.badgeClosed]}>
              <Text style={[styles.badgeText, estadoApertura ? styles.textOpen : styles.textClosed]}>
                {estadoApertura ? 'Abierto ahora' : 'Cerrado ahora'}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>{negocio.category}</Text>

          {/* DIRECCIÓN Y REFERENCIA */}
          <Text style={styles.address}>📍 {negocio.direccion || negocio.referencia}</Text>

          {/* CALIFICACIÓN Y BADGES */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>⭐ {ratingPromedio.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>
              ({resenas.length > 0 ? resenas.length : negocio.total_reseñas} reseñas)
            </Text>

            {isEval ? (
              <View style={[styles.verifiedTag, styles.evalTag]}>
                <Text style={styles.evalTagText}>⏳ En evaluación</Text>
              </View>
            ) : negocio.verified ? (
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>✓ Mercado Seguro</Text>
              </View>
            ) : null}
          </View>

          {/* BOTONES DE ACCIÓN RÁPIDA */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.favBtn, fav && styles.favBtnActive]}
              onPress={() => toggleFavorito(negocio.id)}
            >
              <Text style={[styles.favBtnText, fav && styles.favBtnTextActive]}>
                {fav ? '★ En Favoritos' : '☆ Guardar Favorito'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addRouteBtn} onPress={handleAgregarARuta}>
              <Text style={styles.addRouteBtnText}>+ Sumar a mi Ruta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* DESCRIPCIÓN */}
          <Text style={styles.sectionHeader}>Descripción</Text>
          <Text style={styles.descriptionText}>{negocio.description}</Text>

          {/* DETALLES ADICIONALES */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Plato / Especialidad:</Text>
              <Text style={styles.infoValue}>{negocio.product}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Precio Referencial:</Text>
              <Text style={styles.infoValue}>S/{negocio.price}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horario Comercial:</Text>
              <Text style={styles.infoValue}>{negocio.openingHours}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Métodos de pago:</Text>
              <Text style={styles.infoValue}>{negocio.paymentMethods.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* SECCIÓN DE RESEÑAS */}
          <Text style={styles.sectionHeader}>Opiniones de la Comunidad ({resenas.length})</Text>

          {/* Formulario para dejar reseña */}
          <View style={styles.newReviewBox}>
            <Text style={styles.boxTitle}>Escribe tu calificación</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity key={val} onPress={() => setNuevaCalificacion(val)}>
                  <Text style={styles.starTouch}>
                    {val <= nuevaCalificacion ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="¿Qué te pareció el sabor y la atención?"
              placeholderTextColor={C.textMuted}
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
              multiline
            />
            <TouchableOpacity style={styles.submitReviewBtn} onPress={handleEnviarResena}>
              <Text style={styles.submitReviewText}>Publicar Reseña</Text>
            </TouchableOpacity>
          </View>

          {/* Listado de reseñas */}
          {resenas.length === 0 ? (
            <Text style={styles.noReviewsText}>Aún no hay reseñas registradas para este puesto.</Text>
          ) : (
            resenas.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewAuthor}>{r.autor}</Text>
                  <Text style={styles.reviewRating}>{'★'.repeat(r.calificacion)}</Text>
                </View>
                <Text style={styles.reviewBody}>{r.comentario}</Text>
                <Text style={styles.reviewDate}>{r.fecha}</Text>
              </View>
            ))
          )}

          <View style={styles.divider} />

          {/* SECCIÓN REPORTES */}
          {!mostrarFormReporte ? (
            <TouchableOpacity
              style={styles.reportToggleBtn}
              onPress={() => setMostrarFormReporte(true)}
            >
              <Text style={styles.reportToggleText}>⚠️ ¿Detectas información incorrecta? Reportar aquí</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.reportBox}>
              <Text style={styles.boxTitle}>Reportar inconsistencia</Text>
              <View style={styles.motivoChips}>
                {['Datos incorrectos', 'Cerrado permanentemente', 'Precio diferente'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.motivoChip, motivoReporte === m && styles.motivoChipActive]}
                    onPress={() => setMotivoReporte(m)}
                  >
                    <Text
                      style={[
                        styles.motivoChipText,
                        motivoReporte === m && styles.motivoChipTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.reviewInput, { height: 70 }]}
                placeholder="Detalle de la irregularidad..."
                placeholderTextColor={C.textMuted}
                value={detalleReporte}
                onChangeText={setDetalleReporte}
                multiline
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[styles.submitReviewBtn, { flex: 1, backgroundColor: C.danger }]}
                  onPress={handleEnviarReporte}
                >
                  <Text style={styles.submitReviewText}>Enviar Reporte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitReviewBtn, { backgroundColor: C.borderLight }]}
                  onPress={() => setMostrarFormReporte(false)}
                >
                  <Text style={[styles.submitReviewText, { color: C.textSecondary }]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    backgroundColor: '#EDF2F7',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBD5E0',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A5568',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  floatingFavButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingFavButtonActive: {
    backgroundColor: '#FF8C00',
  },
  favIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  category: {
    fontSize: 13,
    color: '#E67E00',
    fontWeight: '700',
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    color: '#718096',
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOpen: {
    backgroundColor: '#E8F5E9',
  },
  badgeClosed: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textOpen: {
    color: '#2E7D32',
  },
  textClosed: {
    color: '#C62828',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingStars: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  reviewsCount: {
    fontSize: 13,
    color: '#A0AEC0',
    marginLeft: 6,
  },
  verifiedTag: {
    marginLeft: 'auto',
    backgroundColor: '#FFF4E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: '#E67E00',
    fontSize: 11,
    fontWeight: '700',
  },
  evalTag: {
    backgroundColor: '#FEF3C7',
  },
  evalTagText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  favBtn: {
    flex: 1,
    backgroundColor: C.borderLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: '#FEF3C7',
  },
  favBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  favBtnTextActive: {
    color: '#B45309',
  },
  addRouteBtn: {
    flex: 1.2,
    backgroundColor: C.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
  infoGrid: {
    marginTop: 14,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 14,
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '600',
    marginTop: 2,
  },
  newReviewBox: {
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starTouch: {
    fontSize: 24,
    color: '#F59E0B',
    marginRight: 4,
  },
  reviewInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    fontSize: 13,
    color: C.textPrimary,
    marginBottom: 10,
  },
  submitReviewBtn: {
    backgroundColor: C.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  noReviewsText: {
    fontSize: 13,
    color: C.textMuted,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.borderLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
  },
  reviewRating: {
    color: '#F59E0B',
    fontSize: 12,
  },
  reviewBody: {
    fontSize: 13,
    color: C.secondary,
    marginTop: 3,
  },
  reviewDate: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 4,
  },
  reportToggleBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  reportToggleText: {
    fontSize: 12,
    color: C.danger,
    fontWeight: '600',
  },
  reportBox: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  motivoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  motivoChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  motivoChipActive: {
    backgroundColor: C.dangerBg,
    borderColor: C.danger,
  },
  motivoChipText: {
    fontSize: 11,
    color: C.textSecondary,
  },
  motivoChipTextActive: {
    color: C.danger,
    fontWeight: '700',
  },
  notFoundText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 12,
  },
  backButtonSimple: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonTextSimple: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});