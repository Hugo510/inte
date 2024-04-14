const getChartData = (sensorData, sensorType) => {
    console.log("Data recibida en getChartData antes de cualquier operación", JSON.stringify(sensorData));

    if (!sensorData || !Array.isArray(sensorData) || sensorData.length === 0) {
        console.error(`No data available for sensor type: ${sensorType}`);
        throw new Error(`No data available for sensor type: ${sensorType}`);
    }

    let filteredData = [];
    let values = [];

    // Procesar datos basados en el tipo de sensor
    try {
        filteredData = sensorData.filter(item => {
            let valid = true;

            // Validar timestamp
            if (!item.timestamp || isNaN(new Date(item.timestamp).getTime())) {
                console.log(`Discarding item due to invalid timestamp: ${item.timestamp}`, JSON.stringify(item));
                valid = false;
            }

            // Validar según el tipo de sensor
            switch (sensorType) {
                case 'ultrasonic':
                    if (typeof item.distance !== 'number') {
                        console.log(`Discarding item due to invalid 'distance':`, JSON.stringify(item));
                        valid = false;
                    }
                    break;
                case 'gasDetector':
                    if (typeof item.value !== 'number') {
                        console.log(`Discarding item due to invalid 'value':`, JSON.stringify(item));
                        valid = false;
                    }
                    break;
                case 'temperature':
                    if (typeof item.temperature !== 'number') {
                        console.log(`Discarding item due to invalid 'temperature':`, JSON.stringify(item));
                        valid = false;
                    }
                    break;
                case 'humidity':
                    if (typeof item.humidity !== 'number') {
                        console.log(`Discarding item due to invalid 'humidity':`, JSON.stringify(item));
                        valid = false;
                    }
                    break;
                default:
                    console.error(`Unhandled sensor type: ${sensorType}`);
                    throw new Error(`Unhandled sensor type: ${sensorType}`);
            }
            return valid;
        });

        // Si después de filtrar no quedan datos válidos
        if (filteredData.length === 0) {
            console.error(`No valid data after filtering for sensor type: ${sensorType}`);
            throw new Error(`No valid data available for sensor type: ${sensorType}`);
        }

        // Mapear valores de datos válidos para el gráfico
        values = filteredData.map(item => {
            switch (sensorType) {
                case 'ultrasonic': return item.distance;
                case 'gasDetector': return item.value;
                case 'temperature': return item.temperature;
                case 'humidity': return item.humidity;
                default: return null;
            }
        });
    } catch (error) {
        console.error(`Error processing data for ${sensorType}:`, error);
        throw error;
    }

    if (values.includes(null) || values.length === 0) {
        console.error(`Incomplete data for ${sensorType}, possibly due to invalid processing steps.`);
        throw new Error(`Incomplete data for ${sensorType}`);
    }

    
    let labels = filteredData.map(item => new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }));

    console.log("Filtered data:", filteredData);
    console.log("Data array for dataset:", values);
    console.log("Labels for chart:", labels);


    return {
        labels: labels,
        datasets: [{ data: values }],
        legend: ["Sensor Data"]
    };
};

export default getChartData;
