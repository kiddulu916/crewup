CrewUp APP - COMPREHENSIVE DESIGN PLAN
Using Free/Low-Cost Infrastructure

PHASE 1: UI/UX DESIGN & PROTOTYPING (Weeks 1-3)
1.1 Design System Foundation
Color Palette (Construction-themed):

Primary: Safety Orange (#FF6B35) - Action buttons, CTAs
Secondary: Steel Blue (#2C3E50) - Headers, navigation
Accent: Construction Yellow (#FFC107) - Highlights, warnings
Success: Safety Green (#27AE60)
Background: Light Gray (#F5F5F5)
Text: Dark Charcoal (#2C3E50)

Typography:

Headers: Roboto Bold (construction industry standard, high readability)
Body: Open Sans Regular
Mobile sizing: 16px minimum for accessibility

Component Library:

Bottom navigation (mobile primary)
Floating action buttons
Card-based layouts
Swipeable components
Pull-to-refresh patterns

1.2 User Flows & Wireframes
Worker User Flow:

Onboarding/Registration

Phone number or email signup
Role selection (Worker/Employer)
Basic profile setup (name, trade, experience level)
Location permissions request
Set preferred work radius
Optional: Quick skill selection


Home Dashboard

Top: Search bar + Filters
Quick stats card (applications sent, profile views [premium], messages)
Tab switcher: "All Jobs" | "Day Labor" | "Saved"
Job feed (card-based, infinite scroll)
Bottom nav: Home | Search | Day Labor | Messages | Profile


Job Detail View

Job title, company, pay rate
Distance from current/preferred location
Full description, requirements
Company profile preview
Application status indicator
Quick apply button (if premium: "Priority Apply")
Save job, Share options


Day Labor Section

Map view toggle with list view
Filter: "Today" | "Tomorrow" | "This Week"
Urgent jobs badge (posted <2 hours ago)
Quick apply with one-tap
Real-time availability counter


Profile Builder

Profile photo
Contact information
Trade/Skills (searchable tags)
Experience level dropdown
Work history (add multiple entries)
Certifications upload section (camera + gallery)
Resume upload OR manual entry fields
Preferred work location (map picker)
Work radius slider (50-200 miles)
Availability calendar


Applications Page

Filter: Pending | Viewed | Accepted | Rejected
Application cards with status
Withdraw application option
Message employer button


Messages

Conversation list
Real-time indicators (online status, typing)
Archived conversations
Job context in header


Premium Upgrade Modal

Feature comparison table
"Who's viewed your profile" teaser (blurred)
"Get priority placement" badge preview
Subscription options (monthly/yearly)



Employer User Flow:

Onboarding/Registration

Company name, business type
Company size
Primary location
Service radius
License/insurance verification


Home Dashboard

Top: "Post Job" prominent button
Active jobs overview cards
Recent applicants feed
Quick stats: Total applicants, Response rate
Bottom nav: Home | Post Job | Search Workers | Messages | Account


Post Job Interface

Job type toggle: Standard | Day Labor
Job title, description (templates available)
Trade/skills required (multi-select)
Pay type: Hourly/Salary/Per Project
Pay range slider
Location picker
Start date picker
Duration estimate
Certifications required (optional)
Premium: "Get worker recommendations" toggle


Job Management

Tab: Active | Filled | Drafts | Closed
Edit/Pause/Close options
Applicant count per job
Quick view applicants


Applicant Review

List view with filters (distance, experience, ratings)
Quick actions: Message, Accept, Reject
Profile preview cards
Application timestamp
Premium: "Recommended" badge on top matches


Worker Search

Advanced filters: Trade, certifications, distance, availability
Map view toggle
Worker cards: Photo, trade, rating, distance
Save/Contact options
Premium: Extended search history


Premium Features Dashboard

Recommendation algorithm results per job
Analytics: View counts, application trends
Featured job posting option



1.3 Responsive Breakpoints

Mobile: 320px - 767px (primary focus)
Tablet: 768px - 1024px
Desktop: 1025px+
Web app uses same component library, adjusted layouts


PHASE 2: TECHNICAL ARCHITECTURE (Weeks 3-4)
2.1 Technology Stack
Frontend:
Mobile Apps:
- React Native 0.72+ (Expo managed workflow)
- React Navigation (bottom tabs + stack)
- Redux Toolkit (state management)
- Supabase Client (auth, database, real-time)
- React Native Maps (geolocation)
- Expo Image Picker (photo uploads)
- Axios (API calls)
- AsyncStorage (local persistence)

Web Application:
- React 18+
- Next.js 14+ (deployed on Vercel)
- Redux Toolkit
- Supabase Client
- Leaflet/Mapbox GL (maps)
- Tailwind CSS (styling)
```

**Backend:**
```
Primary Backend:
- Supabase (Database, Auth, Storage, Real-time)
  * PostgreSQL 15+ with PostGIS extension
  * Built-in JWT authentication
  * Row Level Security (RLS)
  * Edge Functions (Deno runtime)
  * Real-time subscriptions via WebSockets

Optional Custom Backend (if needed):
- Railway.app or Render.com (Node.js hosting)
- Node.js 18+ LTS
- Express.js 4.x
- TypeScript (type safety)

Caching:
- Upstash Redis (serverless Redis)
  * 10,000 commands/day free
  * REST API access

Search:
- Meilisearch Cloud (free tier)
  * 100,000 documents
  * 10,000 searches/month
  * Typo-tolerant search
  * Geo-search capabilities

File Storage:
- Supabase Storage (1GB free)
  * Profile photos, small files
- Cloudflare R2 (10GB free)
  * Resumes, certification documents
  * No egress fees

Payments:
- Stripe API (subscriptions, premium features)
  * No monthly fees, just transaction fees

Notifications:
- Firebase Cloud Messaging (push notifications - free)
- Resend (email notifications - 3,000/month free)

DevOps:
- Docker (for local development)
- Vercel (web app deployment - free)
- Expo EAS (mobile app builds - free tier)
- GitHub Actions (CI/CD - free)
2.2 Database Schema
sql-- Note: This runs on Supabase PostgreSQL with PostGIS enabled

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- USERS TABLE (Managed by Supabase Auth, but we extend it)
-- Supabase creates auth.users automatically
-- We create a public profile table that references it

-- PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type TEXT CHECK (user_type IN ('worker', 'employer')) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- WORKER PROFILES
CREATE TABLE worker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo_url TEXT,
    primary_trade VARCHAR(100),
    experience_level TEXT CHECK (experience_level IN ('entry', 'intermediate', 'experienced', 'expert')),
    years_experience INTEGER,
    bio TEXT,
    hourly_rate_min DECIMAL(10,2),
    hourly_rate_max DECIMAL(10,2),
    willing_to_travel BOOLEAN DEFAULT TRUE,
    has_own_tools BOOLEAN DEFAULT FALSE,
    has_transportation BOOLEAN DEFAULT FALSE,
    preferred_work_location GEOGRAPHY(POINT, 4326),
    work_radius_miles INTEGER DEFAULT 50,
    resume_url TEXT,
    total_jobs_completed INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Worker profiles are viewable by everyone"
    ON worker_profiles FOR SELECT
    USING (true);

CREATE POLICY "Workers can update their own profile"
    ON worker_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert their own profile"
    ON worker_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- WORKER SKILLS (many-to-many)
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50)
);

CREATE TABLE worker_skills (
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    PRIMARY KEY (worker_id, skill_id)
);

ALTER TABLE worker_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view worker skills"
    ON worker_skills FOR SELECT
    USING (true);

CREATE POLICY "Workers can manage their own skills"
    ON worker_skills FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = worker_skills.worker_id
            AND user_id = auth.uid()
        )
    );

-- WORKER CERTIFICATIONS
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    certification_name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    certification_number VARCHAR(100),
    photo_urls TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certifications"
    ON certifications FOR SELECT
    USING (true);

CREATE POLICY "Workers can manage their own certifications"
    ON certifications FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = certifications.worker_id
            AND user_id = auth.uid()
        )
    );

-- WORK HISTORY
CREATE TABLE work_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    position_title VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE work_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work history"
    ON work_history FOR SELECT
    USING (true);

CREATE POLICY "Workers can manage their own work history"
    ON work_history FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = work_history.worker_id
            AND user_id = auth.uid()
        )
    );

-- EMPLOYER PROFILES
CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_logo_url TEXT,
    business_type VARCHAR(100),
    company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
    description TEXT,
    website VARCHAR(255),
    primary_location GEOGRAPHY(POINT, 4326),
    service_radius_miles INTEGER DEFAULT 100,
    license_number VARCHAR(100),
    insurance_verified BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_jobs_posted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employer profiles are viewable by everyone"
    ON employer_profiles FOR SELECT
    USING (true);

CREATE POLICY "Employers can update their own profile"
    ON employer_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile"
    ON employer_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- JOBS TABLE
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    job_type TEXT CHECK (job_type IN ('standard', 'day_labor')) NOT NULL,
    trade_category VARCHAR(100),
    required_skills TEXT[],
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    location_address TEXT,
    pay_type TEXT CHECK (pay_type IN ('hourly', 'salary', 'per_project')) NOT NULL,
    pay_rate_min DECIMAL(10,2),
    pay_rate_max DECIMAL(10,2),
    start_date DATE,
    estimated_duration VARCHAR(100),
    positions_available INTEGER DEFAULT 1,
    positions_filled INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'filled', 'closed', 'draft')) DEFAULT 'active',
    requires_certification BOOLEAN DEFAULT FALSE,
    required_certifications TEXT[],
    experience_level_required TEXT CHECK (experience_level_required IN ('entry', 'intermediate', 'experienced', 'expert')),
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Create spatial index for efficient geoqueries
CREATE INDEX idx_jobs_location ON jobs USING GIST(location);
CREATE INDEX idx_worker_location ON worker_profiles USING GIST(preferred_work_location);
CREATE INDEX idx_employer_location ON employer_profiles USING GIST(primary_location);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (status = 'active' OR 
           EXISTS (
               SELECT 1 FROM employer_profiles
               WHERE id = jobs.employer_id
               AND user_id = auth.uid()
           ));

CREATE POLICY "Employers can manage their own jobs"
    ON jobs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM employer_profiles
            WHERE id = jobs.employer_id
            AND user_id = auth.uid()
        )
    );

-- JOB APPLICATIONS
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'viewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
    cover_letter TEXT,
    is_priority BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    viewed_at TIMESTAMPTZ,
    status_updated_at TIMESTAMPTZ,
    UNIQUE(job_id, worker_id)
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_worker ON applications(worker_id);
CREATE INDEX idx_applications_job ON applications(job_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their own applications"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = applications.worker_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Employers can view applications for their jobs"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM jobs j
            JOIN employer_profiles ep ON j.employer_id = ep.id
            WHERE j.id = applications.job_id
            AND ep.user_id = auth.uid()
        )
    );

CREATE POLICY "Workers can create applications"
    ON applications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = applications.worker_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Workers can update their own applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = applications.worker_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Employers can update applications for their jobs"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM jobs j
            JOIN employer_profiles ep ON j.employer_id = ep.id
            WHERE j.id = applications.job_id
            AND ep.user_id = auth.uid()
        )
    );

-- PROFILE VIEWS (Premium feature tracking)
CREATE TABLE profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50)
);

CREATE INDEX idx_profile_views_worker ON profile_views(worker_id, viewed_at DESC);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their own profile views"
    ON profile_views FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = profile_views.worker_id
            AND user_id = auth.uid()
        )
    );

-- CONVERSATIONS (Message threads)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(worker_id, employer_id, job_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = conversations.worker_id
            AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM employer_profiles
            WHERE id = conversations.employer_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = conversations.worker_id
            AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM employer_profiles
            WHERE id = conversations.employer_id
            AND user_id = auth.uid()
        )
    );

-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            LEFT JOIN worker_profiles wp ON c.worker_id = wp.id
            LEFT JOIN employer_profiles ep ON c.employer_id = ep.id
            WHERE c.id = messages.conversation_id
            AND (wp.user_id = auth.uid() OR ep.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM conversations c
            LEFT JOIN worker_profiles wp ON c.worker_id = wp.id
            LEFT JOIN employer_profiles ep ON c.employer_id = ep.id
            WHERE c.id = messages.conversation_id
            AND (wp.user_id = auth.uid() OR ep.user_id = auth.uid())
        )
    );

-- REVIEWS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_type TEXT CHECK (reviewer_type IN ('worker', 'employer')) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, reviewer_id, reviewee_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('worker_premium', 'employer_premium')) NOT NULL,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status TEXT CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')) DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- SAVED JOBS (Bookmarks for workers)
CREATE TABLE saved_jobs (
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (worker_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their own saved jobs"
    ON saved_jobs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = saved_jobs.worker_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Workers can manage their own saved jobs"
    ON saved_jobs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM worker_profiles
            WHERE id = saved_jobs.worker_id
            AND user_id = auth.uid()
        )
    );

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Database Functions for Geospatial Queries

-- Find jobs within radius
CREATE OR REPLACE FUNCTION jobs_within_radius(
    user_lat FLOAT,
    user_lon FLOAT,
    radius_miles INTEGER,
    job_status TEXT DEFAULT 'active'
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    job_type TEXT,
    trade_category VARCHAR,
    pay_rate_min DECIMAL,
    pay_rate_max DECIMAL,
    distance_miles FLOAT,
    company_name VARCHAR,
    company_logo_url TEXT,
    company_rating DECIMAL,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.description,
        j.job_type,
        j.trade_category,
        j.pay_rate_min,
        j.pay_rate_max,
        ST_Distance(
            j.location,
            ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1609.34 AS distance_miles,
        ep.company_name,
        ep.company_logo_url,
        ep.average_rating,
        j.created_at
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE 
        j.status = job_status
        AND ST_DWithin(
            j.location,
            ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
            radius_miles * 1609.34
        )
    ORDER BY distance_miles ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Find workers within employer's radius
CREATE OR REPLACE FUNCTION workers_within_radius(
    employer_lat FLOAT,
    employer_lon FLOAT,
    radius_miles INTEGER,
    required_skills TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_photo_url TEXT,
    primary_trade VARCHAR,
    experience_level TEXT,
    average_rating DECIMAL,
    distance_miles FLOAT,
    matching_skills TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wp.id,
        wp.first_name,
        wp.last_name,
        wp.profile_photo_url,
        wp.primary_trade,
        wp.experience_level,
        wp.average_rating,
        ST_Distance(
            wp.preferred_work_location,
            ST_SetSRID(ST_MakePoint(employer_lon, employer_lat), 4326)::geography
        ) / 1609.34 AS distance_miles,
        COALESCE(
            ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name = ANY(required_skills)),
            ARRAY[]::TEXT[]
        ) AS matching_skills
    FROM worker_profiles wp
    LEFT JOIN worker_skills ws ON wp.id = ws.worker_id
    LEFT JOIN skills s ON ws.skill_id = s.id
    WHERE 
        wp.work_radius_miles >= ST_Distance(
            wp.preferred_work_location,
            ST_SetSRID(ST_MakePoint(employer_lon, employer_lat), 4326)::geography
        ) / 1609.34
        AND (required_skills IS NULL OR s.name = ANY(required_skills))
    GROUP BY wp.id
    ORDER BY distance_miles ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_conversation
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_timestamp();

-- Trigger to update profile updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at
    BEFORE UPDATE ON worker_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_updated_at
    BEFORE UPDATE ON employer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
2.3 API Architecture
Supabase Client Implementation:
javascript// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export const auth = {
  signUp: async (email, password, userType) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (!error && data.user) {
      // Create profile entry
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        user_type: userType
      })
    }
    
    return { data, error }
  },
  
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Worker profile operations
export const workerProfile = {
  get: async (workerId) => {
    return await supabase
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
      .eq('id', workerId)
      .single()
  },
  
  update: async (workerId, updates) => {
    return await supabase
      .from('worker_profiles')
      .update(updates)
      .eq('id', workerId)
  },
  
  uploadPhoto: async (userId, file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file)
    
    if (error) return { error }
    
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)
    
    return { data: publicUrl, error: null }
  }
}

// Job operations
export const jobs = {
  getNearby: async (lat, lon, radiusMiles) => {
    return await supabase.rpc('jobs_within_radius', {
      user_lat: lat,
      user_lon: lon,
      radius_miles: radiusMiles
    })
  },
  
  getById: async (jobId) => {
    return await supabase
      .from('jobs')
      .select(`
        *,
        employer_profiles (
          company_name,
          company_logo_url,
          average_rating
        )
      `)
      .eq('id', jobId)
      .single()
  },
  
  create: async (jobData) => {
    return await supabase
      .from('jobs')
      .insert(jobData)
      .select()
  },
  
  update: async (jobId, updates) => {
    return await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
  },
  
  getDayLabor: async (lat, lon, radiusMiles) => {
    return await supabase.rpc('jobs_within_radius', {
      user_lat: lat,
      user_lon: lon,
      radius_miles: radiusMiles,
      job_status: 'active'
    })
    .eq('job_type', 'day_labor')
    .eq('is_urgent', true)
  }
}

// Application operations
export const applications = {
  create: async (applicationData) => {
    return await supabase
      .from('applications')
      .insert(applicationData)
      .select()
  },
  
  getMyApplications: async (workerId) => {
    return await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company_name,
          location_address
        )
      `)
      .eq('worker_id', workerId)
      .order('applied_at', { ascending: false })
  },
  
  updateStatus: async (applicationId, status) => {
    return await supabase
      .from('applications')
      .update({ 
        status,
        status_updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
  }
}

// Messaging operations with real-time
export const messaging = {
  getConversations: async (userId, userType) => {
    const column = userType === 'worker' ? 'worker_id' : 'employer_id'
    
    return await supabase
      .from('conversations')
      .select(`
        *,
        messages (
          message_text,
          created_at,
          is_read
        )
      `)
      .eq(column, userId)
      .order('last_message_at', { ascending: false })
  },
  
  getMessages: async (conversationId) => {
    return await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
  },
  
  sendMessage: async (conversationId, senderId, messageText) => {
    return await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message_text: messageText
      })
      .select()
  },
  
  subscribeToConversation: (conversationId, callback) => {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe()
  },
  
  markAsRead: async (messageId) => {
    return await supabase
      .from('messages')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId)
  }
}

// Search operations (will integrate with Meilisearch)
export const search = {
  jobs: async (query, filters = {}) => {
    let queryBuilder = supabase
      .from('jobs')
      .select(`
        *,
        employer_profiles (company_name, company_logo_url)
      `)
      .eq('status', 'active')
    
    if (filters.trade_category) {
      queryBuilder = queryBuilder.eq('trade_category', filters.trade_category)
    }
    
    if (filters.job_type) {
      queryBuilder = queryBuilder.eq('job_type', filters.job_type)
    }
    
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }
    
    return await queryBuilder
  },
  
  workers: async (lat, lon, radiusMiles, skills = []) => {
    return await supabase.rpc('workers_within_radius', {
      employer_lat: lat,
      employer_lon: lon,
      radius_miles: radiusMiles,
      required_skills: skills.length > 0 ? skills : null
    })
  }
}
Optional Custom Backend Endpoints (Railway/Render):
If you need custom logic that Supabase Edge Functions can't handle:
javascript// server.js (Express on Railway/Render)
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Client } from 'meilisearch'

const app = express()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const meili = new Client({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_KEY
})

app.use(express.json())

// Premium worker recommendations
app.get('/api/premium/recommendations/:jobId', async (req, res) => {
  const { jobId } = req.params
  
  // Get job details
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()
  
  // Get job location coordinates
  const jobLat = job.location.coordinates[1]
  const jobLon = job.location.coordinates[0]
  
  // Complex scoring algorithm
  const { data: workers } = await supabase.rpc('workers_within_radius', {
    employer_lat: jobLat,
    employer_lon: jobLon,
    radius_miles: 100,
    required_skills: job.required_skills
  })
  
  // Calculate scores based on multiple factors
  const scoredWorkers = workers.map(worker => {
    let score = 0
    
    // Distance score (closer = higher)
    score += Math.max(0, 25 - (worker.distance_miles * 0.25))
    
    // Rating score
    score += worker.average_rating * 4
    
    // Experience match
    if (worker.experience_level === job.experience_level_required) {
      score += 20
    }
    
    // Skill match count
    score += (worker.matching_skills?.length || 0) * 10
    
    return { ...worker, recommendation_score: score }
  })
  
  // Sort by score and return top 20
  const topWorkers = scoredWorkers
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, 20)
  
  res.json({ workers: topWorkers })
})

// Stripe webhook handler
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature']
  
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  
  // Handle subscription events
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object
      
      await supabase
        .from('subscriptions')
        .upsert({
          stripe_subscription_id: subscription.id,
          user_id: subscription.metadata.user_id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000)
        })
      
      // Update user premium status
      await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expires_at: new Date(subscription.current_period_end * 1000)
        })
        .eq('id', subscription.metadata.user_id)
      break
    
    case 'customer.subscription.deleted':
      const canceledSub = event.data.object
      
      await supabase
        .from('profiles')
        .update({
          is_premium: false,
          premium_expires_at: null
        })
        .eq('id', canceledSub.metadata.user_id)
      break
  }
  
  res.json({ received: true })
})

// Meilisearch indexing
app.post('/api/search/index-job', async (req, res) => {
  const { job } = req.body
  
  await meili.index('jobs').addDocuments([{
    id: job.id,
    title: job.title,
    description: job.description,
    trade_category: job.trade_category,
    required_skills: job.required_skills,
    location_address: job.location_address,
    _geo: {
      lat: job.location.coordinates[1],
      lng: job.location.coordinates[0]
    }
  }])
  
  res.json({ success: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
2.4 Geolocation Implementation
The geolocation is handled primarily through Supabase with PostGIS, but here's the complete implementation:
javascript// Frontend - Getting user location
import * as Location from 'expo-location'

export const getUserLocation = async () => {
  // Request permissions
  const { status } = await Location.requestForegroundPermissionsAsync()
  
  if (status !== 'granted') {
    throw new Error('Location permission denied')
  }
  
  // Get current position
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced
  })
  
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  }
}

// Search for nearby jobs
export const searchNearbyJobs = async (radiusMiles = 50) => {
  const { latitude, longitude } = await getUserLocation()
  
  const { data, error } = await supabase.rpc('jobs_within_radius', {
    user_lat: latitude,
    user_lon: longitude,
    radius_miles: radiusMiles
  })
  
  return { jobs: data, error }
}

// Map component for job display
import MapView, { Marker, Circle } from 'react-native-maps'

export const JobMapView = ({ jobs, userLocation, radiusMiles }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: radiusMiles / 69, // Approximate conversion
        longitudeDelta: radiusMiles / 69
      }}
    >
      {/* User location */}
      <Marker
        coordinate={userLocation}
        title="Your Location"
        pinColor="blue"
      />
      
      {/* Radius circle */}
      <Circle
        center={userLocation}
        radius={radiusMiles * 1609.34} // Convert to meters
        strokeColor="rgba(0, 112, 255, 0.5)"
        fillColor="rgba(0, 112, 255, 0.1)"
      />
      
      {/* Job markers */}
      {jobs.map(job => (
        <Marker
          key={job.id}
          coordinate={{
            latitude: job.location.coordinates[1],
            longitude: job.location.coordinates[0]
          }}
          title={job.title}
          description={`${job.distance_miles.toFixed(1)} miles away`}
        />
      ))}
    </MapView>
  )
}
2.5 Recommendation Algorithm (Premium Feature)
javascript// Supabase Edge Function: recommend-workers
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )
  
  const { jobId } = await req.json()
  
  // Get job details
  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()
  
  // Extract coordinates
  const [jobLon, jobLat] = job.location.coordinates
  
  // Get workers in radius with skills
  const { data: workers } = await supabase.rpc('workers_within_radius', {
    employer_lat: jobLat,
    employer_lon: jobLon,
    radius_miles: 100,
    required_skills: job.required_skills
  })
  
  // Score each worker
  const scoredWorkers = workers.map(worker => {
    let score = 0
    
    // Distance score (0-25 points)
    const distanceScore = Math.max(0, 25 - (worker.distance_miles * 0.25))
    score += distanceScore
    
    // Rating score (0-20 points)
    score += (worker.average_rating || 0) * 4
    
    // Experience match (0-20 points)
    if (worker.experience_level === job.experience_level_required) {
      score += 20
    } else if (worker.experience_level === 'expert') {
      score += 18
    } else if (worker.experience_level === 'experienced') {
      score += 15
    }
    
    // Skill match (0-30 points)
    const matchingSkillsCount = worker.matching_skills?.length || 0
    score += Math.min(matchingSkillsCount * 10, 30)
    
    // Completion history (0-10 points)
    score += Math.min((worker.total_jobs_completed || 0) * 0.5, 10)
    
    return {
      ...worker,
      recommendation_score: Math.round(score),
      score_breakdown: {
        distance: Math.round(distanceScore),
        rating: Math.round((worker.average_rating || 0) * 4),
        experience: worker.experience_level === job.experience_level_required ? 20 : 15,
        skills: Math.min(matchingSkillsCount * 10, 30),
        history: Math.min((worker.total_jobs_completed || 0) * 0.5, 10)
      }
    }
  })
  
  // Return top 20 recommendations
  const topRecommendations = scoredWorkers
    .filter(w => w.recommendation_score >= 30) // Minimum threshold
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, 20)
  
  return new Response(
    JSON.stringify({ recommendations: topRecommendations }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})

PHASE 3: DEVELOPMENT ROADMAP
Sprint 1-2: Foundation & Authentication (2 weeks)
Frontend:

 Set up React Native (Expo) project
 Set up Next.js web project with Vercel
 Install and configure Supabase client
 Implement design system (colors, typography, components)
 Create reusable UI components library
 Build registration/login screens
 Build role selection flow
 Implement form validation
 Set up Redux store structure
 Configure navigation (React Navigation)

Backend:

 Create Supabase project
 Enable PostGIS extension
 Set up database schema (run all SQL migrations)
 Configure Row Level Security policies
 Set up Supabase Auth
 Configure email provider (Resend)
 Set up storage buckets (profile-photos, certifications, resumes)
 Configure CORS and security settings

Testing:

 Test authentication flow
 Test RLS policies
 Integration tests for registration


Sprint 3-4: Worker Profile & Geolocation (2 weeks)
Frontend:

 Build worker profile screens (view/edit)
 Implement profile photo upload (Expo Image Picker)
 Create skill selection interface
 Build certification upload flow
 Create work history form
 Implement map location picker (React Native Maps)
 Build radius slider component
 Add location permissions handling
 Implement offline data caching

Backend:

 Create worker profile CRUD operations
 Implement file upload to Supabase Storage
 Set up Cloudflare R2 for large files
 Create skills management
 Create certification endpoints
 Test geospatial queries
 Create database functions for geo-search

Testing:

 Test file uploads (photos, certifications)
 Test geospatial queries accuracy
 Profile CRUD tests


Sprint 5-6: Employer Profile & Job Posting (2 weeks)
Frontend:

 Build employer profile screens
 Create company logo upload
 Build job posting form (standard + day labor)
 Implement job preview
 Create job management dashboard
 Build job edit/delete functionality
 Add map picker for job location

Backend:

 Create employer profile operations
 Create job posting CRUD
 Implement job filtering logic
 Set up job geofencing queries
 Create job expiration logic (Edge Function)
 Index jobs in Meilisearch
 Create job status management

Testing:

 Job posting flow tests
 Geofenced job search tests
 Meilisearch indexing tests


Sprint 7-8: Job Discovery & Applications (2 weeks)
Frontend:

 Build job feed with infinite scroll
 Create job detail view
 Implement job filters (trade, pay, distance)
 Build day labor section
 Create map view for jobs
 Build application form
 Create saved jobs functionality
 Build my applications screen
 Add pull-to-refresh

Backend:

 Optimize job listing queries
 Implement advanced filtering
 Create day labor specific queries
 Create application CRUD
 Implement application status management
 Create saved jobs operations
 Set up application notifications

Testing:

 Search and filter tests
 Application flow tests
 Saved jobs tests


Sprint 9-10: Real-time Messaging (2 weeks)
Frontend:

 Build conversation list screen
 Create message thread UI
 Implement Supabase real-time subscriptions
 Add typing indicators (using Upstash Redis)
 Add online status indicators
 Implement message read receipts
 Add push notification handling (FCM)
 Handle offline messages queue

Backend:

 Set up Upstash Redis for presence
 Configure Supabase real-time channels
 Create conversation operations
 Implement message storage
 Set up Firebase Cloud Messaging
 Create notification triggers
 Implement push notification sending

Testing:

 Real-time message delivery tests
 Push notification tests
 Offline message queue tests


Sprint 11-12: Premium Features & Payments (2 weeks)
Frontend:

 Build premium upgrade modals
 Create subscription management screen
 Implement profile views tracker (worker premium)
 Build priority application UI
 Create recommendation view (employer premium)
 Add premium badges throughout app
 Integrate Stripe Checkout

Backend:

 Set up Stripe account
 Create subscription products in Stripe
 Implement Stripe Checkout sessions
 Create profile view tracking
 Deploy recommendation Edge Function
 Implement application priority logic
 Set up Stripe webhook handler (Railway/Render)
 Create subscription status checks

Testing:

 Payment flow tests (Stripe test mode)
 Subscription lifecycle tests
 Premium feature access tests
 Webhook handling tests


Sprint 13-14: Reviews & Ratings (2 weeks)
Frontend:

 Build review submission form
 Create rating display components
 Build review list views
 Add review moderation indicators
 Implement rating averages display

Backend:

 Create review operations
 Implement rating calculation triggers
 Create review moderation system
 Update profile ratings automatically
 Create review notifications

Testing:

 Review submission tests
 Rating calculation tests
 Moderation workflow tests


Sprint 15-16: Search & Optimization (2 weeks)
Frontend:

 Integrate Meilisearch client
 Implement advanced search UI
 Add search filters
 Create search history (premium)
 Optimize bundle size
 Implement code splitting
 Add loading skeletons
 Optimize images with ImageKit

Backend:

 Configure Meilisearch Cloud
 Set up search indexing webhooks
 Implement typo-tolerant search
 Create geo-search in Meilisearch
 Optimize database queries
 Add database indexes
 Set up Upstash Redis caching
 Implement query result caching

Testing:

 Search functionality tests
 Performance tests
 Load testing


Sprint 17-18: Polish, Testing & Launch Prep (2 weeks)
Frontend:

 Implement analytics (PostHog or Mixpanel)
 Add error boundaries
 Implement offline mode handling
 Polish animations and transitions
 Accessibility audit (A11y)
 Deep linking setup
 App icon and splash screens
 Cross-device testing

Backend:

 Implement API rate limiting (Upstash)
 Set up error monitoring (Sentry)
 Configure logging (LogTail)
 Security audit
 Database backup strategy
 Set up monitoring (BetterStack)
 Performance optimization
 Load testing

Testing:

 End-to-end testing (Detox)
 Cross-browser testing (web)
 Security penetration testing
 Beta user testing


Sprint 19-20: Beta Launch & Iteration (2 weeks)

 Deploy web app to Vercel
 Build mobile apps with EAS
 Submit to TestFlight (iOS) and Google Play Beta
 Internal beta testing
 Gather crash reports and fix bugs
 Monitor Sentry for errors
 Analyze user behavior (analytics)
 Gather user feedback
 Iterate based on feedback
 Prepare for public launch


PHASE 4: DEPLOYMENT & INFRASTRUCTURE
4.1 Free Tier Infrastructure Setup
yaml# Architecture Overview

Frontend Deployment:
  Web App:
    Platform: Vercel
    Framework: Next.js
    Features:
      - Automatic deployments from GitHub
      - Edge functions for SSR
      - CDN for static assets
      - Custom domain support
    Cost: Free (100GB bandwidth/month)
  
  Mobile Apps:
    Platform: Expo EAS Build
    Features:
      - iOS and Android builds
      - Over-the-air updates
      - TestFlight/Play Store distribution
    Cost: Free tier (30 builds/month)

Backend Services:
  Database:
    Platform: Supabase
    Service: PostgreSQL + PostGIS
    Storage: 500MB database
    Bandwidth: 2GB/month
    Features:
      - Automatic backups
      - Real-time subscriptions
      - Built-in auth
    Cost: Free → $25/month Pro
  
  Custom Backend (Optional):
    Platform: Railway.app OR Render.com
    Service: Node.js + Express
    Features:
      - GitHub auto-deploy
      - Environment variables
      - Automatic SSL
    Cost: $5 free credit/month → $5+/month paid

File Storage:
  Primary:
    Platform: Supabase Storage
    Storage: 1GB
    Usage: Profile photos, small files
    Cost: Free
  
  Secondary:
    Platform: Cloudflare R2
    Storage: 10GB
    Egress: Free (no bandwidth charges)
    Usage: Resumes, certifications
    Cost: Free

Caching:
  Platform: Upstash Redis
  Capacity: 10,000 commands/day
  Features:
    - REST API
    - Serverless friendly
    - Presence tracking
  Cost: Free → $10/month

Search:
  Platform: Meilisearch Cloud
  Documents: 100,000
  Searches: 10,000/month
  Features:
    - Typo-tolerant
    - Geo-search
    - Fast indexing
  Cost: Free → $30/month

Notifications:
  Push:
    Platform: Firebase Cloud Messaging
    Volume: Unlimited
    Cost: Free
  
  Email:
    Platform: Resend
    Volume: 3,000 emails/month
    Features:
      - Transactional emails
      - Email templates
    Cost: Free → $20/month

Monitoring:
  Errors:
    Platform: Sentry
    Events: 5,000/month
    Cost: Free → $29/month
  
  Logs:
    Platform: LogTail (Better Stack)
    Retention: 1GB/month
    Cost: Free → $5/month

Payments:
  Platform: Stripe
  Features:
    - Subscriptions
    - Webhook handling
  Cost: 2.9% + $0.30 per transaction
4.2 Environment Configuration
bash# .env.local (Frontend - Next.js & React Native)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mapbox (for web maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Meilisearch
NEXT_PUBLIC_MEILISEARCH_URL=https://your-instance.meilisearch.io
NEXT_PUBLIC_MEILISEARCH_KEY=your-search-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Environment
NEXT_PUBLIC_ENV=development
bash# .env (Backend - Railway/Render - if using custom backend)

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Database (direct connection if needed)
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

# Upstash Redis
UPSTASH_REDIS_URL=https://your-instance.upstash.io
UPSTASH_REDIS_TOKEN=your-token

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Meilisearch
MEILISEARCH_URL=https://your-instance.meilisearch.io
MEILISEARCH_MASTER_KEY=your-master-key

# Firebase
FIREBASE_SERVER_KEY=your-server-key

# Resend
RESEND_API_KEY=re_...

# Sentry
SENTRY_DSN=https://...@sentry.io/...

# App
PORT=3001
NODE_ENV=production
4.3 Deployment Steps
1. Deploy Database (Supabase)
bash# Create project on Supabase dashboard
# Run migrations
npx supabase db push

# Enable PostGIS
# Run in Supabase SQL editor:
CREATE EXTENSION IF NOT EXISTS postgis;

# Set up storage buckets
npx supabase storage create profile-photos --public
npx supabase storage create certifications --public
npx supabase storage create resumes --private
2. Deploy Web App (Vercel)
bash# Install Vercel CLI
npm i -g vercel

# Deploy
cd web-app
vercel --prod

# Or connect GitHub repo in Vercel dashboard for auto-deploy
3. Set Up Cloudflare R2
bash# Create R2 bucket via Cloudflare dashboard
# Generate API tokens
# Configure CORS for your domains
4. Deploy Custom Backend (Railway - Optional)
bash# Install Railway CLI
npm i -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy
railway up

# Or connect GitHub repo for auto-deploy
5. Set Up Meilisearch Cloud
bash# Create project on Meilisearch Cloud
# Get API keys
# Configure indexes via API or SDK

# Create jobs index
curl -X POST 'https://your-instance.meilisearch.io/indexes' \
  -H 'Authorization: Bearer your-master-key' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "uid": "jobs",
    "primaryKey": "id"
  }'

# Configure filterable attributes
curl -X PATCH 'https://your-instance.meilisearch.io/indexes/jobs/settings' \
  -H 'Authorization: Bearer your-master-key' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "filterableAttributes": ["job_type", "trade_category", "status"],
    "sortableAttributes": ["created_at", "_geoPoint"]
  }'
6. Build Mobile Apps (Expo EAS)
bash# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
7. Set Up Monitoring
bash# Sentry
npx @sentry/wizard -i reactNative
npx @sentry/wizard -i nextjs

# Configure Sentry DSN in environment variables
4.4 CI/CD Pipeline
yaml# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
  
  deploy-web:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
  
  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  build-mobile:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build iOS
        run: eas build --platform ios --non-interactive --no-wait
      
      - name: Build Android
        run: eas build --platform android --non-interactive --no-wait

PHASE 5: POST-LAUNCH MONITORING & SCALING
5.1 Key Metrics to Track
User Metrics:

Daily/Monthly Active Users
User registration rate
User retention (Day 1, 7, 30)
Premium conversion rate
Churn rate

Engagement Metrics:

Jobs posted per day
Applications submitted per day
Messages sent per day
Average session duration
Jobs filled rate
Day labor utilization

Business Metrics:

Monthly Recurring Revenue (MRR)
Customer Acquisition Cost (CAC)
Lifetime Value (LTV)
Premium subscriber count
Average time to hire

Technical Metrics:

API response times
Error rates (Sentry)
Database query performance
Real-time connection stability
Push notification delivery rate
Search query performance

5.2 Monitoring Dashboard Setup
javascript// PostHog Analytics Integration
import posthog from 'posthog-react-native'

// Initialize
posthog.setup('YOUR_API_KEY', {
  host: 'https://app.posthog.com'
})

// Track events
posthog.capture('job_posted', {
  job_type: 'standard',
  trade_category: 'carpentry',
  pay_rate: 25
})

posthog.capture('application_submitted', {
  is_priority: false,
  distance_miles: 15.3
})

// Track user properties
posthog.identify(userId, {
  email: user.email,
  user_type: 'worker',
  is_premium: false
})
```

### **5.3 Cost Scaling Plan**

**Growth Stages:**
```
Stage 1: MVP (0-100 users)
├─ Supabase: Free
├─ Vercel: Free
├─ Railway/Render: Free ($5 credit)
├─ Cloudflare R2: Free
├─ Meilisearch: Free
├─ Upstash Redis: Free
├─ Other services: Free
└─ Total: $0/month

Stage 2: Early Growth (100-1,000 users)
├─ Supabase: Free → $25/month (Pro)
├─ Vercel: Free
├─ Railway: $5-20/month
├─ Cloudflare R2: Free
├─ Meilisearch: Free
├─ Upstash: Free → $10/month
├─ Monitoring: Free tiers
└─ Total: $40-55/month

Stage 3: Growth (1,000-10,000 users)
├─ Supabase: $25-100/month
├─ Vercel: Free → $20/month
├─ Railway: $20-50/month
├─ Cloudflare R2: $5-15/month
├─ Meilisearch: $30-100/month
├─ Upstash: $10-30/month
├─ Monitoring: $40-80/month
└─ Total: $150-395/month

Stage 4: Scale (10,000+ users)
├─ Supabase: $100-500/month
├─ Vercel: $20-150/month
├─ Railway → AWS/DO: $200-1000/month
├─ Cloudflare R2: $15-100/month
├─ Meilisearch: $100-500/month
├─ Upstash: $30-200/month
├─ Monitoring: $80-200/month
└─ Total: $545-2,650/month
```

**When to Upgrade:**

1. **Supabase Free → Pro ($25/month)**
   - Database > 500MB
   - Need more than 2 real-time connections
   - Need daily backups
   - Want to remove auto-pause

2. **Railway Free → Paid ($5+/month)**
   - Exceed $5 monthly credit
   - Need 24/7 uptime (no sleep)
   - Need more resources

3. **Meilisearch Free → Paid ($30/month)**
   - More than 100k documents
   - More than 10k searches/month
   - Need better performance

4. **Consider AWS/DigitalOcean Migration (at ~50k users)**
   - Better pricing at scale
   - More control
   - Advanced features
   - Cost: $500-2,000/month

---

## **ESTIMATED TIMELINE & RESOURCES**

**Total Development Time: 20 weeks (5 months)**

**Team Composition:**
- 2 Frontend Developers (React Native + React)
- 1-2 Backend Developers (Node.js/Supabase)
- 1 UI/UX Designer
- 1 QA Engineer
- 1 Product Manager/Project Lead

**Revised Cost Estimates:**

**Development Phase (Months 1-5):**
- Development Team: $35,000-50,000/month
- Infrastructure: $0-50/month (free tiers)
- Design Tools: $50-100/month
- **Total Monthly: $35,050-50,150**

**Post-Launch (Month 6+):**
- Maintenance Team (50% capacity): $17,500-25,000/month
- Infrastructure: 
  - 0-1k users: $0-40/month
  - 1k-10k users: $150-400/month
  - 10k+ users: $550-2,650/month
- Marketing: $2,000-10,000/month
- Customer Support: $3,000-8,000/month
- **Total Monthly: $22,650-45,650**

**Year 1 Total Cost Breakdown:**
```
Development (5 months): $175,250-250,750
Operations (7 months @ low scale): $158,550-319,550
Total Year 1: $333,800-570,300

Infrastructure savings vs AWS Year 1: $3,000-7,000

ADDITIONAL CONSIDERATIONS
Security Best Practices

Supabase Security:

Row Level Security (RLS) enforced on all tables
Service role key only on backend (never in frontend)
Regular security audits
Enable email confirmation
Rate limiting on auth endpoints


File Upload Security:

Validate file types and sizes
Scan for malware (Cloudflare can help)
Use signed URLs for private files
Set proper storage bucket policies


API Security:

Use Upstash for rate limiting
Implement request validation
Sanitize all user inputs
Use HTTPS only
Implement CORS properly



Performance Optimization

Database:

Use Supabase database functions for complex queries
Implement proper indexes
Cache frequently accessed data in Upstash
Use connection pooling


Frontend:

Code splitting in Next.js
Lazy load images with ImageKit
Implement virtual lists for long feeds
Cache API responses locally
Use React Native's performance tools


Real-time:

Limit real-time subscriptions
Unsubscribe when components unmount
Batch notifications
Use presence heartbeats efficiently



Backup & Disaster Recovery

Supabase Backups:

Automatic daily backups (Pro tier)
Point-in-time recovery
Export database periodically


File Backups:

Cloudflare R2 has built-in redundancy
Consider cross-region backup for critical files


Application State:

Document all configurations
Version control for all code
Document deployment procedures



Legal Compliance

Privacy Policy (GDPR, CCPA compliant)
Terms of Service
Cookie consent (if applicable)
Data retention policies
Right to deletion implementation
Age verification (18+ requirement)


LAUNCH CHECKLIST
Pre-Launch (2 weeks before):

 All features tested and working
 Performance testing completed
 Security audit passed
 Legal documents prepared
 Support email/system set up
 Analytics tracking implemented
 App Store listings prepared
 Landing page ready
 Social media accounts created
 Press kit prepared

Launch Week:

 Final testing on production
 Monitor error rates closely
 Submit apps to stores
 Announce on social media
 Reach out to construction forums/groups
 Monitor user feedback
 Quick bug fixes as needed
 Respond to reviews

Post-Launch (First Month):

 Daily monitoring of metrics
 Gather user feedback
 Fix critical bugs immediately
 Plan feature improvements
 Optimize based on usage patterns
 Begin marketing campaigns
 Start building community