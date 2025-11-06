# Phase 5 Setup & Testing Guide

## Quick Start Checklist

- [ ] Create Supabase project
- [ ] Get API credentials
- [ ] Run database migrations
- [ ] Configure .env.local
- [ ] Restart Expo
- [ ] Test worker flow
- [ ] Test employer flow
- [ ] Test real-time updates

---

## Part 1: Supabase Setup (10 minutes)

### 1.1 Create Project
1. Go to https://supabase.com
2. Sign in → Click **"New Project"**
3. Configure:
   - Name: `CrewUp`
   - Database Password: [SAVE THIS!]
   - Region: Choose nearest
   - Plan: Free
4. Click **"Create new project"** → Wait 2-3 minutes

### 1.2 Get API Keys
1. Click **Settings** ⚙️ → **API**
2. Copy and save:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long `eyJ...` string

---

## Part 2: Run Database Migrations

### 2.1 Enable PostGIS
1. **Database** → **Extensions**
2. Search "postgis" → **Enable**

### 2.2 Run Base Schema
1. **SQL Editor** → **"New query"**
2. Open `design.md` → Copy **lines 259-928**
3. Paste into SQL Editor → **RUN**

### 2.3 ~~Run Applications Migration~~ **SKIP THIS STEP!**

**The applications table already exists in the base schema - no additional migration needed!**

The table was created when you ran the base schema in step 2.2.

~~1. **SQL Editor** → **"New query"**~~
~~2. Copy this SQL:~~

```sql
-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn')),
  cover_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_worker_id ON applications(worker_id);
CREATE INDEX idx_applications_status ON applications(status);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = worker_id);

CREATE POLICY "Workers can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can withdraw applications"
  ON applications FOR UPDATE
  USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id AND status = 'withdrawn');

CREATE POLICY "Employers can view job applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update job applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

3. **RUN** → Should see "Success"

### 2.4 Verify Tables
**Database** → **Tables** → Should see:
- ✓ profiles
- ✓ jobs
- ✓ applications (NEW!)
- ✓ worker_profiles, employer_profiles, etc.

---

## Part 3: Configure Mobile App

### 3.1 Edit Environment File
```bash
# Open the file
nano /home/dat1k/CrewUp/mobile/.env.local
```

Replace with your credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

### 3.2 Restart Expo
```bash
# Stop expo (Ctrl+C)
# Or kill: kill <PID>

# Restart
cd /home/dat1k/CrewUp/mobile
npx expo start
```

---

## Part 4: Create Test Data

### 4.1 Create Test Users
In Supabase: **Authentication** → **Users** → **Add User**

**Employer Account:**
- Email: `employer@test.com`
- Password: `Test123!`
- Copy the User ID (UUID)

**Worker Account:**
- Email: `worker@test.com`
- Password: `Test123!`

### 4.2 Create Test Job
**SQL Editor** → Run:

```sql
-- Replace EMPLOYER_USER_ID with actual UUID from step 4.1
INSERT INTO employer_profiles (
  user_id,
  company_name,
  business_type
) VALUES (
  'EMPLOYER_USER_ID',
  'Test Construction Co',
  'General Contractor'
);

-- Create test job
INSERT INTO jobs (
  employer_id,
  job_type,
  title,
  description,
  pay_rate_min,
  pay_rate_max,
  workers_needed,
  status,
  location_address
) VALUES (
  'EMPLOYER_USER_ID',
  'standard',
  'Construction Worker Needed',
  'Looking for experienced worker for residential project.',
  25.00,
  35.00,
  2,
  'active',
  '123 Main St, City, State'
);
```

---

## Part 5: Test Complete Flow

### 5.1 Test Worker Flow

1. **Register/Login**
   - Open app → Tap "Login"
   - Email: `worker@test.com`
   - Password: `Test123!`

2. **Browse Jobs**
   - Should see "Jobs" tab
   - Test job should appear
   - Tap to view details

3. **Apply to Job**
   - Tap "Apply Now"
   - Add cover message (optional)
   - Submit → Status = "PENDING"

4. **View Applications**
   - Tap "Applications" tab
   - Should see your application

### 5.2 Test Employer Flow

1. **Login as Employer**
   - Logout → Login with `employer@test.com`

2. **View Applicants**
   - Go to Job Management
   - Tap job → "View Applicants"
   - Should see worker's application

3. **Update Status**
   - Tap "Accept" or "Reject"
   - Status updates

### 5.3 Test Real-time Updates

1. Open 2 devices/windows
2. **Device 1**: Login as worker
3. **Device 2**: Login as employer
4. **Employer**: Update application status
5. **Worker**: Should see update immediately! ⚡

---

## Troubleshooting

### "Failed to load jobs"
- Check `.env.local` has correct URL and key
- Verify `jobs` table has `status = 'active'`
- Run: `SELECT * FROM jobs WHERE status = 'active';`

### "Failed to apply"
- Make sure logged in as worker
- Check applications table exists
- Verify RLS policies enabled

### "Cannot see applicants"
- Login as employer who created the job
- RLS policies filter by job ownership

### Expo not loading
- Restart Expo after changing .env.local
- Clear cache: `npx expo start -c`
- Check Supabase keys are correct

---

## What You Should See

✅ **Worker can:**
- Browse jobs with search
- View job details
- Apply with cover message
- Track applications
- Withdraw applications

✅ **Employer can:**
- View applicants for their jobs
- See worker details
- Update status (review/accept/reject)

✅ **Real-time:**
- Status changes appear instantly
- No page refresh needed

---

## Next Steps

After successful testing:
1. Review Phase 5 implementation in `tasks/todo.md`
2. Consider enhancements:
   - PostGIS distance calculation
   - Applicant count badges
   - Email notifications
3. Move to Phase 6: Messaging System

---

## Need Help?

Check:
- `/home/dat1k/CrewUp/SUPABASE_SETUP.md` - Full Supabase guide
- `/home/dat1k/CrewUp/tasks/todo.md` - Phase 5 implementation details
- Supabase Docs: https://supabase.com/docs
