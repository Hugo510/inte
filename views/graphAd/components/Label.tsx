import { useFont, Text } from "@shopify/react-native-skia";
import React from "react";
import type { SharedValue } from "react-native-reanimated";
import { interpolate, useDerivedValue } from "react-native-reanimated";

import type { Graphs } from "../Model";
import { PADDING } from "../Model";

import type { GraphState } from "./Selection";

const sfMono = require("./Severance/SF-Mono-Medium.otf");
const format = (value: number) => {
    "worklet";
    return "$ " + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  interface LabelProps {
    y: SharedValue<number>;
    state: SharedValue<GraphState>;
    graphs: Graphs;
    width: number;
    height: number;
  }
  
  export const Label = ({ state, y, graphs, width, height }: LabelProps) => {
    const titleFont = useFont(sfMono, 64);
    const subtitleFont = useFont(sfMono, 24);
    const translateY = height + PADDING;
    const AJUSTED_SIZE = height - PADDING * 2;
  
    const text = useDerivedValue(() => {
      const graph = graphs[state.value.current];
      const interpolatedValue = y.value; // Asumiendo que y.value es el valor que quieres mostrar. Adapta esta lógica según sea necesario.
      return format(interpolatedValue);
    }, [y, state]);
  
    const subtitle = useDerivedValue(() => {
      // Aquí podrías calcular algún otro dato relevante como cambio porcentual, diferencia, etc., basado en el gráfico actual
      return "+ $314,15"; // Ejemplo estático, reemplazar con lógica dinámica si es necesario
    });
  
    const titleX = useDerivedValue(() => {
      if (!titleFont) return 0;
      const title = text.value;
      const titleWidth = titleFont.getTextWidth(title);
      return width / 2 - titleWidth / 2;
    }, [text, titleFont, width]);
  
    const subtitleX = useDerivedValue(() => {
      const subtitleText = subtitle.value;
      const subtitleWidth = subtitleFont?.getTextWidth(subtitleText) ?? 0;
      return width / 2 - subtitleWidth / 2;
    }, [subtitle, subtitleFont, width]);
  
    return (
      <>
        <Text
          x={titleX.value}
          y={translateY - 120}
          text={text.value}
          font={titleFont}
          color="white"
        />
        <Text
          x={subtitleX.value}
          y={translateY - 60}
          text={subtitle.value}
          font={subtitleFont}
          color="#8E8E93"
        />
      </>
    );
  };
  