import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, Text } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const DashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [region, setRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // In a real app, you would fetch this data from your API
      try {
        // const incidentsResponse = await axios.get(`${API_URL}/incidents`);
        // const alertsResponse = await axios.get(`${API_URL}/alerts`);
        
        // Mock data for demo
        const mockIncidents = [
          { id: 1, type: 'Flood', location: 'Mumbai', severity: 'High', lat: 19.0760, lng: 72.8777 },
          { id: 2, type: 'Earthquake', location: 'Delhi', severity: 'Medium', lat: 28.6139, lng: 77.2090 },
        ];
        
        const mockAlerts = [
          { id: 1, type: 'Cyclone Warning', message: 'Cyclone approaching eastern coast', timestamp: new Date() },
          { id: 2, type: 'Flood Alert', message: 'Heavy rainfall expected in western regions', timestamp: new Date() },
        ];
        
        setIncidents(mockIncidents);
        setAlerts(mockAlerts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text>Loading dashboard data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mapCard}>
        <Card.Content style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
          >
            {incidents.map((incident) => (
              <Marker
                key={incident.id}
                coordinate={{ latitude: incident.lat, longitude: incident.lng }}
                title={incident.type}
                description={`${incident.location} - ${incident.severity}`}
              />
            ))}
          </MapView>
        </Card.Content>
        <Card.Title title="Active Incidents" />
      </Card>

      <View style={styles.actionsContainer}>
        <Button 
          mode="contained" 
          style={styles.actionButton} 
          icon="alert"
          onPress={() => navigateToScreen('ReportIncident')}
        >
          Report Incident
        </Button>
        
        <Button 
          mode="contained" 
          style={styles.actionButton}
          icon="package"
          onPress={() => navigateToScreen('ResourceTracking')}
        >
          Track Resources
        </Button>
        
        <Button 
          mode="contained" 
          style={styles.actionButton}
          icon="bell"
          onPress={() => navigateToScreen('Alerts')}
        >
          View Alerts
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Recent Alerts" />
        <Card.Content>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <Title style={styles.alertTitle}>{alert.type}</Title>
              <Paragraph>{alert.message}</Paragraph>
              <Paragraph style={styles.timestamp}>
                {new Date(alert.timestamp).toLocaleString()}
              </Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCard: {
    margin: 16,
    elevation: 4,
  },
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  actionButton: {
    marginVertical: 8,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  alertItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
});

export default DashboardScreen;