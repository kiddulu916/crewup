# Supabase Setup Guide

This guide walks you through setting up Supabase as the backend for CrewUp.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: CrewUp
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose closest to your target users
   - **Pricing Plan**: Start with Free tier
5. Click "Create new project"
6. Wait 2-3 minutes for the project to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the "Settings" icon (gear)
2. Navigate to "API" in the left sidebar
3. You'll need two keys:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon/public key**: This is safe to use in the browser/mobile app

4. Save these values - you'll need them for the `.env` files

## Step 3: Enable PostGIS Extension

PostGIS is required for geolocation features (finding jobs/workers within a radius).

1. In your Supabase dashboard, click "Database" in the left sidebar
2. Click "Extensions"
3. Search for "postgis"
4. Click "Enable" next to `postgis`

## Step 4: Run Database Migrations

Copy the entire database schema from `/design.md` (lines 257-929) and execute it:

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy and paste the SQL schema from design.md starting with:
   ```sql
   -- Enable PostGIS extension
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
4. Click "Run" to execute the schema
5. Verify all tables were created in Database > Tables

### Tables Created:
- profiles
- worker_profiles
- employer_profiles
- skills
- worker_skills
- certifications
- work_history
- jobs
- applications
- profile_views
- conversations
- messages
- reviews
- subscriptions
- saved_jobs
- notifications

## Step 5: Set Up Storage Buckets

Create storage buckets for file uploads:

1. Click "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Create three buckets:

### Bucket 1: profile-photos
- Name: `profile-photos`
- Public: ✅ Yes
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg,image/png,image/webp`

### Bucket 2: certifications
- Name: `certifications`
- Public: ✅ Yes (workers' certs should be visible)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg,image/png,application/pdf`

### Bucket 3: resumes
- Name: `resumes`
- Public: ❌ No (private)
- File size limit: 5 MB
- Allowed MIME types: `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Step 6: Configure Authentication

1. Click "Authentication" in the left sidebar
2. Click "Providers"
3. Enable Email provider (already enabled by default)
4. Configure email templates (optional but recommended):
   - Click "Email Templates"
   - Customize "Confirm signup" email
   - Customize "Reset password" email

### Auth Settings:
- Enable "Confirm email" (recommended for production)
- Set "Site URL": Will be your app's URL (e.g., `https://crewup.com`)
- Set "Redirect URLs": Add your app's deep link URLs

## Step 7: Set Up Row Level Security Policies

Row Level Security (RLS) is automatically set up by the SQL schema. Verify it's enabled:

1. Go to "Database" > "Tables"
2. Click on any table (e.g., `profiles`)
3. Click the "RLS" tab
4. Ensure "Enable RLS" is toggled ON
5. You should see policies like "Users can view their own profile"

## Step 8: Configure CORS (for Web App)

1. Go to "Settings" > "API"
2. Under "CORS Configuration", add your domains:
   - Development: `http://localhost:3000`
   - Production: Your deployed web app URL (e.g., `https://crewup.com`)

## Step 9: Set Up Environment Variables

Create `.env.local` files in both mobile and web projects:

### Mobile (`/mobile/.env.local`):
```bash
EXPO_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Web (`/web/.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Note**: Never commit these files to Git! They're already in `.gitignore`.

## Step 10: Install Supabase Client Libraries

These will be installed in a later step when we set up the Supabase client, but for reference:

### Mobile:
```bash
cd mobile
npm install @supabase/supabase-js
```

### Web:
```bash
cd web
npm install @supabase/supabase-js @supabase/ssr
```

## Step 11: Verify Setup

Test your connection by running this simple query in SQL Editor:

```sql
SELECT * FROM profiles LIMIT 1;
```

If it returns an empty result (no error), your database is set up correctly!

## Optional: Set Up Realtime

Realtime is enabled by default for all tables. To verify:

1. Go to "Database" > "Replication"
2. Make sure the following tables have replication enabled:
   - messages
   - conversations
   - notifications

## Troubleshooting

### Issue: PostGIS extension not found
**Solution**: Make sure you enabled it in Step 3. Some regions might not support PostGIS - try recreating project in a different region.

### Issue: RLS policies blocking queries
**Solution**: Check that you're authenticated when testing. The policies are designed to only allow access to authenticated users' own data.

### Issue: Storage bucket access denied
**Solution**: Double-check bucket policies. Public buckets should allow reads by everyone, private buckets only by authenticated users.

## Next Steps

Once Supabase is configured, you can proceed to implement:
1. Authentication flow
2. User profile creation
3. Job posting and discovery
4. Real-time messaging

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
