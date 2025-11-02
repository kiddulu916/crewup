import { supabase } from '../lib/supabase';
import { EmployerProfile, EmployerProfileFormData, Location } from '../types/profile';
import * as FileSystem from 'expo-file-system';

export class EmployerProfileService {
  /**
   * Create a new employer profile
   */
  static async createProfile(userId: string, profileData: EmployerProfileFormData) {
    try {
      const profile: Partial<EmployerProfile> = {
        user_id: userId,
        company_name: profileData.company_name,
        company_logo_url: profileData.company_logo_url,
        business_type: profileData.business_type,
        company_size: profileData.company_size as any,
        description: profileData.description,
        website: profileData.website,
        service_radius_miles: parseInt(profileData.service_radius_miles) || 50,
        license_number: profileData.license_number,
        insurance_verified: false,
        average_rating: 0,
        total_reviews: 0,
        total_jobs_posted: 0,
      };

      const { data, error } = await supabase
        .from('employer_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get employer profile by user ID
   */
  static async getProfileByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { data: data as EmployerProfile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update employer profile
   */
  static async updateProfile(profileId: string, updates: Partial<EmployerProfile>) {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Upload company logo
   */
  static async uploadCompanyLogo(userId: string, logoUri: string) {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(logoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file extension
      const ext = logoUri.split('.').pop() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${ext}`;

      // Convert base64 to blob
      const blob = base64ToBlob(base64, `image/${ext}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, blob, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update primary location
   */
  static async updateLocation(profileId: string, location: Location) {
    try {
      // Convert location to PostGIS format
      const locationString = `POINT(${location.longitude} ${location.latitude})`;

      const { data, error } = await supabase
        .from('employer_profiles')
        .update({
          primary_location: locationString,
        })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

// Helper function to convert base64 to blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
