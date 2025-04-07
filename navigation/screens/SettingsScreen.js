import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [extractedData, setExtractedData] = useState("");
  const [sound, setSound] = useState(); 


  const {driverId, loadingType } = route.params || {};

    // Load the sound when component mounts
    useEffect(() => {
      const loadSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/beep.mp3') 
        );
        setSound(sound);
      };
  
      loadSound();
  
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, []);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.replayAsync(); 
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  const sendToApi = async (qrData) => {
    try {
      await playSound();
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Sending request with:', {
        driver_id: driverId,
        type: loadingType,
        qr_code: qrData
      });

      const response = await fetch(`https://egg.dordham.com/api/v1/egg-loader-store/${qrData}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver_id: driverId,
          type: loadingType,
          qr_code: qrData
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('<html') ? 
          'Server error - please try later' : 
          `Unexpected response: ${text.substring(0, 50)}...`);
      }
      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        Alert.alert("Success", "Data sent successfully!");
      } else {
        throw new Error(data.message || 'Failed to store loading data');
      }

      Alert.alert("Success", "Data sent successfully!");
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", error.message);
    }
  };
  const handleBarcodeScanned = ({ data }) => {
    try {
      const idMatch = data.match(/N:\s*(SR-\d+)/);
      if (!idMatch) {
        throw new Error("Invalid QR format - couldn't find ID");
      }
      
      const qrId = idMatch[1]; 
      setScanned(true);
      setExtractedData(qrId);
      sendToApi(qrId);
    } catch (error) {
      Alert.alert("QR Error", error.message);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Scan QR Code</Text>
      <Text style={styles.infoText}>Driver ID: {driverId}</Text>
      <Text style={styles.infoText}>Type: {loadingType}</Text>

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
      {extractedData !== "" && (
        <Text style={styles.resultText}>Scanned Data: {extractedData}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "green",
  },
});
