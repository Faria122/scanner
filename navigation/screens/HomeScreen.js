import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({ onLogout }) {

  console.log('onLogout prop in HomeScreen:', onLogout);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [driverDeliveries, setDriverDeliveries] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }

        const response = await fetch('https://egg.dordham.com/api/v1/get-driver/3', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        if (response.ok) {
          setDriverDetails({
            name: data.driverDeliveries[0].driver.name,
            capacity: data.driverDeliveries[0].driver.truck_capacity,
            remainingCapacity: data.remainingCapacity,
            weight: data.driverDeliveries[0].driver.truck_weight,
            totalProducts: data.driverDeliveries[0].how_many_box,
            qrCode: '[QR Code]',
          });

          setProductDetails({
            package: data.driverDeliveries[0].packaging.packing_serial,
            status: data.driverDeliveries[0].status,
            quantity: data.driverDeliveries[0].how_many_box,
            qrCode: '[QR Code]',
          });

          setDriverDeliveries(data.driverDeliveries);
        } else {
          setError(`API Error: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
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

  const handlePackageClick = () => {
    if (driverDeliveries && driverDeliveries.length > 0) {
      navigation.navigate('PackageDetails', { packageDetails: { driverDeliveries } });
    } else {
      console.error('No driver deliveries found.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity onPress={onLogout} style={styles.logoutIcon}>
          <Icon name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Hajigabul district, Aghajanli village</Text>
        <Text style={styles.infoText}>Phone: +123 456 7890</Text>
        <Text style={styles.infoText}>Email: info@yumurtan1.az</Text>
      </View>

      {driverDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver Details</Text>
          <View style={styles.verticalTable}>
            <View style={styles.verticalTableRow}>
              <Text style={styles.verticalTableLabel}>Name:</Text>
              <Text style={styles.verticalTableValue}>{driverDetails.name}</Text>
            </View>
          </View>
        </View>
      )}

      {productDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          <View style={styles.horizontalTable}>
            <View style={styles.horizontalTableRow}>
              <Text style={styles.horizontalTableHeader}>Package</Text>
              <Text style={styles.horizontalTableHeader}>Status</Text>
              <Text style={styles.horizontalTableHeader}>Quantity</Text>
              <Text style={styles.horizontalTableHeader}>QR Code</Text>
            </View>
            <View style={styles.horizontalTableRow}>
              <TouchableOpacity onPress={handlePackageClick}>
                <Text style={styles.horizontalTableCell}>{productDetails.package}</Text>
              </TouchableOpacity>
              <Text style={styles.horizontalTableCell}>{productDetails.status}</Text>
              <Text style={styles.horizontalTableCell}>{productDetails.quantity} Ton</Text>
              <Text style={styles.horizontalTableCell}>{productDetails.qrCode}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.signatureSection}>
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Customer Signature</Text>
          </View>
        </View>
      </View>

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
    backgroundColor: '#D7D8DA',
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
  verticalTable: {
    borderWidth: 1,
    borderColor: '#050608',
    borderRadius: 5,
    padding: 10,
  },
  verticalTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verticalTableLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  verticalTableValue: {
    fontSize: 16,
    color: '#333',
  },
  horizontalTable: {
    borderWidth: 1,
    borderColor: '#050608',
    borderRadius: 5,
  },
  horizontalTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC2C8',
  },
  horizontalTableHeader: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#lFC2C8',
  },
  horizontalTableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  signatureSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signatureBox: {
    width: '48%',
    height: 100,
    borderWidth: 1,
    borderBottomColor: '#555',
    borderColor: '#BFC2C8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
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
});