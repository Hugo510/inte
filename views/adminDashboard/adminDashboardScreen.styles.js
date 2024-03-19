import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Un fondo claro para dar sensación de amplitud
    padding: 20, // Un poco de padding para no pegar los contenidos a los bordes
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Un color oscuro para el texto que ofrezca contraste
    marginBottom: 20, // Espacio antes de la lista
    textAlign: 'center', // Centrar el título para dar una sensación de balance
  },
  listItem: {
    backgroundColor: 'white', // Fondo blanco para los items para contraste
    padding: 20, // Espaciado interno
    borderRadius: 10, // Bordes redondeados para suavizar
    flexDirection: 'row', // Organizar contenido en fila
    alignItems: 'center', // Alinear ítems verticalmente
    justifyContent: 'space-between', // Justificar contenido distribuido
    marginBottom: 10, // Espacio entre ítems
    shadowColor: "#000", // Sombras para dar sensación de elevación
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemText: {
    fontSize: 18, // Tamaño de fuente legible
    color: '#333', // Color oscuro para contraste
    flex: 1, // Permitir que el texto ocupe el espacio disponible
  },
  icon: {
    // Ajustes para los íconos (Material Icons)
    marginLeft: 15, // Espaciado al lado izquierdo
  },
  button: {
    // Estilo para botones principales en el dashboard
    backgroundColor: '#007BFF', // Un azul atractivo para acciones principales
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center', // Centrar botón en la pantalla
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // Texto blanco para contraste
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar spinner de carga
    alignItems: 'center',
  },
});
