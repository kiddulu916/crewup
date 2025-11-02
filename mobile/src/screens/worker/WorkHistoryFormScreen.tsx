import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input, Card } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { WorkerProfileService } from '../../services/workerProfileService';

type Props = NativeStackScreenProps<AuthStackParamList, 'WorkHistoryForm'>;

export const WorkHistoryFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { workerId } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.position_title.trim()) {
      newErrors.position_title = 'Position title is required';
    }

    if (!formData.start_date.trim()) {
      newErrors.start_date = 'Start date is required (format: YYYY-MM-DD)';
    } else {
      // Basic date format validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.start_date)) {
        newErrors.start_date = 'Invalid date format. Use YYYY-MM-DD';
      }
    }

    if (!formData.is_current && !formData.end_date.trim()) {
      newErrors.end_date = 'End date is required for past positions';
    } else if (formData.end_date.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.end_date)) {
        newErrors.end_date = 'Invalid date format. Use YYYY-MM-DD';
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
      const workHistory = {
        company_name: formData.company_name,
        position_title: formData.position_title,
        start_date: new Date(formData.start_date),
        end_date: formData.is_current ? undefined : new Date(formData.end_date),
        is_current: formData.is_current,
        description: formData.description || undefined,
      };

      const { error } = await WorkerProfileService.addWorkHistory(workerId, workHistory);

      if (error) {
        throw new Error(error);
      }

      Alert.alert('Success', 'Work history added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add work history');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Text style={styles.title}>Add Work History</Text>
          <Text style={styles.subtitle}>
            Tell employers about your past work experience
          </Text>

          <Input
            label="Company Name"
            value={formData.company_name}
            onChangeText={text => updateFormData('company_name', text)}
            placeholder="ABC Construction"
            error={errors.company_name}
          />

          <Input
            label="Position Title"
            value={formData.position_title}
            onChangeText={text => updateFormData('position_title', text)}
            placeholder="Senior Carpenter"
            error={errors.position_title}
          />

          <Input
            label="Start Date"
            value={formData.start_date}
            onChangeText={text => updateFormData('start_date', text)}
            placeholder="2020-01-15"
            error={errors.start_date}
          />

          <View style={styles.currentJobRow}>
            <Text style={styles.currentJobLabel}>Currently working here</Text>
            <Switch
              value={formData.is_current}
              onValueChange={value => updateFormData('is_current', value)}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={formData.is_current ? Colors.primary : Colors.textLight}
            />
          </View>

          {!formData.is_current && (
            <Input
              label="End Date"
              value={formData.end_date}
              onChangeText={text => updateFormData('end_date', text)}
              placeholder="2023-06-30"
              error={errors.end_date}
            />
          )}

          <Input
            label="Description (Optional)"
            value={formData.description}
            onChangeText={text => updateFormData('description', text)}
            placeholder="Describe your responsibilities and achievements..."
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Add Work History"
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
  currentJobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  currentJobLabel: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
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
