import { supabase } from '../lib/supabase';
import { User } from '../store/slices/authSlice';

interface SignUpParams {
  email: string;
  password: string;
  userType: 'worker' | 'employer';
}

interface SignInParams {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp({ email, password, userType }: SignUpParams) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile entry
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          user_type: userType,
          is_premium: false,
        });

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn({ email, password }: SignInParams) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Get the current session
   */
  static async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data: data.session, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get the current user with profile data
   */
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user) return { user: null, error: null };

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, is_premium')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const userData: User = {
        id: user.id,
        email: user.email!,
        userType: profile.user_type,
        isPremium: profile.is_premium,
      };

      return { user: userData, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'crewup://reset-password',
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Listen for auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
