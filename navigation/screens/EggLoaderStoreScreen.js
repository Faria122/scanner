import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function EggLoaderStoreScreen({ navigation }) {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingType, setLoadingType] = useState('Loaded');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDrivers, setIsFetchingDrivers] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsFetchingDrivers(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('https://egg.dordham.com/api/v1/egg-loader-drivers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Drivers API Response:', data);

        if (response.ok) {
          setDrivers(data.data || []);
          if (data.data && data.data.length > 0) {
            setSelectedDriver(data.data[0].id.toString());
          }
        } else {
          throw new Error(data.message || 'Failed to fetch drivers');
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
        Alert.alert('Error', error.message);
      } finally {
        setIsFetchingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleNext = () => {
    if ( !selectedDriver) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Pass the form data to the scanner screen
    navigation.navigate('Settings', {
      //loaderId,
      driverId: selectedDriver,
      loadingType
    });
  };

  if (isFetchingDrivers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }



  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Egg Loader Store</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Enter Loading Details</Text>

       

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Driver</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDriver}
              onValueChange={(itemValue) => setSelectedDriver(itemValue)}
              style={styles.picker}
              dropdownIconColor="#6200ee"
            >
              {drivers.map((driver) => (
                <Picker.Item 
                  key={driver.id} 
                  label={`${driver.name} (${driver.phone})`} 
                  value={driver.id.toString()} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Loading Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioButton, loadingType === 'Loaded' && styles.radioButtonSelected]}
              onPress={() => setLoadingType('Loaded')}
            >
              <Text style={styles.radioText}>Loaded</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radioButton, loadingType === 'Unloaded' && styles.radioButtonSelected]}
              onPress={() => setLoadingType('Unloaded')}
            >
              <Text style={styles.radioText}>Unloaded</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7D8DA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7D8DA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#edada6',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  radioButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#edada6',
    borderColor: '#edada6',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#edada6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
});