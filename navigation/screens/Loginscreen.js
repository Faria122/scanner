import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      const response = await fetch('https://egg.dordham.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('API Response:', data); 
      12122

      if (response.ok) {
        await AsyncStorage.setItem('auth_token', data.access_token);
        
        // Decode the token to get user_type
        const decodedToken = jwtDecode(data.access_token);
        console.log('Decoded Token:', decodedToken);
        
        const userType = decodedToken.user_type ? parseInt(decodedToken.user_type, 10) : 0;
        console.log('User Type from Token:', userType);
        
        await AsyncStorage.setItem('user_type', userType.toString());
  
        
        if (userType === 1) {
          Alert.alert('Success', 'Logged in as Customer!');
        } else if (userType === 2) {
          Alert.alert('Success', 'Logged in as Driver!');
        } else if (userType === 3) {
          Alert.alert('Success', 'Logged in as Delivery Man!');
        } else if (userType === 6) {
          Alert.alert('Success', 'Logged in as Loader!');
        } else {
          Alert.alert('Success', 'Logged in successfully!');
        }
        onLogin(userType);
      } else {
        Alert.alert('Error', data.message || 'Invalid login credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#edada6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;