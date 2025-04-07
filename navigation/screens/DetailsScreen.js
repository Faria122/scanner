import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';


export default function DetailsScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [sub, setSub] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        

        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          setError("Token Not found");
          return;
        }

        const decodedToken = jwtDecode(token);
        const subValue = decodedToken.sub;
        setSub(subValue);


        const apiUrl = `https://egg.dordham.com/api/v1/product-deliveries/${subValue}`;


        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const rawResponse = await response.text();
        console.log('HTTP Status:', response.status);
        console.log('Raw Response:', rawResponse);

        if (response.ok) {
          const jsonData = JSON.parse(rawResponse);
          setData(jsonData.data); // Extract data
        } else {
          setError(`Server Error: ${response.status}`);
        }
      } catch (err) {
        setError('Fetch Error: Unable to fetch data');
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (index) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index], // expand state 
    }));
  };
  const renderCustomerData = (customerData) => {
    return Object.values(customerData).map((customer, index) => (
      <View key={index} style={styles.card}>
        <Text
          onPress={() => navigation.navigate('Home')}
          style={{ fontSize: 26, fontWeight: 'bold' }}
        >
          Details Screen
        </Text>
        <Text style={styles.header}>Customer Name: {customer.customer.name}</Text>
        <Text>Email: {customer.customer.email}</Text>
        <Text>Phone: {customer.customer.phone_number}</Text>
        <Text>Address: {customer.customer.address}</Text>

        {/* Expand/Collapse button */}
        <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {expanded[index] ? '-' : '+'} Deliveries
          </Text>
        </TouchableOpacity>

        {/* Conditionally render deliveries */}
        {expanded[index] && (
          <View>
            <Text style={styles.subHeader}>Deliveries:</Text>
            {customer.product_deliveries.map((delivery, idx) => (
              <View key={idx} style={styles.delivery}>
                <Text>Delivery ID: {delivery.id}</Text>
                <Text>Note: {delivery.note}</Text>
                <Text>Product: {delivery.egg_management.product_name_az}</Text>
                <Text>Size: {delivery.egg_management.size}</Text>
                <Text>Weight: {delivery.egg_management.weight}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data ? (
        <View marginTop='30'>
          <Text style={styles.title}>Total Deliveries: {data.total_deliveries}</Text>
          {renderCustomerData(data.customer_data)}
        </View>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  delivery: {
    marginLeft: 10,
    marginBottom: 10,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },

  expandButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});















