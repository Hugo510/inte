import { StyleSheet, Dimensions } from 'react-native';
// Calcular tamaños adaptativos basados en las dimensiones de la pantalla

const { width, height } = Dimensions.get('window');
const baseUnit = width / 375; // Suponiendo que 375 es el ancho base (iPhone X)

const adaptiveFontSize = (size) => Math.ceil(size * baseUnit);
const adaptiveHeight = (factor) => height * factor;
const adaptiveWidth = (factor) => width * factor;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo claro de la paleta
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
    backgroundColor: '#000000', // Color de fondo para el encabezado
    width: width,
  },
  logo: {
    color: '#FFFFFF', // Blanco casi puro para el texto del logo
    fontWeight: 'bold',
    fontSize: adaptiveFontSize(24), // Tamaño de fuente adaptativo
  },
  closeButton: {
    position: 'absolute',
    top: 5, // Asegúrate de que no se superponga con la barra de estado
    right: 16,
    zIndex: 1001, // Debe estar por encima del menú para ser accesible
  },
  menu: {
    flex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.935)', // fondo blanco como en la imagen
    width: '78%', // ancho del menú
    paddingTop: 55, // Espacio para evitar superposición con la barra de estado
    zIndex: 1000, // Asegurar que se sobreponga
  },
  scrollView: {
    //flexGrow: 1, // Permite que el contenido crezca para ocupar el espacio, asegurándose de que el botón inferior esté visible.
  },
  menuContent: {
    //flexGrow: 1, // Esto asegura que el contenido use todo el espacio disponible
    //justifyContent: 'space-between', // Esto distribuirá los elementos del menú a lo largo de todo el contenedor
    //paddingTop: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Espaciado vertical para cada elemento del menú
    paddingHorizontal: 20, // Espaciado horizontal para íconos y texto
    fontSize: 18, // Tamaño de fuente aumentado para coincidir con el ejemplo
    fontWeight: '500',
  },
  menuText: {
    fontSize: 19,
    fontWeight: 'bold', // Puedes hacerlo más grueso si es necesario
    marginLeft: 15,
    color: '#000', // Color de texto para contraste con el fondo oscuro
  },
  tryFreeButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#000', // Borde blanco para el botón "Try For Free"
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    margin: 40,
  },
  tryFreeText: {
    textAlign: 'center',
    color: '#000', // Color del texto para "Try For Free"
    fontSize: 16,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DAE8FC', // Color de fondo para la sección principal
    width: width, // Asegura que el heroSection ocupe el ancho completo
  },
  heroTitle: {
    fontSize: adaptiveFontSize(24), // Ajusta el tamaño de fuente según el ancho de pantalla
    fontWeight: 'bold',
    color: '#0056D2', // Color del título principal
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: adaptiveFontSize(18), // Ajusta el tamaño de fuente según el ancho de pantalla
    color: '#000', // Color del subtítulo
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: width - adaptiveWidth(0.1), // Margen horizontal basado en el porcentaje de la pantalla
  },
  getStartedButton: {
    backgroundColor: '#5E2750', // Color del botón "Get Started"
    paddingVertical: adaptiveHeight(0.015),
    paddingHorizontal: adaptiveWidth(0.05),
    borderRadius: 20,
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF', // Color del texto de los botones
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureCardsContainer: {
    //paddingVertical: 20,
    paddingBottom: 25,
    paddingHorizontal: 10,
    //width: width, // Asegura que el contenedor de tarjetas ocupe el ancho completo de la pantalla
    
  },
  demoButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF4563', // Color del borde para "Free Demo"
    marginLeft: 10,
  },
  featureCard: {
    width: adaptiveWidth(0.4), // 40% del ancho de pantalla
    height: adaptiveHeight(0.2), // 20% del alto de pantalla
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FF4563', // Fondo de las tarjetas de características
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureCardTitle: {
    fontSize: adaptiveFontSize(18), // Tamaño de fuente adaptativo
    fontWeight: 'bold',
    color: '#4A476F', // Color del título de las tarjetas de características
    marginTop: 8,
  },
  featureCardText: {
    fontSize: adaptiveFontSize(14),
    color: '#5755bf', // Color del texto en las tarjetas de características
    textAlign: 'center',
  },
  brandsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow for wrapping
    justifyContent: 'flex-start', // Align items to the start to handle odd numbers of profiles
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10, // Add horizontal padding for spacing from the screen edges
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: 'bold', // Make the font bold
    fontSize: 24, // Increase font size
    color: '#000', // Set the text color
    width: '100%', // Ensure the title takes the full width
    textAlign: 'center', // Center the title text
    marginBottom: 20, // Add space below the title
  },
  profileItem: {
    alignItems: 'center', // Center the image and text vertically
    justifyContent: 'center', // Center the content horizontally
    width: '30%', // Adjust the width to slightly less than one-third
    marginVertical: 10, 
    marginHorizontal: '1.5%', // Add horizontal margin to create space between items  
  },  
  profileImage: {
    width: '100%', // The image will fill the width of profileItem
    aspectRatio: 1, // Maintain the square aspect ratio
    borderRadius: 83 / 2, // Adjust this value if needed to keep the image round
    height: '%25',
    alignSelf: 'center',  
  },
  profileText: {
    marginTop: 5, // Add space between the image and text
    fontSize: 15, // Set the font size for the text
    color: '#000', // Set the text color
    // Add any additional styling you want for the text
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
    width: width,
    backgroundColor: '#525558', // Puedes ajustar el color de fondo según la paleta
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#fefefe', // Color del texto que contrasta con el fondo
    fontSize: adaptiveFontSize(14),
  },
  // Añadir estilos para otros componentes...
});
