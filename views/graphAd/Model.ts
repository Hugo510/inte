import type { SkPath } from "@shopify/react-native-skia";

import sensorDataJson from "./data.json";
import { curveLines } from "./Math";

export const PADDING = 16;

export const COLORS = ["#F69D69", "#FFC37D", "#61E0A1", "#31CBD1"];

interface SensorDatum {
  timestamp: string;
  value: number;
}

interface SensorData {
  values: SensorDatum[];
  distances: SensorDatum[];
  temperatures: SensorDatum[];
}

const sensorData = sensorDataJson.sensorData as SensorData;
const POINTS = 20;

const buildGraph = (
  sensorDatum: SensorDatum[],
  label: string,
  WIDTH: number,
  HEIGHT: number
) => {
  const AJUSTED_SIZE = HEIGHT - PADDING * 2;
  // Asumiendo que quieres los últimos N puntos, donde N=POINTS
  const recentData = sensorDatum.slice(-POINTS);
  const formattedValues = recentData
    .map((datum) => [new Date(datum.timestamp).getTime(), datum.value] as [number, number])
    .sort((a, b) => a[0] - b[0]); // Asegurar que estén ordenados por timestamp
  const timestamps = formattedValues.map((value) => value[0]);
  const values = formattedValues.map((value) => value[1]);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const points = formattedValues.map(([timestamp, value]) => {
    const x = ((timestamp - minTimestamp) / (maxTimestamp - minTimestamp)) * WIDTH;
    const y = ((value - minValue) / (maxValue - minValue)) * AJUSTED_SIZE;
    return { x, y };
  });
  points.push({ x: WIDTH + 10, y: points[points.length - 1].y });
  const path = curveLines(points, 0.1, "complex");
  return {
    label,
    minValue,
    maxValue,
    path,
  };
};

export interface Graph {
  label: string;
  value: number;
  data: {
    label: string;
    minValue: number;
    maxValue: number;
    path: SkPath;
  };
}

export type Graphs = Graph[];

export const getGraph = (width: number, height: number) => [
  {
    label: "Values",
    value: 0,
    data: buildGraph(sensorData.values, "Values", width, height),
  },
  {
    label: "Distances",
    value: 1,
    data: buildGraph(sensorData.distances, "Distances", width, height),
  },
  {
    label: "Temperatures",
    value: 2,
    data: buildGraph(sensorData.temperatures, "Temperatures", width, height),
  },
];

export type GraphIndex = 0 | 1 | 2;
