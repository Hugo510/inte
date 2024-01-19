import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Fondo claro de la paleta
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7d76cd', // Color de fondo para el encabezado
  },
  logo: {
    color: '#fefefe', // Blanco casi puro para el texto del logo
    fontWeight: 'bold',
    fontSize: 24,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
  },
  navItem: {
    color: '#fefefe', // Color del texto de los elementos de navegación
    fontSize: 16,
    fontWeight: '500',
    marginRight: 20,
  },
  tryFreeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#fefefe', // Borde blanco para el botón "Try For Free"
    borderRadius: 20,
  },
  tryFreeText: {
    color: '#fefefe', // Color del texto para "Try For Free"
    fontSize: 16,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0e3ec', // Color de fondo para la sección principal
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4248b8', // Color del título principal
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#5755bf', // Color del subtítulo
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#6b5cc5', // Color del botón "Get Started"
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonText: {
    color: '#fefefe', // Color del texto de los botones
    fontSize: 16,
    fontWeight: '500',
  },
  featureCardsContainer: {
    paddingVertical: 20,
  },
  demoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6b5cc5', // Color del borde para "Free Demo"
    marginLeft: 10,
  },
  featureCard: {
    width: 150,
    height: 100,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // Fondo de las tarjetas de características
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4248b8', // Color del título de las tarjetas de características
    marginTop: 8,
  },
  featureCardText: {
    fontSize: 14,
    color: '#5755bf', // Color del texto en las tarjetas de características
    textAlign: 'center',
  },
  brandsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff', // Fondo para la sección de marcas
  },
  featuresSection: {
    // Estilos para la sección de características
  },
  card: {
    width: 150,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // Blanco para el fondo de las tarjetas
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    color: '#6b5cc5',
    width: 30,
    height: 30, // Púrpura vibrante para los iconos
  },
  featureText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#4248b8', // Azul profundo para el texto de las características
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#7d76cd', // Puedes ajustar el color de fondo según la paleta
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#fefefe', // Color del texto que contrasta con el fondo
    fontSize: 14,
  },
  // Añadir estilos para otros componentes...
});
