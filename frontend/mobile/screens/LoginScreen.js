import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleAuth = () => {
    // Minimal auth logic (will be replaced later)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Dashboard');
    }, 1500);
  };

  const handleEmergencyReport = () => {
    navigation.navigate('ReportIncident', { isEmergency: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0A84FF', '#0066CC']}
        style={styles.background}
      >
        {/* Emergency Button */}
        {/* <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyReport}
        >
          <Text style={styles.emergencyText}>🚨 EMERGENCY REPORT</Text>
        </TouchableOpacity> */}

        <View style={styles.logoContainer}>
          {/* <Image 
            source={require('../assets/logo-white.png')} 
            style={styles.logo}
          /> */}
          <Text style={styles.tagline}>Your Lifeline During Disasters</Text>
        </View>

        <Surface style={styles.card} elevation={4}>
          <Text variant="titleMedium" style={styles.authTitle}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </Text>

          {isSignup && (
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
              style={styles.input}
              autoCapitalize="words"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon 
              icon={secureText ? "eye-off" : "eye"} 
              onPress={() => setSecureText(!secureText)}
            />}
            style={styles.input}
            secureTextEntry={secureText}
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Button 
            mode="contained"
            onPress={handleAuth}
            loading={loading}
            disabled={loading}
            style={styles.authButton}
            labelStyle={styles.buttonLabel}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Button 
              mode="text" 
              onPress={() => setIsSignup(!isSignup)}
              labelStyle={styles.toggleButtonLabel}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </Button>
          </View>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('ReportIncident', { isAnonymous: true })}
            style={styles.anonymousButton}
            labelStyle={styles.anonymousButtonLabel}
          >
            🚨 EMERGENCY REPORT
          </Button>
        </Surface>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  emergencyButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  emergencyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  tagline: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'white',
  },
  authTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  authButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 6,
    backgroundColor: '#0A84FF',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
  },
  toggleButtonLabel: {
    color: '#0A84FF',
    fontWeight: 'bold',
  },
  anonymousButton: {
    marginTop: 20,
    borderColor: '#FF3B30',
    borderRadius: 8,
  },
  anonymousButtonLabel: {
    color: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default Login;