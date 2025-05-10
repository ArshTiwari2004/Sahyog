import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Redirect to Login after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sahyog</Text>
      <Text style={styles.subtitle}>Your Lifeline During Disasters</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 52,
    fontWeight: '900', // Ultra-bold
    color: '#2c3e50', // Deep blue-gray for an attractive, modern look
    letterSpacing: -1.5, // Tighten letter spacing for a more compact feel
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#7f8c8d', // Soft gray for subtlety
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});

export default SplashScreen;