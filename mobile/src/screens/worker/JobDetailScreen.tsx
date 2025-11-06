import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  useTheme,
  ActivityIndicator,
  TextInput,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { JobPosting, Application } from '../../types/profile';
import { JobPostingService } from '../../services/jobPostingService';
import { ApplicationService } from '../../services/applicationService';

export default function JobDetailScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params as { jobId: string };

  const [job, setJob] = useState<JobPosting | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverMessage, setCoverMessage] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const [jobResult, appResult] = await Promise.all([
        JobPostingService.getJobById(jobId),
        ApplicationService.checkExistingApplication(jobId),
      ]);

      if (jobResult.error) {
        Alert.alert('Error', jobResult.error);
        navigation.goBack();
        return;
      }

      if (jobResult.data) {
        setJob(jobResult.data);
      }

      if (appResult.data) {
        setApplication(appResult.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    try {
      const { data, error } = await ApplicationService.applyToJob(jobId, coverMessage);

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      Alert.alert('Success', 'Your application has been submitted!');
      setShowApplyDialog(false);
      setCoverMessage('');
      await loadJobDetails(); // Reload to show updated application status
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!application) return;

    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw your application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            setApplying(true);
            try {
              const { error } = await ApplicationService.withdrawApplication(application.id);

              if (error) {
                Alert.alert('Error', error);
                return;
              }

              Alert.alert('Success', 'Application withdrawn');
              await loadJobDetails();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setApplying(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.loading}>
        <Text>Job not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const canApply = !application || application.status === 'withdrawn';
  const canWithdraw = application && ['pending', 'reviewed'].includes(application.status);

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">{job.title}</Text>
            <Text variant="bodyMedium" style={styles.employer}>
              Employer ID: {job.employer_id.substring(0, 8)}...
            </Text>

            <View style={styles.chips}>
              {job.pay_rate_min && job.pay_rate_max && (
                <Chip icon="cash">${job.pay_rate_min}-${job.pay_rate_max}/hr</Chip>
              )}
              <Chip icon="briefcase">
                {job.job_type === 'day_labor' ? 'Day Labor' : 'Standard'}
              </Chip>
              {job.workers_needed && (
                <Chip icon="account-multiple">{job.workers_needed} positions</Chip>
              )}
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium">Description</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {job.description || 'No description provided.'}
            </Text>

            {job.required_skills && job.required_skills.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text variant="titleMedium">Required Skills</Text>
                <View style={styles.skills}>
                  {job.required_skills.map((skill, index) => (
                    <Chip key={index} mode="outlined">
                      {skill}
                    </Chip>
                  ))}
                </View>
              </>
            )}

            <Divider style={styles.divider} />

            <Text variant="titleMedium">Details</Text>
            <View style={styles.details}>
              {job.location_address && <Text>📍 {job.location_address}</Text>}
              {job.start_date && (
                <Text>📅 Starts: {new Date(job.start_date).toLocaleDateString()}</Text>
              )}
              {job.duration_weeks && <Text>⏱️ Duration: {job.duration_weeks} weeks</Text>}
              {job.required_trade && <Text>🔧 Trade: {job.required_trade}</Text>}
            </View>

            {application && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.applicationStatus}>
                  <Text variant="titleMedium">Your Application</Text>
                  <Chip
                    mode="flat"
                    style={{
                      backgroundColor:
                        application.status === 'accepted'
                          ? theme.colors.primaryContainer
                          : application.status === 'rejected'
                          ? theme.colors.errorContainer
                          : theme.colors.secondaryContainer,
                    }}
                  >
                    {application.status.toUpperCase()}
                  </Chip>
                </View>
                {application.cover_letter && (
                  <Text variant="bodySmall" style={styles.coverMessage}>
                    Your message: "{application.cover_letter}"
                  </Text>
                )}
              </>
            )}
          </Card.Content>

          <Card.Actions>
            {canApply && (
              <Button
                mode="contained"
                onPress={() => setShowApplyDialog(true)}
                disabled={applying}
              >
                Apply Now
              </Button>
            )}
            {canWithdraw && (
              <Button
                mode="outlined"
                onPress={handleWithdraw}
                loading={applying}
                disabled={applying}
              >
                Withdraw Application
              </Button>
            )}
          </Card.Actions>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={showApplyDialog} onDismiss={() => setShowApplyDialog(false)}>
          <Dialog.Title>Apply to {job.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              Add an optional cover message to stand out:
            </Text>
            <TextInput
              label="Cover Message (Optional)"
              value={coverMessage}
              onChangeText={setCoverMessage}
              multiline
              numberOfLines={4}
              mode="outlined"
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowApplyDialog(false)}>Cancel</Button>
            <Button onPress={handleApply} loading={applying} disabled={applying}>
              Submit Application
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    margin: 16,
  },
  employer: {
    color: '#666',
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  divider: {
    marginVertical: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  details: {
    marginTop: 8,
    gap: 8,
  },
  applicationStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverMessage: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  dialogText: {
    marginBottom: 16,
  },
  textInput: {
    marginTop: 8,
  },
});
