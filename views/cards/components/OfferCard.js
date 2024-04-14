import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types'; // Asegúrate de tener instalado 'prop-types'


const getAlertStyles = (alertType) => {
  switch (alertType) {
    case "Advertencia":
      return { backgroundColor: 'orange', icon: 'exclamation-triangle', textColor: '#000', buttonText: 'Detalles' };
    case "Error":
      return { backgroundColor: 'blue', icon: 'info-circle', textColor: '#fff', buttonText: 'Más Info' };
    case "Alerta":
      return { backgroundColor: 'red', icon: 'times-circle', textColor: '#fff', buttonText: 'Resolver' };
      default:
        console.warn(`El tipo de alerta '${alertType}' no es reconocido.`);
        return {
          backgroundColor: 'grey', icon: 'question-circle', textColor: '#fff', buttonText: ''
        };      
    }
};

const OfferCard = ({ id, category, alertType, value, timestamp }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      Alert.alert("Error", "Fecha no válida proporcionada.");
      return 'Fecha desconocida';
    }
  };

  const { backgroundColor, icon, textColor, buttonText } = getAlertStyles(alertType);
  const formattedTimestamp = formatDate(timestamp);

  const humanReadableCategory = {
    gasDetector: 'GAS',
    ultrasonic: 'ULTRASÓNICO',
    temperature: 'TEMPERATURA',
    humidity: 'HUMEDAD',
    // ... cualquier otra categoría que necesites
  }[category.toLowerCase()] || 'Desconocido';

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.cardContent}>
        <Icon name={icon} size={30} color={textColor} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{humanReadableCategory}</Text>
          <Text style={[styles.value, { color: textColor }]}>{value}</Text>
          <Text style={[styles.timestamp, { color: textColor }]}>{formattedTimestamp}</Text>
        </View>
      </View>
      {buttonText && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

OfferCard.propTypes = {
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  alertType: PropTypes.oneOf(['Advertencia', 'Error', 'Alerta']).isRequired,
  value: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    elevation: 3, // para Android
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  // ... cualquier otro estilo que necesites
});

export default OfferCard;
