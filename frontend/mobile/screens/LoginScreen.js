import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = 'http://localhost:5000/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // This would be your actual API call
      // const response = await axios.post(`${API_URL}/users/login`, { email, password });
      
      // For demo purposes, we'll simulate a successful login
      await AsyncStorage.setItem('userToken', 'demo-token');
      setLoading(false);
      navigation.replace('Dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Text style={styles.title}>Sahyog</Text>
          <Text style={styles.subtitle}>Disaster Management System</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <Button 
            mode="contained" 
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 10,
  },
});

export default LoginScreen;