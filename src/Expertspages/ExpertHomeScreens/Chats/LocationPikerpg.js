import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

// Custom Map Style
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  // ... (rest of mapStyle remains the same)
];

const LocationPiker = ({ route, navigation }) => {
  const [initialLongitude, setInitialLongitude] = useState(null);
  const [initialLatitude, setInitialLatitude] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Getting Location...');
  const [isLocating, setIsLocating] = useState(true);

  const mapRef = useRef(null);

  const getOneTimeLocation = async () => {
    setIsLocating(true);
    setLocationStatus('Getting current location...');

    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationStatus('Location Found');
          setInitialLongitude(longitude);
          setInitialLatitude(latitude);
          setSelectedLocation({ latitude, longitude });
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation Error:', error);
          setLocationStatus(`Location failed: ${error.code} - ${error.message}`);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.error('Location initiation error:', error);
      setLocationStatus('Could not start location service.');
      setIsLocating(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message:
              'To share your location, we need access to your precise location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied. Please enable in Settings.');
          setIsLocating(false);
        }
      } catch (err) {
        console.warn('Android Permission Error:', err);
        setIsLocating(false);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleMapRegionChangeComplete = (region) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const handleSendLocation = () => {
    const onPick = route?.params?.onPick;
    if (selectedLocation && typeof onPick === 'function') {
      onPick(selectedLocation);
    }
    navigation?.goBack?.();
  };

  const MapOverlayButtons = () => (
    <View style={styles.mapOverlay}>
      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapBtn}
        onPress={() => {
          getOneTimeLocation();
          if (mapRef.current && initialLatitude) {
            mapRef.current.animateToRegion({
              latitude: initialLatitude,
              longitude: initialLongitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}>
        {isLocating ? (
          <ActivityIndicator size="small" color="#075E54" />
        ) : (
          <Icon name="locate" size={24} color="#000" />
        )}
      </TouchableOpacity>
    </View>
  );

  const latText = selectedLocation ? selectedLocation.latitude.toFixed(4) : '...';
  const lonText = selectedLocation ? selectedLocation.longitude.toFixed(4) : '...';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {initialLatitude && initialLongitude ? (
          <MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={{
              latitude: initialLatitude,
              longitude: initialLongitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            onRegionChangeComplete={handleMapRegionChangeComplete}
          />
        ) : (
          <View style={styles.loadingView}>
            {isLocating ? (
              <ActivityIndicator size="large" color="#075E54" />
            ) : (
              <>
                <Text style={styles.boldText}>{locationStatus}</Text>
                <TouchableOpacity
                  onPress={() => getOneTimeLocation()}
                  style={styles.retryBtn}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    Try Again
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Platform.OS === 'android'
                      ? Linking.openSettings()
                      : Linking.openURL('App-Prefs:root=Privacy&path=LOCATION')
                  }
                  style={[styles.retryBtn, { backgroundColor: '#999', marginTop: 8 }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    Open Settings
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {initialLatitude && initialLongitude && (
          <View style={styles.centerPin}>
            <Icon
              name="pin"
              size={48}
              color="red"
              style={{ transform: [{ translateY: -24 }] }}
            />
          </View>
        )}

        <MapOverlayButtons />
      </View>

      <View style={styles.actionList}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSendLocation}
          disabled={!selectedLocation || isLocating}>
          <View
            style={[styles.actionIconCircle, { backgroundColor: '#075E54' }]}>
            <Icon name="send" size={28} color="#fff" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Send Pinned Location</Text>
            <Text style={styles.actionSubtitle}>
              {selectedLocation
                ? `Lat: ${latText}, Lon: ${lonText}`
                : 'Move map to select location'}
            </Text>
          </View>

          {selectedLocation && (
            <Icon
              name="chevron-forward-circle"
              size={32}
              color="#075E54"
              style={styles.sendIcon}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  mapContainer: { flex: 1.5 },
  map: { flex: 1 },
  centerPin: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  boldText: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    margin: 20,
  },
  mapOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 40,
    right: 10,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  mapBtn: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  sendIcon: {
    alignSelf: 'center',
  },
  retryBtn: {
    alignSelf: 'center',
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export default LocationPiker;
