import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card } from '../../components';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Layout, BorderRadius } from '../../theme/spacing';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setSession, setLoading } from '../../store/slices/authSlice';
import { AuthService } from '../../services/authService';

type RoleSelectionNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'RoleSelection'
>;

const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<RoleSelectionNavigationProp>();
  const dispatch = useAppDispatch();

  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(null);
  const [loading, setLoadingState] = useState(false);

  // In a real app, email and password would be passed from RegisterScreen
  // For now, we'll need to modify the navigation to pass these params
  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Select a Role', 'Please choose whether you are a Worker or Employer');
      return;
    }

    if (selectedRole === 'worker') {
      // Navigate to worker profile form
      navigation.navigate('WorkerProfileForm');
    } else {
      // Employer profile form not yet implemented
      Alert.alert(
        'Coming Soon',
        'Employer profile setup will be available in Phase 4.\n\nFor now, please go back to login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }

    // Future implementation with Supabase registration:
    // setLoadingState(true);
    // dispatch(setLoading(true));
    //
    // const { data, error } = await AuthService.signUp({
    //   email: route.params.email,
    //   password: route.params.password,
    //   userType: selectedRole,
    // });
    //
    // if (error) {
    //   Alert.alert('Registration Failed', error);
    //   setLoadingState(false);
    //   dispatch(setLoading(false));
    //   return;
    // }
    //
    // if (data?.session) {
    //   const { user, error: userError } = await AuthService.getCurrentUser();
    //   if (user) {
    //     dispatch(setSession(data.session));
    //     dispatch(setUser(user));
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you plan to use CrewUp. You can change this later.
          </Text>
        </View>

        {/* Role Options */}
        <View style={styles.roleContainer}>
          {/* Worker Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('worker')}
            activeOpacity={0.7}
            style={styles.roleCardWrapper}
          >
            <Card
              variant={selectedRole === 'worker' ? 'elevated' : 'flat'}
              padding="lg"
              style={[
                styles.roleCard,
                selectedRole === 'worker' && styles.roleCardSelected,
              ]}
            >
              <View style={styles.roleIcon}>
                <Text style={styles.roleIconText}>👷</Text>
              </View>
              <Text style={styles.roleTitle}>Worker</Text>
              <Text style={styles.roleDescription}>
                I'm looking for construction jobs and want to connect with employers
              </Text>
              {selectedRole === 'worker' && <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>}
            </Card>
          </TouchableOpacity>

          {/* Employer Option */}
          <TouchableOpacity
            onPress={() => setSelectedRole('employer')}
            activeOpacity={0.7}
            style={styles.roleCardWrapper}
          >
            <Card
              variant={selectedRole === 'employer' ? 'elevated' : 'flat'}
              padding="lg"
              style={[
                styles.roleCard,
                selectedRole === 'employer' && styles.roleCardSelected,
              ]}
            >
              <View style={styles.roleIcon}>
                <Text style={styles.roleIconText}>🏗️</Text>
              </View>
              <Text style={styles.roleTitle}>Employer</Text>
              <Text style={styles.roleDescription}>
                I'm hiring workers for construction projects and need to post jobs
              </Text>
              {selectedRole === 'employer' && <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>}
            </Card>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          fullWidth
          variant="primary"
          disabled={!selectedRole}
        />

        {/* Back Link */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  roleContainer: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  roleCardWrapper: {
    marginBottom: Spacing.md,
  },
  roleCard: {
    borderWidth: 2,
    borderColor: Colors.transparent,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: Colors.primary,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roleIconText: {
    fontSize: 32,
  },
  roleTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
  backButtonText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
});

export default RoleSelectionScreen;
