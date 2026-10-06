import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { businesses } from '../../data/businesses';

export default function BusinessDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Buscar el lugar según el id recibido
  const negocio = businesses.find((b) => b.id === Number(id));

  if (!negocio) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Lugar no encontrado</Text>
        <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
          <Text style={styles.backButtonTextSimple}>Volver al mapa</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const estadoApertura = negocio.estado_apertura ?? true;
  const rating = negocio.calificacion_promedio ?? 0.0;
  const totalResenas = negocio.total_reseñas ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        {/* IMAGEN DE PORTADA (foto_portada_url) */}
        <View style={styles.imageContainer}>
          {negocio.foto_portada_url ? (
            <Image source={{ uri: negocio.foto_portada_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📍 {negocio.name}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN DEL LUGAR */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{negocio.name}</Text>
            
            {/* ESTADO DE APERTURA EN TIEMPO REAL */}
            <View style={[styles.badge, estadoApertura ? styles.badgeOpen : styles.badgeClosed]}>
              <Text style={[styles.badgeText, estadoApertura ? styles.textOpen : styles.textClosed]}>
                {estadoApertura ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>{negocio.category}</Text>

          {/* DIRECCIÓN */}
          {negocio.direccion && (
            <Text style={styles.address}>📍 {negocio.direccion}</Text>
          )}

          {/* CALIFICACIÓN PROMEDIO Y TOTAL RESEÑAS */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>⭐ {rating.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>({totalResenas} reseñas)</Text>
            {negocio.verified && (
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>✓ Verificado</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* DESCRIPCIÓN */}
          <Text style={styles.sectionHeader}>Descripción</Text>
          <Text style={styles.descriptionText}>{negocio.description}</Text>

          {/* DETALLES ADICIONALES */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Plato / Producto:</Text>
              <Text style={styles.infoValue}>{negocio.product}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Precio Referencial:</Text>
              <Text style={styles.infoValue}>S/{negocio.price}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horario:</Text>
              <Text style={styles.infoValue}>{negocio.openingHours}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Métodos de pago:</Text>
              <Text style={styles.infoValue}>{negocio.paymentMethods.join(', ')}</Text>
            </View>
          </View>
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
  content: {
    padding: 20,
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
    marginTop: 20,
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