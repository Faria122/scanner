import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PackageDetailsScreen = ({ route }) => {

  console.log('Route Params:', route.params);
  // Add default values for packageDetails and driverDeliveries
  const { packageDetails = {} } = route.params || {};
 // console.log('Package Details:', packageDetails);
  const driverDeliveries = packageDetails.driverDeliveries || [];
 // console.log('Driver Deliveries:', driverDeliveries);



  // Handle case where driverDeliveries is empty or undefined
  if (!driverDeliveries.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No delivery details found.</Text>
      </View>
    );
  }

  // Extract the first delivery and driver_products
  const delivery = driverDeliveries[0] || {};
  const driverProducts = delivery.driver_products || [];

  // Log the data for debugging
  console.log('Delivery:', delivery);
  console.log('Driver Products:', driverProducts);

  // Calculate total weight
  const totalWeight = driverProducts.reduce((sum, product) => sum + (product.egg_management?.weight || 0), 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <Text style={styles.header}>yumurtan1</Text>
        <Text style={styles.infoText}>Hajigabul district, Aghajanli village</Text>
        <Text style={styles.infoText}>Phone: +123 456 7890</Text>
        <Text style={styles.infoText}>Email: info@yumurtan1.az</Text>

        {/* Products Section */}
        <Text style={styles.sectionTitle}>Products:</Text>

        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Product Name</Text>
          <Text style={styles.tableHeader}>Product Serial</Text>
          <Text style={styles.tableHeader}>Weight</Text>
        </View>

        {/* Table Rows */}
        {driverProducts.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{product.egg_management?.product_name_az}</Text>
            <Text style={styles.tableCell}>{product.egg_management?.product_serial}</Text>
            <Text style={styles.tableCell}>{product.egg_management?.weight} kg</Text>
          </View>
        ))}

        {/* Total Weight */}
        <View style={styles.totalWeightContainer}>
          <Text style={styles.totalWeightLabel}>Total Weight:</Text>
          <Text style={styles.totalWeightValue}>{totalWeight} kg</Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Customer Signature</Text>
          </View>
        </View>

        {/* Footer Section */}
        <Text style={styles.footerText}>Thank you for doing business with us!</Text>
        <Text style={styles.footerText}>For inquiries, please contact us at info@yumurtan1.az</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  totalWeightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  totalWeightLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalWeightValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
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
  footerText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    marginBottom:40
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,  

  },
});
export default PackageDetailsScreen;