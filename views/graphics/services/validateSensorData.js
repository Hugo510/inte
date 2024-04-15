// validateSensorData.js

/**
 * Validates sensor data based on the type of sensor.
 * @param {Object} data - The entire data object containing all sensor data.
 * @param {string} sensorType - The type of sensor (e.g., 'gasDetector', 'humidity', 'temperature', 'ultrasonic').
 * @returns {boolean} True if the data is valid, false otherwise.
 */

const sensorKeyMap = {
    gasdetector: 'gasDetector', // Mapea las variantes comunes a la clave exacta utilizada en los datos
    humidity: 'humidity',
    temperature: 'temperature',
    ultrasonic: 'ultrasonic'
};

const validateSingleSensorData = (data, sensorType) => {
    if (!data || !data[sensorType]) {
        console.error(`Error: Data object for ${sensorType} is undefined or null.`);
        return false;
    }
    const sensorData = data[sensorType];

    if (!Array.isArray(sensorData.datasets) || sensorData.datasets.length === 0) {
        console.error(`Error: 'datasets' for ${sensorType} is missing, not an array, or empty.`);
        return false;
    }

    if (!sensorData.datasets[0].data || !Array.isArray(sensorData.datasets[0].data) || sensorData.datasets[0].data.length === 0) {
        console.error(`Error: 'data' in datasets[0] for ${sensorType} is missing, not an array, or contains no data.`);
        return false;
    }

    if (!sensorData.labels || !Array.isArray(sensorData.labels) || sensorData.labels.length === 0) {
        console.error(`Error: 'labels' for ${sensorType} are missing, not an array, or empty.`);
        return false;
    }

    console.log(`Validation passed for ${sensorType}.`);
    return true;
};



const validateSensorData = (data, sensorTypes) => {
    if (!data) {
        console.error("Error: The main data object is null or undefined.");
        return false;
    }

    if (sensorTypes.toLowerCase() === 'all') {
        console.log("Validating all sensors.");
        return Object.keys(data).every(sensorType => {
            return validateSingleSensorData(data, sensorType);
        });
    } else {
        const normalizedSensorType = sensorKeyMap[sensorTypes.toLowerCase()] || sensorTypes;
        console.log(`Validating single sensor type: ${normalizedSensorType}`);
        return validateSingleSensorData(data, normalizedSensorType);
    }
};


export default validateSensorData;
