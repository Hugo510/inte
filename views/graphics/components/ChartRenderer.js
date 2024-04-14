import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import getChartData from './GetChartData';
import styles from '../graphicsScreen.styles';

const ChartRenderer = ({ graphData, screenWidth, chartConfig }) => {
  console.log(graphData);
  if (!graphData || Object.keys(graphData).length === 0) {
    return <Text>No data available to display charts. Please check sensor connections or settings.</Text>;
  }

  return (
    <ScrollView>
      {Object.keys(graphData).map(category => {
        const dataForCategory = graphData[category];
        if (!dataForCategory || !Array.isArray(dataForCategory) || dataForCategory.length === 0) {
          console.error(`Data for ${category} is not valid or empty.`);
          return <Text key={category} style={{ color: 'red', textAlign: 'center' }}>
            No valid data for {category}. Please check sensor data.
          </Text>;
        }

        try {
          const chartData = getChartData(dataForCategory, category);
          
          return (
            <View key={category} style={styles.chartContainer}>
              <Text style={{ textAlign: 'center' }}>{category}</Text>
              <BarChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
              />
            </View>
          );
        } catch (error) {
          console.error(`Failed to render chart for ${category}: ${error}`);
          return <Text key={category} style={{ color: 'red', textAlign: 'center' }}>
            Error in {category}: {error.message}. Please check sensor data.
          </Text>;
        }
      })}
    </ScrollView>
  );
};

export default ChartRenderer;
