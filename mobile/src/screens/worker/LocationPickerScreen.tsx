import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { LocationPicker } from '../../components';
import { Colors } from '../../theme/colors';
import { Location } from '../../types/profile';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPicker'>;

export const LocationPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { initialLocation } = route.params || {};

  const handleLocationSelected = (location: Location) => {
    // Navigate back and pass the selected location
    navigation.navigate('WorkerProfileForm', { selectedLocation: location });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LocationPicker
          initialLocation={initialLocation}
          onLocationSelected={handleLocationSelected}
          label="Select Your Preferred Work Location"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
