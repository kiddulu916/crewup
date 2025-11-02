import React, { useState } from 'react';
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
import { Spacing } from '../../theme/spacing';
import { WorkerProfileService } from '../../services/workerProfileService';
import { WorkerProfileFormData } from '../../types/profile';
import { TRADE_OPTIONS, EXPERIENCE_LEVELS } from '../../utils/skills';
import { useAppSelector } from '../../store/hooks';

type Props = NativeStackScreenProps<AuthStackParamList, 'WorkerProfileForm'>;

export const WorkerProfileFormScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAppSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  const [formData, setFormData] = useState<WorkerProfileFormData>({
    first_name: '',
    last_name: '',
    profile_photo_url: '',
    primary_trade: '',
    experience_level: 'entry',
    years_experience: '',
    bio: '',
    hourly_rate_min: '',
    hourly_rate_max: '',
    willing_to_travel: true,
    has_own_tools: false,
    has_transportation: false,
    work_radius_miles: '50',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WorkerProfileFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WorkerProfileFormData, string>> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.primary_trade) {
      newErrors.primary_trade = 'Please select your primary trade';
    }

    if (formData.years_experience) {
      const years = parseInt(formData.years_experience);
      if (isNaN(years) || years < 0 || years > 60) {
        newErrors.years_experience = 'Please enter valid years of experience (0-60)';
      }
    }

    if (formData.hourly_rate_min) {
      const rate = parseFloat(formData.hourly_rate_min);
      if (isNaN(rate) || rate < 0) {
        newErrors.hourly_rate_min = 'Please enter a valid rate';
      }
    }

    if (formData.hourly_rate_max) {
      const rate = parseFloat(formData.hourly_rate_max);
      if (isNaN(rate) || rate < 0) {
        newErrors.hourly_rate_max = 'Please enter a valid rate';
      }

      if (formData.hourly_rate_min) {
        const minRate = parseFloat(formData.hourly_rate_min);
        const maxRate = parseFloat(formData.hourly_rate_max);
        if (!isNaN(minRate) && !isNaN(maxRate) && maxRate < minRate) {
          newErrors.hourly_rate_max = 'Max rate must be greater than min rate';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      // Upload photo if selected
      let photoUrl = formData.profile_photo_url;
      if (photoUri) {
        const { data, error } = await WorkerProfileService.uploadProfilePhoto(user.id, photoUri);
        if (error) {
          throw new Error(`Photo upload failed: ${error}`);
        }
        photoUrl = data || '';
      }

      // Create profile
      const profileData: WorkerProfileFormData = {
        ...formData,
        profile_photo_url: photoUrl,
      };

      const { data, error } = await WorkerProfileService.createProfile(user.id, profileData);

      if (error) {
        throw new Error(error);
      }

      Alert.alert('Success', 'Your profile has been created!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to main app - this will be handled by RootNavigator
            // when we implement profile completion checking
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

  const updateFormData = (field: keyof WorkerProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
          <Text style={styles.title}>Create Your Worker Profile</Text>
          <Text style={styles.subtitle}>
            Tell us about yourself and your skills
          </Text>

          <ProfilePhotoUpload
            photoUrl={photoUri}
            onPhotoSelected={setPhotoUri}
            size={120}
          />

          <Input
            label="First Name"
            value={formData.first_name}
            onChangeText={text => updateFormData('first_name', text)}
            placeholder="John"
            error={errors.first_name}
            autoCapitalize="words"
          />

          <Input
            label="Last Name"
            value={formData.last_name}
            onChangeText={text => updateFormData('last_name', text)}
            placeholder="Doe"
            error={errors.last_name}
            autoCapitalize="words"
          />

          <Picker
            label="Primary Trade"
            placeholder="Select your primary trade"
            value={formData.primary_trade}
            options={TRADE_OPTIONS.map(trade => ({ label: trade, value: trade }))}
            onValueChange={value => updateFormData('primary_trade', value)}
            error={errors.primary_trade}
          />

          <Picker
            label="Experience Level"
            value={formData.experience_level}
            options={EXPERIENCE_LEVELS}
            onValueChange={value => updateFormData('experience_level', value)}
          />

          <Input
            label="Years of Experience (Optional)"
            value={formData.years_experience}
            onChangeText={text => updateFormData('years_experience', text)}
            placeholder="5"
            keyboardType="numeric"
            error={errors.years_experience}
          />

          <Input
            label="Bio (Optional)"
            value={formData.bio}
            onChangeText={text => updateFormData('bio', text)}
            placeholder="Tell employers about your experience and skills..."
            multiline
            numberOfLines={4}
            style={styles.bioInput}
          />

          <Text style={styles.sectionTitle}>Hourly Rate Range (Optional)</Text>
          <View style={styles.rateRow}>
            <Input
              label="Min Rate ($)"
              value={formData.hourly_rate_min}
              onChangeText={text => updateFormData('hourly_rate_min', text)}
              placeholder="25"
              keyboardType="decimal-pad"
              error={errors.hourly_rate_min}
              style={styles.rateInput}
            />

            <Input
              label="Max Rate ($)"
              value={formData.hourly_rate_max}
              onChangeText={text => updateFormData('hourly_rate_max', text)}
              placeholder="45"
              keyboardType="decimal-pad"
              error={errors.hourly_rate_max}
              style={styles.rateInput}
            />
          </View>

          <Picker
            label="Work Radius"
            value={formData.work_radius_miles}
            options={[
              { label: '10 miles', value: '10' },
              { label: '25 miles', value: '25' },
              { label: '50 miles', value: '50' },
              { label: '100 miles', value: '100' },
              { label: 'No limit', value: '999' },
            ]}
            onValueChange={value => updateFormData('work_radius_miles', value)}
          />

          <Button
            title="Create Profile"
            onPress={handleSubmit}
            loading={isLoading}
            variant="primary"
            size="large"
            fullWidth
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
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  rateInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});
