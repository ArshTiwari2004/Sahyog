import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Platform 
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Chip 
} from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const IncidentReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [location, setLocation] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Location and Permission Setup
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
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

  // Media Capture Handler
  const handleMediaCapture = async (type) => {
    let result;
    if (type === 'photo') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
    } else if (type === 'video') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.7,
      });
    }

    if (!result.canceled) {
      setMediaFiles(prev => [...prev, {
        uri: result.assets[0].uri,
        type: result.assets[0].type
      }]);
    }
  };

  // Submit Incident Report
  const handleSubmit = async () => {
    if (!title || !description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Simulated submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form or navigate
      navigation.navigate('Dashboard');
    } catch (error) {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  // Remove Media File
  const removeMediaFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <View style={styles.headerContainer}>
          <Ionicons 
            name="warning-outline" 
            size={24} 
            color="#0A84FF" 
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Report Incident</Text>
        </View>

        {/* Incident Title Input */}
        <TextInput
          label="Incident Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          theme={{ 
            colors: { 
              primary: '#0A84FF',
              background: 'white' 
            } 
          }}
        />

        {/* Description Input */}
        <TextInput
          label="Describe the Incident"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          theme={{ 
            colors: { 
              primary: '#0A84FF',
              background: 'white' 
            } 
          }}
        />

        {/* Severity Selection */}
        <View style={styles.severityContainer}>
          <Text style={styles.sectionTitle}>Severity Level</Text>
          <View style={styles.chipContainer}>
            {['Low', 'Medium', 'High'].map((level) => (
              <Chip
                key={level}
                selected={severity === level}
                onPress={() => setSeverity(level)}
                style={[
                  styles.severityChip,
                  severity === level && styles[`${level.toLowerCase()}Severity`]
                ]}
                textStyle={styles.chipText}
              >
                {level}
              </Chip>
            ))}
          </View>
        </View>

        {/* Media Capture */}
        <View style={styles.mediaCaptureContainer}>
          <Text style={styles.sectionTitle}>Add Media</Text>
          <View style={styles.mediaButtonContainer}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => handleMediaCapture('photo')}
            >
              <Ionicons name="camera" size={24} color="#0A84FF" />
              <Text style={styles.mediaButtonText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => handleMediaCapture('video')}
            >
              <Ionicons name="videocam" size={24} color="#0A84FF" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </TouchableOpacity>
          </View>

          {/* Media Preview */}
          <ScrollView 
            horizontal 
            style={styles.mediaPreviewContainer}
            showsHorizontalScrollIndicator={false}
          >
            {mediaFiles.map((media, index) => (
              <View key={index} style={styles.mediaPreviewItem}>
                <Image 
                  source={{ uri: media.uri }} 
                  style={styles.mediaPreview}
                />
                <TouchableOpacity 
                  style={styles.removeMediaButton}
                  onPress={() => removeMediaFile(index)}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Location */}
        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapView
              style={styles.map}
              region={location}
            >
              <Marker 
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude
                }} 
              />
            </MapView>
            <Text style={styles.locationText}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={loading}
        >
          Submit Incident Report
        </Button>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A84FF',
  },
  input: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  severityContainer: {
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityChip: {
    flex: 1,
    marginHorizontal: 5,
  },
  chipText: {
    fontWeight: '600',
  },
  lowSeverity: {
    backgroundColor: '#E6F3E6',
  },
  mediumSeverity: {
    backgroundColor: '#FFF3E0',
  },
  highSeverity: {
    backgroundColor: '#FFEBEE',
  },
  mediaCaptureContainer: {
    marginBottom: 20,
  },
  mediaButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '48%',
  },
  mediaButtonText: {
    marginLeft: 10,
    color: '#0A84FF',
    fontWeight: '600',
  },
  mediaPreviewContainer: {
    marginTop: 10,
  },
  mediaPreviewItem: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 2,
  },
  locationContainer: {
    marginBottom: 20,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  locationText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#0A84FF',
  },
});

export default IncidentReportScreen;