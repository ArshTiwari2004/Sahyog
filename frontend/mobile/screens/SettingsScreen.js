// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    vibration: true,
    soundAlerts: true,
    highContrast: false,
    language: 'English',
  });

  const toggleSetting = (setting) => {
    setSettings({...settings, [setting]: !settings[setting]});
  };

  return (
    <ScrollView style={styles.container}>
      {/* New Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="person" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Profile</Text>
            <Text style={styles.settingDescription}>View and edit your profile information</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => toggleSetting('notifications')}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="notifications" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>Enable or disable app notifications</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.notifications ? "#0A84FF" : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => toggleSetting('darkMode')}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="dark-mode" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Switch between light and dark theme</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.darkMode ? "#0A84FF" : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => toggleSetting('vibration')}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="vibration" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Text style={styles.settingDescription}>Haptic feedback for alerts</Text>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={() => toggleSetting('vibration')}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.vibration ? "#0A84FF" : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => toggleSetting('soundAlerts')}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="volume-up" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Sound Alerts</Text>
            <Text style={styles.settingDescription}>Audible alerts for emergencies</Text>
          </View>
          <Switch
            value={settings.soundAlerts}
            onValueChange={() => toggleSetting('soundAlerts')}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.soundAlerts ? "#0A84FF" : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => toggleSetting('highContrast')}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="contrast" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>High Contrast</Text>
            <Text style={styles.settingDescription}>Improved visibility in low-light</Text>
          </View>
          <Switch
            value={settings.highContrast}
            onValueChange={() => toggleSetting('highContrast')}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={settings.highContrast ? "#0A84FF" : "#f4f3f4"}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('LanguageSettings')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="language" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Language</Text>
            <Text style={styles.settingDescription}>{settings.language}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('Tutorial')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="help-outline" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>App Tutorial</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('FAQ')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="question-answer" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>FAQs</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => Alert.alert('Contact Support', 'Email us at support@disasterapp.org')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="contact-support" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Contact Support</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('AboutApp')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="info-outline" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>About Disaster Response</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="description" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={styles.settingIcon}>
            <MaterialIcons name="privacy-tip" size={24} color="#0A84FF" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 Disaster Response App</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default SettingsScreen;