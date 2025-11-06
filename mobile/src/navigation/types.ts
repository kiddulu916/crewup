import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Auth Stack Parameter List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelection: { email: string; password: string };
  WorkerProfileForm: { selectedLocation?: { latitude: number; longitude: number } } | undefined;
  EmployerProfileForm: { selectedLocation?: { latitude: number; longitude: number } } | undefined;
  JobPostingForm: { employerId: string; selectedLocation?: { latitude: number; longitude: number } } | undefined;
  JobManagement: { employerId: string };
  Applicants: { jobId: string };
  LocationPicker: { initialLocation?: { latitude: number; longitude: number } } | undefined;
  WorkHistoryForm: { workerId: string };
  CertificationForm: { workerId: string };
};

// Main App Stack Parameter List
export type MainStackParamList = {
  MainTabs: undefined;
  JobDetail: { jobId: string };
  Applicants: { jobId: string };
  // Other screens will be added in later phases
};

// Bottom Tabs Parameter List
export type MainTabsParamList = {
  Home: undefined;
  Applications: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Navigation prop types
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type MainTabsNavigationProp = BottomTabNavigationProp<MainTabsParamList>;
