// screens/ResourcesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const ResourcesScreen = ({ navigation }) => {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [requestDetails, setRequestDetails] = useState('');

  // Mock data - replace with API calls in real app
  useEffect(() => {
    const mockResources = [
      {
        id: '1',
        type: 'shelter',
        name: 'Main Street Community Shelter',
        description: 'Emergency shelter with capacity for 200 people. Food and basic medical care available.',
        location: { latitude: 37.78825, longitude: -122.4324 },
        distance: '1.2 km',
        capacity: '200/250',
        contact: '555-123-4567'
      },
      {
        id: '2',
        type: 'medical',
        name: 'Disaster Medical Camp',
        description: 'Mobile medical unit providing emergency care. Doctors and nurses on site.',
        location: { latitude: 37.7749, longitude: -122.4194 },
        distance: '3.5 km',
        capacity: 'Open',
        contact: '555-987-6543'
      },
      {
        id: '3',
        type: 'food',
        name: 'Central Food Distribution',
        description: 'Daily meal distribution. Breakfast 7-9am, Lunch 12-2pm, Dinner 6-8pm.',
        location: { latitude: 37.781, longitude: -122.411 },
        distance: '2.1 km',
        capacity: 'Enough for 300 meals today',
        contact: '555-456-7890'
      },
      {
        id: '4',
        type: 'shelter',
        name: 'Northside High School Shelter',
        description: 'Temporary shelter in school gymnasium. Bring your own bedding if possible.',
        location: { latitude: 37.795, longitude: -122.405 },
        distance: '4.8 km',
        capacity: '150/200',
        contact: '555-321-6547'
      },
    ];
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    // Filter by type
    if (filter !== 'all' && resource.type !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !resource.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const handleRequestAid = (resourceType) => {
    setRequestType(resourceType);
    setShowRequestModal(true);
  };

  const submitRequest = () => {
    // In a real app, this would send a request to your backend
    Alert.alert('Request Submitted', 'Your request for aid has been submitted. A responder will contact you soon.');
    setShowRequestModal(false);
    setRequestDetails('');
  };

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resourceCard}
      onPress={() => setSelectedResource(item)}
    >
      <View style={styles.resourceHeader}>
        <View style={[
          styles.resourceIcon,
          item.type === 'shelter' && { backgroundColor: '#0A84FF' },
          item.type === 'medical' && { backgroundColor: '#FF3B30' },
          item.type === 'food' && { backgroundColor: '#34C759' },
        ]}>
          {item.type === 'shelter' && <MaterialIcons name="house" size={24} color="#fff" />}
          {item.type === 'medical' && <FontAwesome name="medkit" size={24} color="#fff" />}
          {item.type === 'food' && <MaterialIcons name="fastfood" size={24} color="#fff" />}
        </View>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceName}>{item.name}</Text>
          <Text style={styles.resourceDistance}>{item.distance}</Text>
        </View>
      </View>
      <Text style={styles.resourceDescription}>{item.description}</Text>
      <Text style={styles.resourceCapacity}>Capacity: {item.capacity}</Text>
      
      <View style={styles.resourceActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Map', { location: item.location })}
        >
          <Text style={styles.actionText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRequestAid(item.type)}
        >
          <Text style={styles.actionText}>Request Aid</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for shelters, food, medical..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'shelter' && styles.activeFilter]}
          onPress={() => setFilter('shelter')}
        >
          <Text style={styles.filterText}>Shelters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'food' && styles.activeFilter]}
          onPress={() => setFilter('food')}
        >
          <Text style={styles.filterText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'medical' && styles.activeFilter]}
          onPress={() => setFilter('medical')}
        >
          <Text style={styles.filterText}>Medical</Text>
        </TouchableOpacity>
      </View>

      {selectedResource ? (
        <View style={styles.resourceDetail}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedResource(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.detailHeader}>
            <View style={[
              styles.detailIcon,
              selectedResource.type === 'shelter' && { backgroundColor: '#0A84FF' },
              selectedResource.type === 'medical' && { backgroundColor: '#FF3B30' },
              selectedResource.type === 'food' && { backgroundColor: '#34C759' },
            ]}>
              {selectedResource.type === 'shelter' && <MaterialIcons name="house" size={32} color="#fff" />}
              {selectedResource.type === 'medical' && <FontAwesome name="medkit" size={32} color="#fff" />}
              {selectedResource.type === 'food' && <MaterialIcons name="fastfood" size={32} color="#fff" />}
            </View>
            <Text style={styles.detailName}>{selectedResource.name}</Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionContent}>{selectedResource.description}</Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Current Status</Text>
            <Text style={styles.sectionContent}>Capacity: {selectedResource.capacity}</Text>
            <Text style={styles.sectionContent}>Distance: {selectedResource.distance}</Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.sectionContent}>{selectedResource.contact}</Text>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: selectedResource.location.latitude,
                longitude: selectedResource.location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={selectedResource.location}
                title={selectedResource.name}
              />
            </MapView>
          </View>
          
          <TouchableOpacity 
            style={styles.requestButton}
            onPress={() => handleRequestAid(selectedResource.type)}
          >
            <Text style={styles.requestButtonText}>Request {selectedResource.type} Aid</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredResources}
          renderItem={renderResourceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No resources found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
            </View>
          }
        />
      )}

      {/* Request Aid Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request {requestType} Aid</Text>
            
            <Text style={styles.modalLabel}>Details (optional)</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Provide any additional details about your request..."
              value={requestDetails}
              onChangeText={setRequestDetails}
            />
            
            <Text style={styles.modalNote}>
              Your approximate location will be shared with responders.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitRequest}
              >
                <Text style={styles.modalButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: '#0A84FF',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContent: {
    padding: 10,
  },
  resourceCard: {
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
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resourceDistance: {
    fontSize: 14,
    color: '#888',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  resourceCapacity: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '600',
    marginBottom: 10,
  },
  resourceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0A84FF',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  resourceDetail: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  requestButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalNote: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#0A84FF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResourcesScreen;