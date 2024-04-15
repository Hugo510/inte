import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

import DataFilteringModule from './DataFilteringModule';

const exportDataAsExcel = async (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    const wbout = XLSX.write(wb, {type: 'base64'});
    const uri = `${FileSystem.documentDirectory}data.xlsx`;
    await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri);
};

const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0 || !data[0] || typeof data[0] !== 'object') {
        throw new Error('Invalid data: Data must be an array of objects.');
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
        Object.values(row).map(field =>
            `"${field.toString().replace(/"/g, '""')}"` // Handle internal quotes and commas
        ).join(',')
    ).join('\n');

    return `${headers}\n${rows}`;
};

// Function to export data as CSV
const exportDataAsCSV = async (data) => {
    try {
        const csvData = convertToCSV(data);
        const fileName = `${FileSystem.documentDirectory}data.csv`;

        await FileSystem.writeAsStringAsync(fileName, csvData);
        await Sharing.shareAsync(fileName);
        Alert.alert('Export Successful', 'Your data has been successfully exported as CSV.');
    } catch (error) {
        console.error("CSV Export Error:", error);
        Alert.alert('Export Failed', `Failed to export data as CSV: ${error.message}`);
    }
};


// Función para exportar datos en formato JSON y compartirlos
const exportDataAsJSON = async (data) => {
    const fileName = `${FileSystem.documentDirectory}data.json`;
    await FileSystem.writeAsStringAsync(fileName, JSON.stringify(data));
    await Sharing.shareAsync(fileName);
};


// Componente de opciones avanzadas para gráficos
const AdvancedChartOptions = ({ graphData }) => {
    const [exportMenuVisible, setExportMenuVisible] = useState(false);
    const [mainMenuVisible, setMainMenuVisible] = useState(false);

    const [filteredData, setFilteredData] = useState(graphData);

    const handleFilter = (newData) => {
        setFilteredData(newData);
    };

    const toggleMainMenu = () => setMainMenuVisible(!mainMenuVisible);
    const openExportMenu = () => {
        setExportMenuVisible(true);
        setMainMenuVisible(false);
    };
    const closeExportMenu = () => setExportMenuVisible(false);

    return (
        <View>
            <Button title="Show Options" onPress={toggleMainMenu} />
            {mainMenuVisible && (
                <View>
                    <Button title="Export Data" onPress={openExportMenu} />
                    {Array.isArray(graphData) && <DataFilteringModule data={graphData} onFilter={setFilteredData} />}
                </View>
            )}
            {exportMenuVisible && (
                <View>
                    <Text>Select Export Format:</Text>
                    <Button title="As JSON" onPress={() => exportDataAsJSON(graphData)} />
                    <Button title="As CSV" onPress={() => exportDataAsCSV(graphData)} />
                    <Button title="As Excel" onPress={() => exportDataAsExcel(graphData)} />
                    <Button title="Back" onPress={closeExportMenu} />
                </View>
            )}
        </View>
    );
};

export default AdvancedChartOptions;
