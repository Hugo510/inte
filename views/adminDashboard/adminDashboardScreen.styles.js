import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#5E72E4'; // Ejemplo de color primario, puede ser el de tu marca
const SECONDARY_COLOR = '#F7FAFC'; // Color para fondos de elementos, por contraste
const TEXT_COLOR = '#32325D'; // Color oscuro para el texto que proporcione suficiente contraste
const DANGER_COLOR = '#F5365C'; // Color para acciones de peligro como eliminar

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: SECONDARY_COLOR,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_COLOR,
    textAlign: 'center', // Centrar el título
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    // Estilo para cada ítem de la lista
    padding: 10,
    margin: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: TEXT_COLOR,
    paddingBottom: 5, // Espacio entre textos
  },
  buttonContainer: {
    // Contenedor para los botones de acción
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10, // Espacio vertical para evitar toques accidentales
    alignSelf: 'flex-start', // Alinear botones a la izquierda
    backgroundColor: PRIMARY_COLOR, // Botón con el color primario
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  rejectButton: {
    backgroundColor: DANGER_COLOR,
  },
  editButton: {
    // Botón para editar
    backgroundColor: '#FFD700',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  assignButton: {
    backgroundColor: '#11CDEF', // Un color que indique asignación
  },
  deleteButton: {
    // Botón para eliminar
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 5,
  },
  // Estilos adicionales para botones con iconos
  buttonIcon: {
    marginRight: 10, // Espacio entre el icono y el texto
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
