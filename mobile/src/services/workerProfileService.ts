import { supabase } from '../lib/supabase';
import { WorkerProfile, WorkerProfileFormData, Location } from '../types/profile';
import * as FileSystem from 'expo-file-system';

export class WorkerProfileService {
  /**
   * Create a new worker profile
   */
  static async createProfile(userId: string, profileData: WorkerProfileFormData) {
    try {
      const profile: Partial<WorkerProfile> = {
        user_id: userId,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        profile_photo_url: profileData.profile_photo_url,
        primary_trade: profileData.primary_trade,
        experience_level: profileData.experience_level,
        years_experience: profileData.years_experience ? parseInt(profileData.years_experience) : undefined,
        bio: profileData.bio,
        hourly_rate_min: profileData.hourly_rate_min ? parseFloat(profileData.hourly_rate_min) : undefined,
        hourly_rate_max: profileData.hourly_rate_max ? parseFloat(profileData.hourly_rate_max) : undefined,
        willing_to_travel: profileData.willing_to_travel,
        has_own_tools: profileData.has_own_tools,
        has_transportation: profileData.has_transportation,
        work_radius_miles: parseInt(profileData.work_radius_miles) || 50,
        total_jobs_completed: 0,
        average_rating: 0,
        total_reviews: 0,
      };

      const { data, error } = await supabase
        .from('worker_profiles')
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
   * Get worker profile by user ID
   */
  static async getProfileByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('worker_profiles')
        .select(`
          *,
          worker_skills (
            skill_id,
            proficiency_level,
            skills (name, category)
          ),
          certifications (*),
          work_history (*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return { data: data as WorkerProfile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update worker profile
   */
  static async updateProfile(profileId: string, updates: Partial<WorkerProfile>) {
    try {
      const { data, error } = await supabase
        .from('worker_profiles')
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
   * Upload profile photo
   */
  static async uploadProfilePhoto(userId: string, photoUri: string) {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file extension
      const ext = photoUri.split('.').pop() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${ext}`;

      // Convert base64 to blob
      const blob = base64ToBlob(base64, `image/${ext}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update profile location
   */
  static async updateLocation(profileId: string, location: Location) {
    try {
      // Convert location to PostGIS format
      const locationString = `POINT(${location.longitude} ${location.latitude})`;

      const { data, error } = await supabase
        .from('worker_profiles')
        .update({
          preferred_work_location: locationString,
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

  /**
   * Add skills to profile
   */
  static async addSkills(workerId: string, skills: Array<{ skill_id: string; proficiency_level: string }>) {
    try {
      const skillRecords = skills.map(skill => ({
        worker_id: workerId,
        ...skill,
      }));

      const { data, error } = await supabase
        .from('worker_skills')
        .insert(skillRecords)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Add certification
   */
  static async addCertification(workerId: string, certification: any) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          worker_id: workerId,
          ...certification,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Add work history
   */
  static async addWorkHistory(workerId: string, workHistory: any) {
    try {
      const { data, error } = await supabase
        .from('work_history')
        .insert({
          worker_id: workerId,
          ...workHistory,
        })
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
