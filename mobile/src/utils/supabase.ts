import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Temporarily disabled to allow app to load without Supabase setup
// TODO: Re-enable this check once you have real Supabase credentials
// if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
//   throw new Error(
//     'Missing Supabase environment variables. Please create a .env.local file based on .env.example'
//   );
// }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});
