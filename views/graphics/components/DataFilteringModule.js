// DataFilteringModule.js
import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet } from 'react-native';

const DataFilteringModule = ({ data, onFilter }) => {
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = text => {
        setFilterText(text);
    };

    const applyFilter = () => {
        // This is a placeholder for filter logic
        // Implement filtering logic based on your data structure
        const filteredData = data.filter(item => item.name.includes(filterText));
        onFilter(filteredData);
    };

    return (
        <View style={styles.container}>
            <Text>Enter filter criteria:</Text>
            <TextInput
                style={styles.input}
                onChangeText={handleFilterChange}
                value={filterText}
                placeholder="Type here..."
            />
            <Button title="Apply Filter" onPress={applyFilter} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default DataFilteringModule;
