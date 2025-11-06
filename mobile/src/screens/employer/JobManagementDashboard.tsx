import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, JobCard } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { JobPostingService } from '../../services/jobPostingService';
import { JobPosting } from '../../types/profile';

type Props = NativeStackScreenProps<AuthStackParamList, 'JobManagement'>;

type TabType = 'all' | 'active' | 'draft' | 'filled' | 'closed';

export const JobManagementDashboard: React.FC<Props> = ({ navigation, route }) => {
  const { employerId } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJobs = useCallback(async (status?: string) => {
    try {
      const { data, error } = await JobPostingService.getJobsByEmployer(
        employerId,
        status === 'all' ? undefined : status
      );

      if (error) {
        throw new Error(error);
      }

      setJobs(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [employerId]);

  useEffect(() => {
    loadJobs(activeTab);
  }, [activeTab, loadJobs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadJobs(activeTab);
  };

  const handlePublish = async (jobId: string) => {
    Alert.alert(
      'Publish Job',
      'Are you sure you want to publish this job? It will be visible to all workers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            try {
              const { error } = await JobPostingService.publishJob(jobId);
              if (error) throw new Error(error);

              Alert.alert('Success', 'Job published successfully');
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to publish job');
            }
          },
        },
      ]
    );
  };

  const handleClose = async (jobId: string) => {
    Alert.alert(
      'Close Job',
      'Are you sure you want to close this job? It will no longer accept applications.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await JobPostingService.closeJob(jobId);
              if (error) throw new Error(error);

              Alert.alert('Success', 'Job closed successfully');
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to close job');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (jobId: string) => {
    Alert.alert('Edit Job', 'Job editing will be available in a future update.');
    // TODO: Navigate to edit screen
    // navigation.navigate('JobEditForm', { jobId });
  };

  const handleDelete = async (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await JobPostingService.deleteJob(jobId);
              if (error) throw new Error(error);

              Alert.alert('Success', 'Job deleted successfully');
              handleRefresh();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const handleJobPress = (job: JobPosting) => {
    Alert.alert(
      job.title,
      job.description,
      [
        { text: 'Close' },
        {
          text: 'View Applicants',
          onPress: () => {
            // Navigate to applicants screen
            navigation.navigate('Applicants' as any, { jobId: job.id });
          },
        },
      ]
    );
  };

  const renderTab = (tab: TabType, label: string) => {
    const isActive = activeTab === tab;
    const count = tab === 'all'
      ? jobs.length
      : jobs.filter(j => j.status === tab).length;

    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {label}
        </Text>
        {count > 0 && (
          <View style={[styles.badge, isActive && styles.activeBadge]}>
            <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Jobs Found</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'draft'
          ? 'You have no draft jobs. Create one to get started!'
          : activeTab === 'active'
          ? 'You have no active jobs. Publish a draft or create a new job.'
          : 'No jobs match this filter.'}
      </Text>
      {(activeTab === 'draft' || activeTab === 'all') && (
        <Button
          title="Post a New Job"
          onPress={() => navigation.navigate('JobPostingForm', { employerId })}
          variant="primary"
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <Button
          title="+ New Job"
          onPress={() => navigation.navigate('JobPostingForm', { employerId })}
          variant="primary"
          size="small"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab('all', 'All')}
        {renderTab('active', 'Active')}
        {renderTab('draft', 'Drafts')}
        {renderTab('filled', 'Filled')}
        {renderTab('closed', 'Closed')}
      </View>

      {/* Job List */}
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleJobPress(item)}
            showActions={true}
            onPublish={item.status === 'draft' ? () => handlePublish(item.id!) : undefined}
            onClose={item.status === 'active' ? () => handleClose(item.id!) : undefined}
            onEdit={() => handleEdit(item.id!)}
            onDelete={() => handleDelete(item.id!)}
          />
        )}
        keyExtractor={item => item.id!}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  activeTabText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.text,
    fontSize: 11,
  },
  activeBadgeText: {
    color: Colors.textInverse,
  },
  listContent: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
});
