# Phase 5: Job Discovery & Applications

## Overview
Implement job discovery feed for workers and application management system for both workers and employers.

## Features to Implement

### A. Job Discovery (Worker Side)
1. **Job Feed Screen**
   - Display active jobs in a scrollable feed
   - Location-based filtering (geofencing with work radius)
   - Pull-to-refresh functionality
   - Infinite scroll/pagination
   - Empty state UI

2. **Job Filters**
   - Filter by trade/skill
   - Filter by pay range
   - Filter by job type (standard/day labor)
   - Filter by distance from worker location
   - Sort options (newest, closest, highest pay)

3. **Job Detail View**
   - Full job information display
   - Employer info (company name, rating when available)
   - Distance from worker location
   - Apply button with status
   - Already applied state

### B. Application System
1. **Application Service**
   - Submit application (worker → job)
   - Withdraw application
   - Get applications by worker (with job details)
   - Get applications by job (employer view)
   - Update application status

2. **Worker Application Tracking**
   - My Applications screen
   - Filter by status (pending, reviewed, accepted, rejected)
   - Application cards with job info
   - Withdraw option for pending applications

3. **Employer Application Management**
   - View applicants for each job
   - Applicant list screen
   - Applicant detail view (worker profile)
   - Accept/Reject actions
   - Contact applicant button (prepare for messaging)

## Database Schema Updates

### Applications Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, reviewed, accepted, rejected, withdrawn
  cover_message TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_worker_id ON applications(worker_id);
CREATE INDEX idx_applications_status ON applications(status);
```

## Implementation Steps

### Step 1: Database & Types
- [ ] Create applications table in Supabase
- [ ] Add Application types to TypeScript
- [ ] Create application service

### Step 2: Job Discovery UI
- [ ] Create JobFeedScreen component
- [ ] Create JobFilterModal component
- [ ] Create JobDetailScreen component
- [ ] Update navigation with new screens

### Step 3: Application Features
- [ ] Implement apply to job functionality
- [ ] Create MyApplicationsScreen
- [ ] Create ApplicationCard component
- [ ] Implement withdraw application

### Step 4: Employer Application Management
- [ ] Update JobManagementDashboard to show applicant counts
- [ ] Create ApplicantListScreen
- [ ] Create ApplicantDetailScreen
- [ ] Implement accept/reject actions

### Step 5: Testing & Polish
- [ ] Test full application flow
- [ ] Test geofencing/distance calculations
- [ ] Add loading states
- [ ] Add error handling

## Files to Create/Modify

### New Files
- `src/services/applicationService.ts`
- `src/screens/worker/JobFeedScreen.tsx`
- `src/screens/worker/JobDetailScreen.tsx`
- `src/screens/worker/MyApplicationsScreen.tsx`
- `src/screens/employer/ApplicantListScreen.tsx`
- `src/screens/employer/ApplicantDetailScreen.tsx`
- `src/components/ApplicationCard.tsx`
- `src/components/JobFilterModal.tsx`

### Modified Files
- `src/types/profile.ts` (add Application types)
- `src/navigation/types.ts` (add new routes)
- `src/navigation/AuthNavigator.tsx` (register new screens)
- `src/screens/worker/index.ts` (export new screens)
- `src/screens/employer/index.ts` (export new screens)
- `src/screens/employer/JobManagementDashboard.tsx` (update to link to applicants)

## Success Criteria
- Workers can browse jobs filtered by location and preferences
- Workers can apply to jobs and track application status
- Employers can view applicants for their jobs
- Application status updates properly
- Distance calculations work correctly
- All screens handle loading/error states gracefully
