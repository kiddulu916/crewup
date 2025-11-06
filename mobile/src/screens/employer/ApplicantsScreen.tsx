import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { ApplicationWithDetails } from '../../types/profile';
import { ApplicationService } from '../../services/applicationService';

export default function ApplicantsScreen() {
  const theme = useTheme();
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };

  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await ApplicationService.getJobApplications(jobId);

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      if (data) {
        setApplications(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();

    // Subscribe to real-time updates
    const unsubscribe = ApplicationService.subscribeToJobApplications(
      jobId,
      () => {
        loadApplications();
      }
    );

    return () => {
      unsubscribe();
    };
  }, [jobId]);

  const handleUpdateStatus = async (
    applicationId: string,
    status: 'reviewed' | 'accepted' | 'rejected'
  ) => {
    setUpdating(applicationId);
    try {
      const { error } = await ApplicationService.updateApplicationStatus(applicationId, status);

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      Alert.alert('Success', `Application ${status}`);
      await loadApplications(); // Reload to show updated status
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return theme.colors.primaryContainer;
      case 'rejected':
        return theme.colors.errorContainer;
      case 'reviewed':
        return theme.colors.tertiaryContainer;
      default:
        return theme.colors.secondaryContainer;
    }
  };

  const renderApplicant = ({ item }: { item: ApplicationWithDetails }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">
            Worker ID: {item.worker_id?.substring(0, 8)}...
          </Text>
          <Chip mode="flat" compact style={{ backgroundColor: getStatusColor(item.status) }}>
            {item.status.toUpperCase()}
          </Chip>
        </View>

        {item.worker && (
          <>
            {item.worker.email && (
              <Text variant="bodySmall" style={styles.email}>
                ✉️ {item.worker.email}
              </Text>
            )}
            {item.worker.phone && (
              <Text variant="bodySmall" style={styles.phone}>
                📱 {item.worker.phone}
              </Text>
            )}
          </>
        )}

        {item.cover_letter && (
          <>
            <Divider style={styles.divider} />
            <Text variant="labelMedium">Cover Message:</Text>
            <Text variant="bodySmall" style={styles.coverMessage}>
              "{item.cover_letter}"
            </Text>
          </>
        )}

        <Text variant="bodySmall" style={styles.date}>
          Applied {new Date(item.applied_at).toLocaleDateString()}
        </Text>
      </Card.Content>

      {item.status === 'pending' && (
        <Card.Actions>
          <Button
            mode="outlined"
            onPress={() => handleUpdateStatus(item.id, 'reviewed')}
            disabled={updating === item.id}
            loading={updating === item.id}
            compact
          >
            Reviewed
          </Button>
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus(item.id, 'accepted')}
            disabled={updating === item.id}
            loading={updating === item.id}
            compact
          >
            Accept
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={() => handleUpdateStatus(item.id, 'rejected')}
            disabled={updating === item.id}
            loading={updating === item.id}
            compact
          >
            Reject
          </Button>
        </Card.Actions>
      )}

      {item.status === 'reviewed' && (
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => handleUpdateStatus(item.id, 'accepted')}
            disabled={updating === item.id}
            loading={updating === item.id}
          >
            Accept
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleUpdateStatus(item.id, 'rejected')}
            disabled={updating === item.id}
            loading={updating === item.id}
          >
            Reject
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  if (loading && applications.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        renderItem={renderApplicant}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadApplications} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="titleMedium">No applicants yet</Text>
            <Text variant="bodySmall" style={styles.emptyHint}>
              Applications will appear here once workers apply
            </Text>
          </View>
        }
        contentContainerStyle={applications.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  email: {
    marginTop: 4,
  },
  phone: {
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  coverMessage: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#666',
  },
  date: {
    marginTop: 8,
    color: '#999',
    fontSize: 12,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyHint: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
});
