// components/CustomText.js
import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ style, ...props }) => (
  <Text style={[{ fontFamily: 'WorkSans-Regular' }, style]} {...props} />
);

export default CustomText;
