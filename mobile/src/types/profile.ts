/**
 * Profile Types for CrewUp
 * Based on database schema from design.md
 */

export type ExperienceLevel = 'entry' | 'intermediate' | 'experienced' | 'expert';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface WorkerSkill {
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  skill?: Skill;
}

export interface Certification {
  id?: string;
  certification_name: string;
  issuing_organization?: string;
  issue_date?: Date;
  expiry_date?: Date;
  certification_number?: string;
  photo_urls?: string[];
  verified: boolean;
}

export interface WorkHistory {
  id?: string;
  company_name: string;
  position_title: string;
  start_date: Date;
  end_date?: Date;
  is_current: boolean;
  description?: string;
}

export interface WorkerProfile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  profile_photo_url?: string;
  primary_trade?: string;
  experience_level?: ExperienceLevel;
  years_experience?: number;
  bio?: string;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  willing_to_travel: boolean;
  has_own_tools: boolean;
  has_transportation: boolean;
  preferred_work_location?: Location;
  work_radius_miles: number;
  resume_url?: string;
  total_jobs_completed: number;
  average_rating: number;
  total_reviews: number;
  created_at?: Date;
  updated_at?: Date;
  // Related data
  skills?: WorkerSkill[];
  certifications?: Certification[];
  work_history?: WorkHistory[];
}

export interface EmployerProfile {
  id?: string;
  user_id: string;
  company_name: string;
  company_logo_url?: string;
  business_type?: string;
  company_size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  description?: string;
  website?: string;
  primary_location?: Location;
  service_radius_miles: number;
  license_number?: string;
  insurance_verified: boolean;
  average_rating: number;
  total_reviews: number;
  total_jobs_posted: number;
  created_at?: Date;
  updated_at?: Date;
}

// Job Posting types
export type JobType = 'standard' | 'day_labor';
export type JobStatus = 'draft' | 'active' | 'filled' | 'closed' | 'expired';
export type PayType = 'hourly' | 'salary' | 'per_project';

export interface JobPosting {
  id?: string;
  employer_id: string;
  job_type: JobType;
  title: string;
  description: string;
  required_trade?: string;
  required_skills?: string[];
  pay_type: PayType;
  pay_rate_min?: number;
  pay_rate_max?: number;
  pay_amount?: number;
  job_location?: Location;
  location_address?: string;
  start_date?: Date;
  duration_weeks?: number;
  required_certifications?: string[];
  experience_required?: ExperienceLevel;
  workers_needed: number;
  status: JobStatus;
  applications_count: number;
  views_count: number;
  created_at?: Date;
  updated_at?: Date;
  expires_at?: Date;
}

// Form state types
export interface WorkerProfileFormData {
  first_name: string;
  last_name: string;
  profile_photo_url?: string;
  primary_trade?: string;
  experience_level?: ExperienceLevel;
  years_experience?: string;
  bio?: string;
  hourly_rate_min?: string;
  hourly_rate_max?: string;
  willing_to_travel: boolean;
  has_own_tools: boolean;
  has_transportation: boolean;
  work_radius_miles: string;
}

export interface EmployerProfileFormData {
  company_name: string;
  company_logo_url?: string;
  business_type?: string;
  company_size?: string;
  description?: string;
  website?: string;
  service_radius_miles: string;
  license_number?: string;
  phone?: string;
  email?: string;
}

export interface JobPostingFormData {
  job_type: JobType;
  title: string;
  description: string;
  required_trade?: string;
  required_skills?: string[];
  pay_type: PayType;
  pay_rate_min?: string;
  pay_rate_max?: string;
  pay_amount?: string;
  location_address?: string;
  start_date?: string;
  duration_weeks?: string;
  required_certifications?: string[];
  experience_required?: ExperienceLevel;
  workers_needed: string;
}

// Application types (matches existing database schema)
export type ApplicationStatus = 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  job_id: string;
  worker_id: string;
  status: ApplicationStatus;
  cover_letter: string | null; // Matches DB column name
  is_priority: boolean;
  applied_at: string; // Matches DB column name
  viewed_at: string | null;
  status_updated_at: string | null;
  // Joined data
  job?: JobPosting;
  worker?: WorkerProfile;
}

export interface ApplicationWithDetails extends Application {
  job: JobPosting;
  worker: WorkerProfile;
}
