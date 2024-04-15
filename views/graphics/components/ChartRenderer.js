import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import getChartData from './GetChartData'; // Ensure this method prepares the data correctly
import styles from '../graphicsScreen.styles';

const ChartRenderer = ({ graphData, screenWidth, chartConfig }) => {
  console.log("Received graphData in ChartRenderer:", JSON.stringify(graphData));

  if (!graphData || Object.keys(graphData).length === 0) {
    return (
      <View style={styles.emptyDataContainer}>
        <Text>No data available to display charts. Please check sensor connections or settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
      <ScrollView contentContainerStyle={{ width: screenWidth * 2 }}>
      {Object.keys(graphData).map((category) => {
        const dataForCategory = graphData[category];

        // Verify that labels are an array
        console.log("Labels for " + category + ":", JSON.stringify(dataForCategory.labels));
        if (!Array.isArray(dataForCategory.labels) || dataForCategory.labels.length === 0) {
          console.error(`Labels for ${category} are not an array or are empty:`, JSON.stringify(dataForCategory.labels));
          return (
            <Text key={category} style={[styles.errorText, { marginTop: 20 }]}>
              Labels for {category} are not valid or empty. Please check the data formatting.
            </Text>
          );
        }


        try {
          const chartData = {
            labels: dataForCategory.labels,
            datasets: dataForCategory.datasets,
            legend: dataForCategory.legend || ['Sensor Data'] // Provide default legend if missing
          };
          console.log("labels for Barchart", chartData.labels)
          console.log("chartConfig previous pass to barchart", chartConfig)

          return (
            <View key={category} style={[styles.chartContainer, { width: screenWidth * 1.5 }]}>
              <Text style={styles.chartTitle}>{category}</Text>
              <LineChart
                
                data={chartData}
                width={screenWidth * 1.5}
                height={256}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                fromZero={true}
                yAxisInterval={1} // optional, defaults to 1
                bezier

              />
            </View>
          );
        } catch (error) {
          console.error(`Failed to render chart for ${category}: ${error}`, JSON.stringify(chartData));
          return (
            <Text key={category} style={[styles.errorText, { marginTop: 20 }]}>
              Error in {category}: {error.message}. Please review the data formatting.
            </Text>
          );
        }
      })}
    </ScrollView>
    </ScrollView>
  );
};

export default ChartRenderer;
