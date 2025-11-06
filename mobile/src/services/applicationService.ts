import { supabase } from '../utils/supabase';
import { Application, ApplicationWithDetails, ApplicationStatus } from '../types/profile';

export class ApplicationService {
  /**
   * Worker: Get own applications
   */
  static async getMyApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*)
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      return { data: data as Application[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Worker: Apply to job
   */
  static async applyToJob(jobId: string, coverMessage?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get worker_profile_id from worker_profiles table
      const { data: workerProfile, error: profileError } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !workerProfile) {
        throw new Error('Worker profile not found');
      }

      const { data, error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          worker_id: workerProfile.id,
          cover_letter: coverMessage, // Matches DB column name
        })
        .select()
        .single();

      if (error) throw error;

      return { data: data as Application, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Worker: Withdraw application
   */
  static async withdrawApplication(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Check if worker already applied to a job
   */
  static async checkExistingApplication(jobId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get worker_profile_id
      const { data: workerProfile } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!workerProfile) return { data: null, error: null };

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('worker_id', workerProfile.id)
        .maybeSingle();

      if (error) throw error;

      return { data: data as Application | null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Employer: Get applications for a job
   */
  static async getJobApplications(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          worker:worker_profiles!applications_worker_id_fkey(*)
        `)
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false});

      if (error) throw error;

      return { data: data as ApplicationWithDetails[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Employer: Update application status
   */
  static async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Subscribe to application updates for a job (employer)
   */
  static subscribeToJobApplications(
    jobId: string,
    callback: (application: Application) => void
  ) {
    const channel = supabase
      .channel(`job_applications_${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          callback(payload.new as Application);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Subscribe to own applications (worker)
   * Note: RLS policies automatically filter by user, so we don't need to filter here
   */
  static async subscribeToMyApplications(callback: (application: Application) => void) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get worker_profile_id for filtering
      const { data: workerProfile } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!workerProfile) {
        console.error('Worker profile not found for subscription');
        return () => {};
      }

      const channel = supabase
        .channel('my_applications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'applications',
            filter: `worker_id=eq.${workerProfile.id}`,
          },
          (payload) => {
            callback(payload.new as Application);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error: any) {
      console.error('Error subscribing to applications:', error);
      return () => {}; // Return empty cleanup function
    }
  }
}
