// screens/AlertScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-web-maps';

const AlertScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('critical');
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock data - replace with API calls in real app
  useEffect(() => {
    const mockAlerts = [
      {
        id: '1',
        type: 'flood',
        priority: 'critical',
        title: 'Flash Flood Warning',
        message: 'Severe flooding expected in your area within the next hour. Evacuate immediately to higher ground.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        location: { latitude: 37.78825, longitude: -122.4324 },
        distance: '1.2 km from you'
      },
      {
        id: '2',
        type: 'fire',
        priority: 'critical',
        title: 'Wildfire Alert',
        message: 'Wildfire approaching from the west. Evacuation order in effect.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        location: { latitude: 37.7749, longitude: -122.4194 },
        distance: '5.7 km from you'
      },
      {
        id: '3',
        type: 'medical',
        priority: 'update',
        title: 'Your Report #1234',
        message: 'Medical team has been dispatched to your location. ETA 15 minutes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        location: null,
        distance: null
      },
      {
        id: '4',
        type: 'shelter',
        priority: 'info',
        title: 'Shelter Opened',
        message: 'New shelter opened at Main Street Community Center with capacity for 200 people.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        location: { latitude: 37.781, longitude: -122.411 },
        distance: '3.1 km from you'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => alert.priority === activeTab);

  const handleShareAlert = async (alert) => {
    try {
      await Share.share({
        message: `Disaster Alert: ${alert.title}\n\n${alert.message}\n\nSent via Disaster Response App`,
      });
    } catch (error) {
      Alert.alert('Error sharing alert', error.message);
    }
  };

  const handleMarkSafe = (alertId) => {
    // In a real app, this would send a request to your backend
    Alert.alert('Safety Status', 'Your safety status has been reported to responders.');
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.alertCard,
        item.priority === 'critical' && styles.criticalCard,
        item.priority === 'update' && styles.updateCard,
        item.priority === 'info' && styles.infoCard
      ]}
      onPress={() => setSelectedAlert(item)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertIcon}>
          {item.type === 'flood' && <MaterialIcons name="water" size={24} color="#fff" />}
          {item.type === 'fire' && <MaterialIcons name="local-fire-department" size={24} color="#fff" />}
          {item.type === 'medical' && <FontAwesome name="medkit" size={24} color="#fff" />}
          {item.type === 'shelter' && <MaterialIcons name="house" size={24} color="#fff" />}
        </View>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertTime}>{formatTimeAgo(item.timestamp)}</Text>
      </View>
      <Text style={styles.alertMessage}>{item.message}</Text>
      {item.distance && <Text style={styles.alertDistance}>{item.distance}</Text>}
      
      <View style={styles.alertActions}>
        {item.priority === 'critical' && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleMarkSafe(item.id)}
          >
            <Text style={styles.actionText}>Mark Safe</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleShareAlert(item)}
        >
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        {item.location && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Map', { location: item.location })}
          >
            <Text style={styles.actionText}>View Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'critical' && styles.activeTab]}
          onPress={() => setActiveTab('critical')}
        >
          <Text style={styles.tabText}>Critical</Text>
          {activeTab === 'critical' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'update' && styles.activeTab]}
          onPress={() => setActiveTab('update')}
        >
          <Text style={styles.tabText}>Updates</Text>
          {activeTab === 'update' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={styles.tabText}>Info</Text>
          {activeTab === 'info' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {selectedAlert ? (
        <View style={styles.alertDetail}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedAlert(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedAlert.title}</Text>
          <Text style={styles.detailTime}>{formatTimeAgo(selectedAlert.timestamp)}</Text>
          <Text style={styles.detailMessage}>{selectedAlert.message}</Text>
          
          {selectedAlert.location && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedAlert.location.latitude,
                  longitude: selectedAlert.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={selectedAlert.location}
                  title={selectedAlert.title}
                />
              </MapView>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeTab} alerts</Text>
            </View>
          }
        />
      )}

      {/* Emergency SOS Button */}
      <TouchableOpacity 
        style={styles.sosButton}
        onPress={() => navigation.navigate('Report', { emergency: true })}
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  return 'Just now';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF3B30',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: '#FF3B30',
  },
  listContent: {
    padding: 10,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  criticalCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF3B30',
  },
  updateCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FFCC00',
  },
  infoCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#34C759',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
  },
  alertMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  alertDistance: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0A84FF',
    borderRadius: 15,
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  alertDetail: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  detailMessage: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  sosButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sosText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertScreen;