import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input, Card, ProfilePhotoUpload, Picker } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { EmployerProfileService } from '../../services/employerProfileService';
import { EmployerProfileFormData, Location } from '../../types/profile';
import { COMPANY_SIZES, BUSINESS_TYPES } from '../../utils/employerConstants';
import { useAppSelector } from '../../store/hooks';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmployerProfileForm'>;

export const EmployerProfileFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const user = useAppSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUri, setLogoUri] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  const [formData, setFormData] = useState<EmployerProfileFormData>({
    company_name: '',
    company_logo_url: '',
    business_type: '',
    company_size: '',
    description: '',
    website: '',
    service_radius_miles: '50',
    license_number: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployerProfileFormData, string>>>({});

  // Handle location selection from LocationPicker screen
  useEffect(() => {
    if (route.params?.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployerProfileFormData, string>> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.business_type) {
      newErrors.business_type = 'Please select your business type';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      // Upload logo if selected
      let logoUrl = formData.company_logo_url;
      if (logoUri) {
        const { data, error } = await EmployerProfileService.uploadCompanyLogo(user.id, logoUri);
        if (error) {
          throw new Error(`Logo upload failed: ${error}`);
        }
        logoUrl = data || '';
      }

      // Create profile
      const profileData: EmployerProfileFormData = {
        ...formData,
        company_logo_url: logoUrl,
      };

      const { data, error } = await EmployerProfileService.createProfile(user.id, profileData);

      if (error) {
        throw new Error(error);
      }

      // Update location if selected
      if (selectedLocation && data?.id) {
        const { error: locationError } = await EmployerProfileService.updateLocation(
          data.id,
          selectedLocation
        );
        if (locationError) {
          console.warn('Failed to update location:', locationError);
        }
      }

      Alert.alert('Success', 'Your company profile has been created!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to main app
            navigation.navigate('RoleSelection');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof EmployerProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Text style={styles.title}>Create Your Company Profile</Text>
          <Text style={styles.subtitle}>
            Tell workers about your company
          </Text>

          <ProfilePhotoUpload
            photoUrl={logoUri}
            onPhotoSelected={setLogoUri}
            size={120}
          />

          <Input
            label="Company Name"
            value={formData.company_name}
            onChangeText={text => updateFormData('company_name', text)}
            placeholder="ABC Construction Inc."
            error={errors.company_name}
            autoCapitalize="words"
          />

          <Picker
            label="Business Type"
            placeholder="Select business type"
            value={formData.business_type}
            options={BUSINESS_TYPES}
            onValueChange={value => updateFormData('business_type', value)}
            error={errors.business_type}
          />

          <Picker
            label="Company Size (Optional)"
            placeholder="Select company size"
            value={formData.company_size}
            options={COMPANY_SIZES}
            onValueChange={value => updateFormData('company_size', value)}
          />

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChangeText={text => updateFormData('description', text)}
            placeholder="Describe your company and the services you provide..."
            multiline={true}
            numberOfLines={4}
            style={styles.descriptionInput}
          />

          <Input
            label="Website (Optional)"
            value={formData.website}
            onChangeText={text => updateFormData('website', text)}
            placeholder="https://www.yourcompany.com"
            autoCapitalize="none"
            keyboardType="url"
            error={errors.website}
          />

          <Input
            label="License Number (Optional)"
            value={formData.license_number}
            onChangeText={text => updateFormData('license_number', text)}
            placeholder="State contractor license number"
          />

          <Input
            label="Contact Email (Optional)"
            value={formData.email}
            onChangeText={text => updateFormData('email', text)}
            placeholder="contact@yourcompany.com"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Phone Number (Optional)"
            value={formData.phone}
            onChangeText={text => updateFormData('phone', text)}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
          />

          <Picker
            label="Service Radius"
            value={formData.service_radius_miles}
            options={[
              { label: '10 miles', value: '10' },
              { label: '25 miles', value: '25' },
              { label: '50 miles', value: '50' },
              { label: '100 miles', value: '100' },
              { label: 'Statewide', value: '500' },
            ]}
            onValueChange={value => updateFormData('service_radius_miles', value)}
          />

          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Primary Location (Optional)</Text>
            <Button
              title={selectedLocation ? 'Change Location' : 'Set Primary Location'}
              onPress={() => navigation.navigate('LocationPicker', { initialLocation: selectedLocation })}
              variant="outline"
              fullWidth={true}
            />
            {selectedLocation && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationInfoText}>
                  📍 Location: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          <Button
            title="Create Profile"
            onPress={handleSubmit}
            loading={isLoading}
            variant="primary"
            size="large"
            fullWidth={true}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationSection: {
    marginTop: Spacing.md,
  },
  locationInfo: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.sm,
  },
  locationInfoText: {
    ...Typography.body,
    color: Colors.text,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});
