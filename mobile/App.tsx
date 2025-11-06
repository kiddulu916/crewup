import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { store } from './src/store';
import { RootNavigator } from './src/navigation';
import { AuthService } from './src/services/authService';
import { setUser, setSession, setLoading } from './src/store/slices/authSlice';

function AppContent() {
  useEffect(() => {
    // Check for existing session on app load
    checkSession();

    // Listen for auth state changes
    const { data } = AuthService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { user } = await AuthService.getCurrentUser();
        if (user) {
          store.dispatch(setSession(session));
          store.dispatch(setUser(user));
        }
      } else if (event === 'SIGNED_OUT') {
        store.dispatch(setUser(null));
        store.dispatch(setSession(null));
      }
    });

    // Cleanup subscription
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    store.dispatch(setLoading(true));

    const { data: session } = await AuthService.getSession();

    if (session) {
      const { user } = await AuthService.getCurrentUser();
      if (user) {
        store.dispatch(setSession(session));
        store.dispatch(setUser(user));
      }
    }

    store.dispatch(setLoading(false));
  };

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
