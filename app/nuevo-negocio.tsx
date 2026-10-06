// ==========================================
// PiuraRuta - Postular Negocio en Evaluación (app/nuevo-negocio.tsx)
// ==========================================

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../lib/store';
import { C } from '../lib/theme';

const CATEGORIAS_DISPONIBLES = [
  'Gastronomía',
  'Bebidas',
  'Chifles / Snacks',
  'Artesanías',
  'Dulces',
];

const METODOS_DISPONIBLES = ['Yape', 'Plin', 'Efectivo', 'Tarjeta'];

export default function NuevoNegocioScreen() {
  const { agregarNegocio } = useApp();

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Gastronomía');
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [horaApertura, setHoraApertura] = useState('09:00');
  const [horaCierre, setHoraCierre] = useState('18:00');
  const [metodosPago, setMetodosPago] = useState<string[]>(['Yape', 'Efectivo']);
  const [referencia, setReferencia] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  // Coordenadas iniciales (cerca a la Plaza de Armas de Piura con leve desplazamiento)
  const [latitud, setLatitud] = useState('-5.1955');
  const [longitud, setLongitud] = useState('-80.6320');

  const toggleMetodo = (m: string) => {
    if (metodosPago.includes(m)) {
      if (metodosPago.length > 1) {
        setMetodosPago(metodosPago.filter((item) => item !== m));
      }
    } else {
      setMetodosPago([...metodosPago, m]);
    }
  };

  const handleSimularGPS = () => {
    // Generar coordenadas realistas en el centro de Piura
    const deltaLat = (Math.random() - 0.5) * 0.005;
    const deltaLon = (Math.random() - 0.5) * 0.005;
    const newLat = (-5.1945 + deltaLat).toFixed(4);
    const newLon = (-80.6328 + deltaLon).toFixed(4);
    setLatitud(newLat);
    setLongitud(newLon);
    Alert.alert('GPS Capturado 📍', `Ubicación detectada: [${newLat}, ${newLon}] en Piura Centro.`);
  };

  const handleGuardarNegocio = () => {
    if (!nombre.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre del puesto.');
      return;
    }
    if (!producto.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa la especialidad o producto.');
      return;
    }
    if (!referencia.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa una referencia de ubicación.');
      return;
    }

    const precioNum = parseFloat(precio) || 10;
    const latNum = parseFloat(latitud) || -5.1945;
    const lonNum = parseFloat(longitud) || -80.6328;

    // Crea el negocio que entra automáticamente en estado 'evaluacion'
    const nuevo = agregarNegocio({
      name: nombre.trim(),
      category: categoria,
      product: producto.trim(),
      description: descripcion.trim() || 'Puesto tradicional postulado por la comunidad de PiuraRuta.',
      price: precioNum,
      latitude: latNum,
      longitude: lonNum,
      verified: false,
      confidence: 60,
      rating: 4.5,
      paymentMethods: metodosPago,
      openingHours: `${horaApertura.trim()} - ${horaCierre.trim()}`,
      tags: [categoria.toLowerCase(), producto.toLowerCase().split(' ')[0]],
      referencia: referencia.trim(),
      direccion: direccion.trim() || referencia.trim(),
      foto:
        fotoUrl.trim() ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      foto_portada_url:
        fotoUrl.trim() ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      calificacion_promedio: 4.5,
      total_reseñas: 0,
      estado_apertura: false,
    });

    Alert.alert(
      '¡Puesto Postulado con Éxito! ⏳',
      `"${nuevo.name}" ha sido enviado a evaluación. Aparecerá en el mapa de tu teléfono con el marcador ⏳ hasta su validación en el panel.`,
      [
        {
          text: 'Ver en el Mapa',
          onPress: () => {
            router.replace('/(tabs)/mapa');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Modal */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Postular Puesto</Text>
          <Text style={styles.headerSub}>
            Suma negocios tradicionales a la red de PiuraRuta
          </Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Alerta Informativa del Estado "En Evaluación" */}
          <View style={styles.evalNoticeCard}>
            <Text style={styles.evalNoticeIcon}>⏳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.evalNoticeTitle}>Ingreso en Evaluación</Text>
              <Text style={styles.evalNoticeText}>
                Todo puesto registrado entra con estado "En evaluación". Se guardará localmente y se mostrará de inmediato en el mapa con el ícono ⏳.
              </Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre del puesto / negocio *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Cevichería El Huarique Piurano"
              placeholderTextColor={C.textMuted}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {CATEGORIAS_DISPONIBLES.map((cat) => {
                const activo = categoria === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, activo && styles.catChipActive]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={[styles.catChipText, activo && styles.catChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Producto estrella o plato principal *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Ceviche de Cabrilla con Sarandaja"
              placeholderTextColor={C.textMuted}
              value={producto}
              onChangeText={setProducto}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción del puesto</Text>
            <TextInput
              style={[styles.input, { height: 75 }]}
              placeholder="Cuenta un poco sobre la preparación, tradición o sazón..."
              placeholderTextColor={C.textMuted}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />
          </View>

          <View style={styles.rowTwoCols}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Precio aprox (S/)</Text>
              <TextInput
                style={styles.input}
                placeholder="12"
                placeholderTextColor={C.textMuted}
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Horario apertura</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00"
                placeholderTextColor={C.textMuted}
                value={horaApertura}
                onChangeText={setHoraApertura}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Horario cierre</Text>
              <TextInput
                style={styles.input}
                placeholder="18:00"
                placeholderTextColor={C.textMuted}
                value={horaCierre}
                onChangeText={setHoraCierre}
              />
            </View>
          </View>

          {/* Métodos de Pago */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Métodos de pago aceptados</Text>
            <View style={styles.paymentsGrid}>
              {METODOS_DISPONIBLES.map((m) => {
                const activo = metodosPago.includes(m);
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.paymentBtn, activo && styles.paymentBtnActive]}
                    onPress={() => toggleMetodo(m)}
                  >
                    <Text style={[styles.paymentBtnText, activo && styles.paymentBtnTextActive]}>
                      {activo ? '✓ ' : '+ '}
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Coordenadas & GPS */}
          <View style={styles.formGroup}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Coordenadas GPS</Text>
              <TouchableOpacity onPress={handleSimularGPS}>
                <Text style={styles.gpsLinkText}>📍 Capturar mi GPS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Latitud"
                  placeholderTextColor={C.textMuted}
                  value={latitud}
                  onChangeText={setLatitud}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Longitud"
                  placeholderTextColor={C.textMuted}
                  value={longitud}
                  onChangeText={setLongitud}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Referencia de ubicación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Frente a la Iglesia San Sebastián"
              placeholderTextColor={C.textMuted}
              value={referencia}
              onChangeText={setReferencia}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Dirección / Calle (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Jr. Arequipa 520"
              placeholderTextColor={C.textMuted}
              value={direccion}
              onChangeText={setDireccion}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Foto URL (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://ejemplo.com/foto.jpg"
              placeholderTextColor={C.textMuted}
              value={fotoUrl}
              onChangeText={setFotoUrl}
            />
          </View>

          {/* Botón de Envío */}
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleGuardarNegocio}
          >
            <Text style={styles.submitBtnText}>Postular para Evaluación ⏳</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    ...C.shadowSm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: C.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  evalNoticeCard: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  evalNoticeIcon: {
    fontSize: 26,
  },
  evalNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  evalNoticeText: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
  },
  chipsScroll: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  catChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  catChipText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsLinkText: {
    color: C.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  paymentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  paymentBtnActive: {
    backgroundColor: C.successBg,
    borderColor: C.success,
  },
  paymentBtnText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '600',
  },
  paymentBtnTextActive: {
    color: C.success,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: C.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    ...C.shadowMd,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
