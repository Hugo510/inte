const mapSensorType = (category) => {
    if (!category) {
      console.error("mapSensorType called without a category");
      throw new Error("Internal error: Sensor category is required");
    }
  
    console.log(`mapSensorType received: ${category}`); // Verifica qué se está recibiendo exactamente aquí
  
    const upperCaseCategory = category.toUpperCase();
    
    if (upperCaseCategory === 'ALL') {
      return ['gasDetector', 'ultrasonic', 'temperature', 'humidity'];
    }
  
    // Corrige las claves para que coincidan con lo que esperas recibir
    switch (category) {  // Usa `category` directamente si el case-sensitive no es un problema
      case 'gasDetector': return 'gasDetector';
      case 'ultrasonic': return 'ultrasonic';
      case 'temperature': return 'temperature';
      case 'humidity': return 'humidity';
      default:
        console.error(`mapSensorType received an unrecognized category: ${category}`);
        throw new Error(`Unrecognized sensor category: ${category}`);
    }
  };
  
  export default mapSensorType;
  