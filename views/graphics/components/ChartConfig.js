// ChartConfig.js
export const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForLabels: {
    rotation: '45',
    fontSize: "12",
    fontWeight: "bold",
  },
  decimalPlaces: 1,
  
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  },
  formatXLabel: (label, index, labels) => {
    // Muestra el label solo si es diferente del anterior o es el primero
    if (index === 0 || label !== labels[index - 1]) {
      return label;
    }
    return '';
  },  
  formatYLabel: (label) => {
    const numLabel = parseFloat(label);
    if (isNaN(numLabel)) {
      console.error("formatYLabel: The label must be a numeric value, received: " + label);
      return label;
    }
    return numLabel.toFixed(1);
  }
};
