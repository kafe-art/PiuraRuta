import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  // Estado de usuario / sesión
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  // Estados de filtros y preferencias
  const [presupuesto, setPresupuesto] = useState<PresupuestoTipo>('BARATO');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Gastronomía');

  // Ingreso como invitado
  const handleIngresoInvitado = () => {
    setUsuario({
      id: 99,
      nombre: 'Turista Invitado',
      esInvitado: true,
    });
  };

  // Login tradicional
  const handleLogin = () => {
    setUsuario({
      id: 1,
      nombre: 'Carlos Mendoza',
      esInvitado: false,
    });
  };

  // 1. Vista de Inicio de Sesión / Acceso Invitado
  if (!usuario) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#E67E00" />
        <View style={styles.authHero}>
          <Text style={styles.brandTitle}>¡Bienvenido a PiuraRuta!</Text>
          <Text style={styles.brandSubtitle}>
            Descubre los mejores puestos y rutas tradicionales de Piura.
          </Text>
        </View>

        <View style={styles.authCard}>
          <Text style={styles.authPrompt}>Selecciona cómo deseas ingresar:</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Iniciar Sesión / Registrarme</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.guestBtn} onPress={handleIngresoInvitado}>
            <Text style={styles.guestBtnText}>Continuar como Invitado</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Vista Principal de la Aplicación
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a PiuraRuta!</Text>
      <Text style={styles.subtitle}>Tu app de rutas en Piura.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Pantalla de Autenticación
  authContainer: {
    flex: 1,
    backgroundColor: '#FF8C00', // Naranja Sol Piurano
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authHero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#FFE8D6',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  authPrompt: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A0AEC0',
    fontSize: 13,
  },
  guestBtn: {
    backgroundColor: '#EDF2F7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestBtnText: {
    color: '#4A5568',
    fontSize: 15,
    fontWeight: '600',
  },

  // Pantalla Principal
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  greetingSub: {
    fontSize: 12,
    color: '#718096',
  },
  logoutBtn: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#E53E3E',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 90,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 14,
    marginBottom: 8,
  },
  budgetSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetTab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  budgetTabActive: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF8F0',
  },
  budgetTabText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  budgetTabTextActive: {
    color: '#E67E00',
    fontWeight: '700',
  },
  categoriesList: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  catBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  catBadgeActive: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  catBadgeText: {
    fontSize: 13,
    color: '#4A5568',
  },
  catBadgeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  routeCard: {
    backgroundColor: '#2D3748',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  routeCardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  routeCardSub: {
    color: '#CBD5E0',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },
  generateBtn: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  spotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  badgeOpen: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOpenText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '700',
  },
  spotInfo: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  spotTags: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  fabButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});