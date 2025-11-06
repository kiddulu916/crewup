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
  Chip,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Application } from '../../types/profile';
import { ApplicationService } from '../../services/applicationService';

export default function ApplicationsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await ApplicationService.getMyApplications();

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
    let unsubscribe: (() => void) | undefined;
    ApplicationService.subscribeToMyApplications(() => {
      loadApplications();
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return theme.colors.primaryContainer;
      case 'rejected':
      case 'withdrawn':
        return theme.colors.errorContainer;
      case 'reviewed':
        return theme.colors.tertiaryContainer;
      default:
        return theme.colors.secondaryContainer;
    }
  };

  const renderApplication = ({ item }: { item: Application }) => (
    <Card
      style={styles.card}
      onPress={() => {
        if (item.job_id) {
          navigation.navigate('JobDetail' as never, { jobId: item.job_id } as never);
        }
      }}
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>
            {item.job?.title || 'Job'}
          </Text>
          <Chip
            mode="flat"
            compact
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        {item.job?.employer_id && (
          <Text variant="bodySmall" style={styles.employer}>
            Employer ID: {item.job.employer_id.substring(0, 8)}...
          </Text>
        )}

        <View style={styles.details}>
          {item.job && item.job.pay_rate_min && item.job.pay_rate_max && (
            <Chip icon="cash" compact>
              ${item.job.pay_rate_min}-${item.job.pay_rate_max}/hr
            </Chip>
          )}
          <Text variant="bodySmall" style={styles.date}>
            Applied {new Date(item.applied_at).toLocaleDateString()}
          </Text>
        </View>

        {item.cover_letter && (
          <Text variant="bodySmall" style={styles.message} numberOfLines={2}>
            "{item.cover_letter}"
          </Text>
        )}
      </Card.Content>
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
        renderItem={renderApplication}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadApplications} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="titleMedium">No applications yet</Text>
            <Text variant="bodySmall" style={styles.emptyHint}>
              Browse jobs and apply to get started
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
  title: {
    flex: 1,
    marginRight: 8,
  },
  employer: {
    color: '#666',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  date: {
    color: '#999',
  },
  message: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
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
