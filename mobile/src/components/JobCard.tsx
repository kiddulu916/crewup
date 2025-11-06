import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { JobPosting } from '../types/profile';

interface JobCardProps {
  job: JobPosting;
  onPress?: () => void;
  showActions?: boolean;
  onPublish?: () => void;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  showActions = false,
  onPublish,
  onClose,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = () => {
    switch (job.status) {
      case 'active':
        return Colors.success;
      case 'filled':
        return Colors.primary;
      case 'closed':
        return Colors.textSecondary;
      case 'expired':
        return Colors.error;
      case 'draft':
      default:
        return Colors.textLight;
    }
  };

  const getStatusLabel = () => {
    switch (job.status) {
      case 'active':
        return 'Active';
      case 'filled':
        return 'Filled';
      case 'closed':
        return 'Closed';
      case 'expired':
        return 'Expired';
      case 'draft':
      default:
        return 'Draft';
    }
  };

  const getPayDisplay = () => {
    if (job.pay_type === 'hourly') {
      if (job.pay_rate_max) {
        return `$${job.pay_rate_min}-${job.pay_rate_max}/hr`;
      }
      return `$${job.pay_rate_min}/hr`;
    } else if (job.pay_type === 'salary') {
      return `$${job.pay_amount?.toLocaleString()}/year`;
    } else {
      return `$${job.pay_amount?.toLocaleString()} project`;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={2}>
            {job.title}
          </Text>
          <View style={styles.typeRow}>
            <View style={[styles.typeBadge, job.job_type === 'day_labor' && styles.dayLaborBadge]}>
              <Text style={styles.typeText}>
                {job.job_type === 'day_labor' ? 'Day Labor' : 'Standard'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusLabel()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        {job.required_trade && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🔧</Text>
            <Text style={styles.detailText}>{job.required_trade}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>{getPayDisplay()}</Text>
        </View>

        {job.workers_needed > 1 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailText}>{job.workers_needed} workers needed</Text>
          </View>
        )}

        {job.location_address && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {job.location_address}
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{job.applications_count || 0}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{job.views_count || 0}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        {job.created_at && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {new Date(job.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.statLabel}>Posted</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          {job.status === 'draft' && onPublish && (
            <TouchableOpacity style={[styles.actionButton, styles.publishButton]} onPress={onPublish}>
              <Text style={styles.actionButtonText}>Publish</Text>
            </TouchableOpacity>
          )}

          {job.status === 'active' && onClose && (
            <TouchableOpacity style={[styles.actionButton, styles.closeButton]} onPress={onClose}>
              <Text style={styles.actionButtonText}>Close</Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.sm,
  },
  dayLaborBadge: {
    backgroundColor: Colors.accent + '30',
  },
  typeText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  details: {
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  detailText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: Colors.success,
  },
  closeButton: {
    backgroundColor: Colors.textSecondary,
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    ...Typography.bodyBold,
    color: Colors.textInverse,
  },
});
