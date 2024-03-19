import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import styles from './dashboardScreen.styles';
import { Client, Message } from 'paho-mqtt';

const DashboardScreen = () => {
    const [direction, setDirection] = useState('d'); // Estado inicial para la dirección
    const [stepsValue, setStepsValue] = useState(0); // Estado inicial para los pasos
    const [speedValue, setSpeedValue] = useState(0.0001); // Estado inicial para la velocidad
    const [client, setClient] = useState(null);

    useEffect(() => {
        const clientId = 'clientId_' + Math.random().toString(16).slice(2, 8);
        const newClient = new Client('test.mosquitto', 1883, clientId);

        const options = {
            useSSL: false,
            onSuccess: () => {
                console.log('Conectado a MQTT');
            },
            onFailure: (error) => {
                console.log('Conexión fallida:', error);
            },
        };
        newClient.connect(options);
        setClient(newClient);

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    const sendAllMessages = () => {
        sendMessage('direccion', direction);
        sendMessage('pasos', stepsValue.toString());
        sendMessage('velocidad', speedValue.toFixed(4));
    };

    const sendMessage = (category, value) => {
        if (client) {
            const topic = `/chava/${category}`;
            const message = new Message(value);
            message.destinationName = topic;
            client.send(message);
            console.log(`Enviando mensaje a MQTT: ${value}`);
            console.log(`Topic: ${message.destinationName}`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <Picker
                selectedValue={direction}
                onValueChange={setDirection}
                style={{width: '100%', height: 50}}>
                <Picker.Item label="Derecha" value="d" />
                <Picker.Item label="Izquierda" value="i" />
            </Picker>
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={0}
                maximumValue={10000}
                step={1}
                value={stepsValue}
                onValueChange={setStepsValue}
            />
            <Slider
                style={{width: '100%', height: 40}}
                minimumValue={0.0001}
                maximumValue={0.0099}
                step={0.0001}
                value={speedValue}
                onValueChange={setSpeedValue}
            />
            <TouchableOpacity
                style={styles.sendButton}
                onPress={sendAllMessages}>
                <Text style={styles.sendButtonText}>Enviar Todo</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DashboardScreen;
