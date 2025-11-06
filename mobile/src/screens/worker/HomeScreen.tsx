import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text,
  Chip,
  Button,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { JobPosting } from '../../types/profile';
import { JobPostingService } from '../../services/jobPostingService';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState(50); // km

  // Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  // Load jobs
  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await JobPostingService.getActiveJobs();

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      if (data) {
        setJobs(data);
        applyFilters(data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Apply filters
  const applyFilters = (jobList: JobPosting[]) => {
    let filtered = jobList;

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filtering (geofencing)
    if (location) {
      filtered = filtered.filter((job) => {
        // If job has no location, include it
        if (!job.job_location) return true;

        // Note: In production, this would parse the PostGIS POINT
        // For now, we'll include all jobs
        // TODO: Parse PostGIS location and calculate distance
        return true;
      });
    }

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilters(jobs);
  }, [searchQuery, location, jobs]);

  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const renderJob = ({ item }: { item: JobPosting }) => {
    // Calculate distance if location is available
    // Note: Would need to parse job_location PostGIS format in production
    const distance = null; // Placeholder

    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('JobDetail' as never, { jobId: item.id } as never)}
      >
        <Card.Content>
          <Text variant="titleMedium">{item.title}</Text>
          <Text variant="bodySmall" style={styles.employer}>
            Employer ID: {item.employer_id.substring(0, 8)}...
          </Text>

          <View style={styles.chips}>
            {item.pay_rate_min && item.pay_rate_max && (
              <Chip icon="cash" compact>
                ${item.pay_rate_min}-${item.pay_rate_max}/hr
              </Chip>
            )}
            <Chip icon="briefcase" compact>
              {item.job_type === 'day_labor' ? 'Day Labor' : 'Standard'}
            </Chip>
            {item.workers_needed && (
              <Chip icon="account-multiple" compact>
                {item.workers_needed} positions
              </Chip>
            )}
          </View>

          {item.description && (
            <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
              {item.description}
            </Text>
          )}

          {item.location_address && (
            <Text variant="bodySmall" style={styles.location}>
              📍 {item.location_address}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search jobs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id!}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadJobs} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="titleMedium">No jobs found</Text>
            <Text variant="bodySmall" style={styles.emptyHint}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
        contentContainerStyle={jobs.length === 0 ? styles.emptyContainer : undefined}
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
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  card: {
    margin: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  employer: {
    color: '#666',
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  description: {
    marginTop: 8,
    color: '#444',
  },
  location: {
    marginTop: 8,
    color: '#666',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 32,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyHint: {
    marginTop: 8,
    color: '#999',
  },
});
