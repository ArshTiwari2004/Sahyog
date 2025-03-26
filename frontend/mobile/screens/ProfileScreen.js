// screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Nibedan pati',
    email: 'nibedanpati@gmail.com',
    phone: '+91 8851558047',
    role: 'Citizen',
    emergencyContact: 'Family - +91 2225938938',
    locationSharing: true,
    profileImage: null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, profileImage: result.assets[0].uri });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Log Out', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <FontAwesome name="user" size={50} color="#fff" />
            </View>
          )}
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="#0A84FF" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { field: 'email' })}>
            <MaterialIcons name="edit" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="phone" size={24} color="#0A84FF" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { field: 'phone' })}>
            <MaterialIcons name="edit" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Settings</Text>
        
        <View style={styles.infoItem}>
          <FontAwesome name="user-circle" size={24} color="#FF3B30" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Emergency Contact</Text>
            <Text style={styles.infoValue}>{user.emergencyContact}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { field: 'emergencyContact' })}>
            <MaterialIcons name="edit" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="location-on" size={24} color="#FF3B30" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Location Sharing</Text>
            <Text style={styles.infoValue}>{user.locationSharing ? 'Enabled' : 'Disabled'}</Text>
          </View>
          <TouchableOpacity onPress={() => setUser({...user, locationSharing: !user.locationSharing})}>
            <MaterialIcons 
              name={user.locationSharing ? "toggle-on" : "toggle-off"} 
              size={30} 
              color={user.locationSharing ? "#34C759" : "#888"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.actionButtonText}>Change Password</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PrivacySettings')}>
          <Text style={styles.actionButtonText}>Privacy Settings</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Contact Support', 'Email us at support@disasterapp.org')}>
          <Text style={styles.actionButtonText}>Contact Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A84FF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoText: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;