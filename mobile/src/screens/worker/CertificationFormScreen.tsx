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
import { Button, Input, Card } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { WorkerProfileService } from '../../services/workerProfileService';

type Props = NativeStackScreenProps<AuthStackParamList, 'CertificationForm'>;

export const CertificationFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { workerId } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    certification_name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    certification_number: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.certification_name.trim()) {
      newErrors.certification_name = 'Certification name is required';
    }

    if (formData.issue_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.issue_date)) {
        newErrors.issue_date = 'Invalid date format. Use YYYY-MM-DD';
      }
    }

    if (formData.expiry_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.expiry_date)) {
        newErrors.expiry_date = 'Invalid date format. Use YYYY-MM-DD';
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
      const certification = {
        certification_name: formData.certification_name,
        issuing_organization: formData.issuing_organization || undefined,
        issue_date: formData.issue_date ? new Date(formData.issue_date) : undefined,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date) : undefined,
        certification_number: formData.certification_number || undefined,
        verified: false,
      };

      const { error } = await WorkerProfileService.addCertification(workerId, certification);

      if (error) {
        throw new Error(error);
      }

      Alert.alert('Success', 'Certification added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add certification');
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
          <Text style={styles.title}>Add Certification</Text>
          <Text style={styles.subtitle}>
            Add your professional certifications and licenses
          </Text>

          <Input
            label="Certification Name"
            value={formData.certification_name}
            onChangeText={text => updateFormData('certification_name', text)}
            placeholder="OSHA 30-Hour Construction"
            error={errors.certification_name}
          />

          <Input
            label="Issuing Organization (Optional)"
            value={formData.issuing_organization}
            onChangeText={text => updateFormData('issuing_organization', text)}
            placeholder="OSHA"
          />

          <Input
            label="Issue Date (Optional)"
            value={formData.issue_date}
            onChangeText={text => updateFormData('issue_date', text)}
            placeholder="2022-05-15"
            error={errors.issue_date}
          />

          <Input
            label="Expiry Date (Optional)"
            value={formData.expiry_date}
            onChangeText={text => updateFormData('expiry_date', text)}
            placeholder="2025-05-15"
            error={errors.expiry_date}
          />

          <Input
            label="Certification Number (Optional)"
            value={formData.certification_number}
            onChangeText={text => updateFormData('certification_number', text)}
            placeholder="CERT-123456"
          />

          <Text style={styles.helperText}>
            All dates should be in YYYY-MM-DD format (e.g., 2023-12-31)
          </Text>

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Add Certification"
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
  helperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
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
