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
import { Button, Input, Card, Picker } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { JobPostingService } from '../../services/jobPostingService';
import { JobPostingFormData, Location } from '../../types/profile';
import {
  JOB_TYPES,
  PAY_TYPES,
  JOB_DURATION_OPTIONS,
  WORKERS_NEEDED_OPTIONS
} from '../../utils/employerConstants';
import { TRADE_OPTIONS, EXPERIENCE_LEVELS } from '../../utils/skills';

type Props = NativeStackScreenProps<AuthStackParamList, 'JobPostingForm'>;

export const JobPostingFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { employerId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  const [formData, setFormData] = useState<JobPostingFormData>({
    job_type: 'standard',
    title: '',
    description: '',
    required_trade: '',
    required_skills: [],
    pay_type: 'hourly',
    pay_rate_min: '',
    pay_rate_max: '',
    pay_amount: '',
    location_address: '',
    start_date: '',
    duration_weeks: '',
    required_certifications: [],
    experience_required: undefined,
    workers_needed: '1',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JobPostingFormData, string>>>({});

  // Handle location selection from LocationPicker screen
  useEffect(() => {
    if (route.params?.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
  }, [route.params?.selectedLocation]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobPostingFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.required_trade) {
      newErrors.required_trade = 'Please select required trade';
    }

    // Validate pay based on pay type
    if (formData.pay_type === 'hourly') {
      if (!formData.pay_rate_min) {
        newErrors.pay_rate_min = 'Minimum hourly rate is required';
      } else if (parseFloat(formData.pay_rate_min) < 0) {
        newErrors.pay_rate_min = 'Rate must be positive';
      }

      if (formData.pay_rate_max) {
        const min = parseFloat(formData.pay_rate_min || '0');
        const max = parseFloat(formData.pay_rate_max);
        if (max < min) {
          newErrors.pay_rate_max = 'Max rate must be greater than min';
        }
      }
    } else if (formData.pay_type === 'per_project') {
      if (!formData.pay_amount) {
        newErrors.pay_amount = 'Project amount is required';
      } else if (parseFloat(formData.pay_amount) < 0) {
        newErrors.pay_amount = 'Amount must be positive';
      }
    } else if (formData.pay_type === 'salary') {
      if (!formData.pay_amount) {
        newErrors.pay_amount = 'Annual salary is required';
      } else if (parseFloat(formData.pay_amount) < 0) {
        newErrors.pay_amount = 'Salary must be positive';
      }
    }

    if (formData.start_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.start_date)) {
        newErrors.start_date = 'Invalid date format. Use YYYY-MM-DD';
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

    setIsLoading(true);

    try {
      // Create job posting
      const { data, error } = await JobPostingService.createJob(employerId, formData);

      if (error) {
        throw new Error(error);
      }

      // Update location if selected
      if (selectedLocation && data?.id) {
        const { error: locationError } = await JobPostingService.updateJobLocation(
          data.id,
          selectedLocation
        );
        if (locationError) {
          console.warn('Failed to update location:', locationError);
        }
      }

      Alert.alert(
        'Success',
        'Job posting created as draft. You can publish it from the job management dashboard.',
        [
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setFormData({
                job_type: 'standard',
                title: '',
                description: '',
                required_trade: '',
                required_skills: [],
                pay_type: 'hourly',
                pay_rate_min: '',
                pay_rate_max: '',
                pay_amount: '',
                location_address: '',
                start_date: '',
                duration_weeks: '',
                required_certifications: [],
                experience_required: undefined,
                workers_needed: '1',
              });
              setSelectedLocation(undefined);
            },
          },
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create job posting');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof JobPostingFormData, value: any) => {
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
          <Text style={styles.title}>Post a New Job</Text>
          <Text style={styles.subtitle}>
            Find the right workers for your project
          </Text>

          <Picker
            label="Job Type"
            value={formData.job_type}
            options={JOB_TYPES}
            onValueChange={value => updateFormData('job_type', value as any)}
          />

          <Input
            label="Job Title"
            value={formData.title}
            onChangeText={text => updateFormData('title', text)}
            placeholder="e.g., Experienced Carpenter Needed for Residential Project"
            error={errors.title}
          />

          <Input
            label="Job Description"
            value={formData.description}
            onChangeText={text => updateFormData('description', text)}
            placeholder="Describe the job requirements, responsibilities, and project details..."
            multiline={true}
            numberOfLines={6}
            style={styles.descriptionInput}
            error={errors.description}
          />

          <Picker
            label="Required Trade"
            placeholder="Select primary trade"
            value={formData.required_trade}
            options={TRADE_OPTIONS.map(trade => ({ label: trade, value: trade }))}
            onValueChange={value => updateFormData('required_trade', value)}
            error={errors.required_trade}
          />

          <Picker
            label="Experience Level Required (Optional)"
            placeholder="Select minimum experience"
            value={formData.experience_required}
            options={EXPERIENCE_LEVELS}
            onValueChange={value => updateFormData('experience_required', value)}
          />

          <Text style={styles.sectionTitle}>Compensation</Text>

          <Picker
            label="Pay Type"
            value={formData.pay_type}
            options={PAY_TYPES}
            onValueChange={value => updateFormData('pay_type', value as any)}
          />

          {formData.pay_type === 'hourly' && (
            <View style={styles.rateRow}>
              <Input
                label="Min Hourly Rate ($)"
                value={formData.pay_rate_min}
                onChangeText={text => updateFormData('pay_rate_min', text)}
                placeholder="25"
                keyboardType="decimal-pad"
                error={errors.pay_rate_min}
                style={styles.rateInput}
              />

              <Input
                label="Max Hourly Rate ($)"
                value={formData.pay_rate_max}
                onChangeText={text => updateFormData('pay_rate_max', text)}
                placeholder="45"
                keyboardType="decimal-pad"
                error={errors.pay_rate_max}
                style={styles.rateInput}
              />
            </View>
          )}

          {(formData.pay_type === 'salary' || formData.pay_type === 'per_project') && (
            <Input
              label={formData.pay_type === 'salary' ? 'Annual Salary ($)' : 'Project Amount ($)'}
              value={formData.pay_amount}
              onChangeText={text => updateFormData('pay_amount', text)}
              placeholder={formData.pay_type === 'salary' ? '75000' : '5000'}
              keyboardType="decimal-pad"
              error={errors.pay_amount}
            />
          )}

          <Text style={styles.sectionTitle}>Job Details</Text>

          <Input
            label="Job Location Address (Optional)"
            value={formData.location_address}
            onChangeText={text => updateFormData('location_address', text)}
            placeholder="123 Main St, City, State ZIP"
          />

          <View style={styles.locationSection}>
            <Button
              title={selectedLocation ? 'Change Map Location' : 'Set Map Location (Optional)'}
              onPress={() => navigation.navigate('LocationPicker', { initialLocation: selectedLocation })}
              variant="outline"
              fullWidth={true}
            />
            {selectedLocation && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationInfoText}>
                  📍 Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          <Input
            label="Start Date (Optional)"
            value={formData.start_date}
            onChangeText={text => updateFormData('start_date', text)}
            placeholder="2024-01-15"
            error={errors.start_date}
          />

          <Picker
            label="Estimated Duration (Optional)"
            placeholder="Select duration"
            value={formData.duration_weeks}
            options={JOB_DURATION_OPTIONS}
            onValueChange={value => updateFormData('duration_weeks', value)}
          />

          <Picker
            label="Workers Needed"
            value={formData.workers_needed}
            options={WORKERS_NEEDED_OPTIONS}
            onValueChange={value => updateFormData('workers_needed', value)}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Create Job"
              onPress={handleSubmit}
              loading={isLoading}
              variant="primary"
              style={styles.button}
            />
          </View>
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
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  descriptionInput: {
    height: 120,
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
  locationSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
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
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
  },
});
