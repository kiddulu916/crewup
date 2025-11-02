import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ExpoLocation from 'expo-location';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Location } from '../types/profile';
import { Button } from './Button';

interface LocationPickerProps {
  initialLocation?: Location;
  onLocationSelected: (location: Location) => void;
  label?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onLocationSelected,
  label = 'Preferred Work Location',
}) => {
  const [location, setLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 37.78825,
    longitude: initialLocation?.longitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestLocationPermission = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is needed to use this feature. Please enable it in your device settings.'
      );
      return false;
    }
    setHasPermission(true);
    return true;
  };

  const getCurrentLocation = async () => {
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    setIsLoadingLocation(true);
    try {
      const locationResult = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });

      const newLocation: Location = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
      };

      setLocation(newLocation);
      setRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newLocation: Location = { latitude, longitude };
    setLocation(newLocation);
  };

  const handleConfirmLocation = () => {
    if (!location) {
      Alert.alert('No Location Selected', 'Please select a location on the map');
      return;
    }
    onLocationSelected(location);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation={hasPermission}
          showsMyLocationButton={false}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Selected Location"
              description="Your preferred work location"
              pinColor={Colors.primary}
            />
          )}
        </MapView>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.currentLocationIcon}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationInfoLabel}>Selected Location:</Text>
          <Text style={styles.locationInfoText}>
            Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {/* Helper Text */}
      <Text style={styles.helperText}>
        Tap on the map to select your preferred work location, or use your current location
      </Text>

      {/* Confirm Button */}
      <Button
        title="Confirm Location"
        onPress={handleConfirmLocation}
        variant="primary"
        fullWidth
        disabled={!location}
        style={styles.confirmButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  mapContainer: {
    height: 300,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundDark,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  currentLocationIcon: {
    fontSize: 24,
  },
  locationInfo: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.sm,
  },
  locationInfoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  locationInfoText: {
    ...Typography.bodyBold,
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  helperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  confirmButton: {
    marginTop: Spacing.md,
  },
});
