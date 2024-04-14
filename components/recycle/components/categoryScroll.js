import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const categories = ['ALL', 'gasDetector', 'ultrasonic', 'temperature', 'humidity'];

const CategoryScroll = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { colors } = useTheme();

  const handleSelectCategory = (category) => {
    console.log("Categoria seleccionada en CategoryScroll:", category);
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            { backgroundColor: selectedCategory === category ? colors.primary : colors.accent }
          ]}
          onPress={() => handleSelectCategory(category)}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  categoryButton: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default CategoryScroll;
