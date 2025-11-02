import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Auth Stack Parameter List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelection: undefined;
  WorkerProfileForm: { selectedLocation?: { latitude: number; longitude: number } } | undefined;
  EmployerProfileForm: { selectedLocation?: { latitude: number; longitude: number } } | undefined;
  LocationPicker: { initialLocation?: { latitude: number; longitude: number } } | undefined;
  WorkHistoryForm: { workerId: string };
  CertificationForm: { workerId: string };
};

// Main App Stack Parameter List
export type MainStackParamList = {
  MainTabs: undefined;
  // Other screens will be added in later phases
};

// Bottom Tabs Parameter List
export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Navigation prop types
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type MainTabsNavigationProp = BottomTabNavigationProp<MainTabsParamList>;
