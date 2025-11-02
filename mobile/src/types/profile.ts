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
