// screens/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EditProfileScreen = ({ route, navigation }) => {
  const { field } = route.params;
  const [value, setValue] = useState('');

  const handleSave = () => {
    if (!value.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }
    // In a real app, you would save this to your backend
    Alert.alert('Success', 'Profile updated successfully');
    navigation.goBack();
  };

  const getFieldConfig = () => {
    switch (field) {
      case 'email':
        return {
          label: 'Email Address',
          placeholder: 'Enter your email',
          keyboardType: 'email-address',
        };
      case 'phone':
        return {
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          keyboardType: 'phone-pad',
        };
      case 'emergencyContact':
        return {
          label: 'Emergency Contact',
          placeholder: 'Name and phone number',
          keyboardType: 'default',
        };
      default:
        return {
          label: field,
          placeholder: `Enter your ${field}`,
          keyboardType: 'default',
        };
    }
  };

  const config = getFieldConfig();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#0A84FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit {config.label}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{config.label}</Text>
        <TextInput
          style={styles.input}
          placeholder={config.placeholder}
          value={value}
          onChangeText={setValue}
          keyboardType={config.keyboardType}
          autoFocus
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default EditProfileScreen;