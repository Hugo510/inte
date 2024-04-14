import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import OfferCard from './OfferCard'; // Asegúrate de que la ruta sea correcta
import PropTypes from 'prop-types'; // Asegúrate de tener instalado 'prop-types'

const AlertCardsList = ({ messages }) => {
  // Verificar que 'messages' sea un arreglo y que no esté vacío
  if (!Array.isArray(messages) || messages.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No hay alertas disponibles.</Text>
      </View>
    );
  }

  // Verificar que cada mensaje tenga un 'id'
  const missingIds = messages.some((message) => message.id === undefined);
  if (missingIds) {
    console.error('Error en AlertCardsList: Algunos mensajes no tienen un ID.');
    // Decidir qué hacer en este caso: puedes optar por mostrar un mensaje de error,
    // devolver null, o filtrar los mensajes que sí tengan 'id'.
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      renderItem={({ item }) => {
        try {
          // Envolver el renderizado en un bloque try-catch por si 'OfferCard' arroja un error
          return <OfferCard {...item} />;
        } catch (error) {
          // Puedes decidir cómo manejar el error de renderizado aquí
          console.error('Error renderizando OfferCard: ', error);
          return null; // O puedes optar por mostrar un componente de error o mensaje
        }
      }}
    />
  );
};

AlertCardsList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      // Incluir todas las PropTypes para las propiedades esperadas en un mensaje
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default AlertCardsList;
