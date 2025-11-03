import { supabase } from '../utils/supabase';
import { JobPosting, JobPostingFormData, Location } from '../types/profile';

export class JobPostingService {
  /**
   * Create a new job posting
   */
  static async createJob(employerId: string, jobData: JobPostingFormData) {
    try {
      const job: Partial<JobPosting> = {
        employer_id: employerId,
        job_type: jobData.job_type,
        title: jobData.title,
        description: jobData.description,
        required_trade: jobData.required_trade,
        required_skills: jobData.required_skills,
        pay_type: jobData.pay_type,
        pay_rate_min: jobData.pay_rate_min ? parseFloat(jobData.pay_rate_min) : undefined,
        pay_rate_max: jobData.pay_rate_max ? parseFloat(jobData.pay_rate_max) : undefined,
        pay_amount: jobData.pay_amount ? parseFloat(jobData.pay_amount) : undefined,
        location_address: jobData.location_address,
        start_date: jobData.start_date ? new Date(jobData.start_date) : undefined,
        duration_weeks: jobData.duration_weeks ? parseInt(jobData.duration_weeks) : undefined,
        required_certifications: jobData.required_certifications,
        experience_required: jobData.experience_required,
        workers_needed: parseInt(jobData.workers_needed) || 1,
        status: 'draft',
        applications_count: 0,
        views_count: 0,
      };

      const { data, error } = await supabase
        .from('job_postings')
        .insert(job)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get job postings by employer ID
   */
  static async getJobsByEmployer(employerId: string, status?: string) {
    try {
      let query = supabase
        .from('job_postings')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as JobPosting[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get job posting by ID
   */
  static async getJobById(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return { data: data as JobPosting, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update job posting
   */
  static async updateJob(jobId: string, updates: Partial<JobPosting>) {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Update job location
   */
  static async updateJobLocation(jobId: string, location: Location) {
    try {
      // Convert location to PostGIS format
      const locationString = `POINT(${location.longitude} ${location.latitude})`;

      const { data, error } = await supabase
        .from('job_postings')
        .update({
          job_location: locationString,
        })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Publish job (change status from draft to active)
   */
  static async publishJob(jobId: string) {
    try {
      // Set expires_at to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { data, error } = await supabase
        .from('job_postings')
        .update({
          status: 'active',
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Close job posting
   */
  static async closeJob(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .update({ status: 'closed' })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data, error: error.message };
    }
  }

  /**
   * Delete job posting
   */
  static async deleteJob(jobId: string) {
    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Search jobs (will use Meilisearch in future)
   */
  static async searchJobs(query: string, filters?: {
    trade?: string;
    jobType?: string;
    location?: Location;
    radius?: number;
  }) {
    try {
      let supabaseQuery = supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.trade) {
        supabaseQuery = supabaseQuery.eq('required_trade', filters.trade);
      }

      if (filters?.jobType) {
        supabaseQuery = supabaseQuery.eq('job_type', filters.jobType);
      }

      // Text search in title and description
      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await supabaseQuery.limit(50);

      if (error) throw error;

      return { data: data as JobPosting[], error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}
