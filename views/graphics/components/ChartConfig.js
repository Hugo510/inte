// ChartConfig.js
const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      rotation: '45',
      fontSize: "12",
      fontWeight: "bold", // Asegúrate de que las etiquetas sean legibles
    },
    decimalPlaces: 1, // Redondea los valores a 1 decimal
    formatXLabel: (label, index, labels) => {
      if (!Array.isArray(labels)) {
        console.error("formatXLabel: 'labels' debe ser un array.");
        return ''; // Devuelve un string vacío si labels no es un array
      }
      const interval = Math.ceil(labels.length / 10); // Dinamiza el intervalo basado en la cantidad de etiquetas
      return (index % interval === 0) ? label : '';
    },
    formatYLabel: (label) => {
      // Manejo de etiquetas del eje Y asegurándonos de que sean numéricas
      const numLabel = parseFloat(label);
      if (isNaN(numLabel)) {
        console.error("formatYLabel: La etiqueta debe ser un valor numérico, recibido: " + label);
        return label; // Devuelve la etiqueta original si no es numérica
      }
      return numLabel.toFixed(chartConfig.decimalPlaces); // Usa la propiedad decimalPlaces para formatear
    }
};

export default chartConfig;
