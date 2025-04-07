import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DeliveryManHomeScreen({ onLogout }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryManDetails, setDeliveryManDetails] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }

        const response = await fetch('https://egg.dordham.com/api/v1/get-delivery-man/6', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
          setDeliveries(data.deliveryManDeliveries);
        } else {
          setError(`API Error: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDeliveryClick = (delivery) => {
    navigation.navigate('DeliveryDetails', { deliveryDetails: delivery });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={onLogout} style={styles.logoutIcon}>
          <Icon name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Location and Contact Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Hajigabul district, Aghajanli village</Text>
        <Text style={styles.infoText}>Phone: +123 456 7890</Text>
        <Text style={styles.infoText}>Email: info@yumurtan1.az</Text>
      </View>

      {/* Deliveries Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deliveries</Text>
        {deliveries.length > 0 ? (
          deliveries.map((delivery) => (
            <TouchableOpacity
              key={delivery.id}
              style={styles.deliveryCard}
              onPress={() => handleDeliveryClick(delivery)}
            >
              <Text style={styles.deliveryText}>Delivery ID: {delivery.id}</Text>
              <Text style={styles.deliveryText}>Location: {delivery.delivery_location}</Text>
              <Text style={styles.deliveryText}>Status: {delivery.status}</Text>
              {delivery.packaging && (
                <Text style={styles.deliveryText}>
                  Packaging: {delivery.packaging.packing_serial}
                </Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No deliveries found.</Text>
        )}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for doing business with us!</Text>
        <Text style={styles.footerText}>For inquiries, please contact us at info@yumurtan1.az</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edada6',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  deliveryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deliveryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});