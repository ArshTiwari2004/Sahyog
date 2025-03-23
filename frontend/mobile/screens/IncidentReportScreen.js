import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Chip, Card, Text, Snackbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

const API_URL = 'http://localhost:5000/api';

const IncidentReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
      
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const handleSeverityChange = (value) => {
    setSeverity(value);
  };

  const handleTakePhoto = async () => {
    setCameraVisible(true);
  };

  const handleCameraClose = () => {
    setCameraVisible(false);
  };

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      
      // For demo, we're just simulating an API request
      // In a real app, you would upload the image and send the data to your API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSnackbarMessage('Incident reported successfully!');
      setSnackbarVisible(true);
      setLoading(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSeverity('Medium');
      setImage(null);
      
      // Go back to dashboard after delay
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting incident report:', error);
      setSnackbarMessage('Failed to submit report. Please try again.');
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ratio="16:9"
        >
          <View style={styles.cameraControls}>
            <Button 
              mode="contained" 
              onPress={handleCameraClose}
              style={styles.cameraButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={() => {
                // Here you would actually take a photo
                // For demo purposes, we're just closing the camera
                setImage('dummy-image-path');
                setCameraVisible(false);
              }}
              style={styles.cameraButton}
            >
              Take Photo
            </Button>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Report an Incident" />
        <Card.Content>
          <TextInput
            label="Incident Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          
          <Text style={styles.label}>Severity Level:</Text>
          <View style={styles.chips}>
            {['Low', 'Medium', 'High'].map((level) => (
              <Chip
                key={level}
                selected={severity === level}
                onPress={() => handleSeverityChange(level)}
                style={[
                  styles.chip,
                  severity === level && 
                  (level === 'Low' ? styles.lowSeverity : 
                   level === 'Medium' ? styles.mediumSeverity : 
                   styles.highSeverity)
                ]}
              >
                {level}
              </Chip>
            ))}
          </View>
          
          {location ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={location}
              >
                <Marker coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude
                }} />
              </MapView>
              <Text style={styles.locationText}>
                Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            </View>
          ) : (
            <Button 
              mode="outlined" 
              onPress={async () => {
                const location = await Location.getCurrentPositionAsync({});
                setLocation({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }}
              style={styles.locationButton}
            >
              Get Current Location
            </Button>
          )}
          
          <Button 
            mode="outlined" 
            icon="camera"
            onPress={handleTakePhoto}
            style={styles.button}
          >
            {image ? 'Change Photo' : 'Take Photo'}
          </Button>
          
          {image && (
            <Text style={styles.photoText}>Photo captured successfully</Text>
          )}
          
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}
          >
            Submit Report
          </Button>
        </Card.Content>
      </Card>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  lowSeverity: {
    backgroundColor: '#81c784',
  },
  mediumSeverity: {
    backgroundColor: '#ffb74d',
  },
  highSeverity: {
    backgroundColor: '#e57373',
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  locationButton: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  photoText: {
    marginBottom: 16,
    color: '#4caf50',
  },
  submitButton: {
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraButton: {
    flex: 0.4,
  },
});

export default IncidentReportScreen;