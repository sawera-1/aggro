import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';

const LocationPiker= () => {
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
            subscribeLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location...');
    Geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('You are Here');
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 },
    );
  };

  const subscribeLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        setLocationStatus('You are Here');
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: true, distanceFilter: 10 },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {currentLatitude && currentLongitude ? (
          <MapView
            style={styles.map}
            region={{
              latitude: currentLatitude,
              longitude: currentLongitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: currentLatitude,
                longitude: currentLongitude,
              }}
              title={'You are here'}
              description={`Lat: ${currentLatitude}, Lon: ${currentLongitude}`}
            />
          </MapView>
        ) : (
          <Text style={styles.boldText}>{locationStatus}</Text>
        )}

        <Text style={styles.coordinates}>
          Longitude: {currentLongitude ? currentLongitude.toFixed(6) : '...'}
        </Text>
        <Text style={styles.coordinates}>
          Latitude: {currentLatitude ? currentLatitude.toFixed(6) : '...'}
        </Text>

        <Button title="Refresh" onPress={getOneTimeLocation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { flex: 1 },
  boldText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  coordinates: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default LocationPiker;