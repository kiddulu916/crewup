# Schema Fix Summary

## What Happened

You got an error: `relation "applications" already exists`

This is because the applications table was already included in the **base schema** (`design.md` lines 259-928) that you ran in step 2.2. Our Phase 5 migration tried to create it again, causing the conflict.

## What Was Fixed

I updated the code to work with the **existing** applications table schema:

### Changes Made (6 files updated)

1. **`mobile/src/types/profile.ts`**
   - Updated ApplicationStatus to include: 'viewed', 'shortlisted'
   - Changed `cover_message` → `cover_letter`
   - Changed `created_at` → `applied_at`
   - Added fields: `is_priority`, `viewed_at`, `status_updated_at`

2. **`mobile/src/services/applicationService.ts`**
   - Updated to lookup `worker_profiles.id` first (not use `auth.uid()` directly)
   - Changed column names to match DB schema
   - Fixed all queries to use correct table relationships

3. **`mobile/src/screens/worker/JobDetailScreen.tsx`**
   - Changed `cover_message` → `cover_letter`

4. **`mobile/src/screens/worker/ApplicationsScreen.tsx`**
   - Changed `cover_message` → `cover_letter`
   - Changed `created_at` → `applied_at`

5. **`mobile/src/screens/employer/ApplicantsScreen.tsx`**
   - Changed `cover_message` → `cover_letter`
   - Changed `created_at` → `applied_at`

6. **`/home/dat1k/CrewUp/SETUP_AND_TEST.md`**
   - Marked step 2.3 as **SKIP** - no migration needed!

---

## What You Need To Do Now

### ✅ Step 1: Verify Base Schema is Loaded

Run this in Supabase SQL Editor:

```sql
-- Check applications table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'applications';

-- Should show these columns:
-- id, job_id, worker_id, status, cover_letter, is_priority,
-- applied_at, viewed_at, status_updated_at
```

### ✅ Step 2: Continue with Setup

Now follow the **updated** `SETUP_AND_TEST.md` guide:

1. **Part 3**: Configure `.env.local` with your Supabase credentials
2. **Part 4**: Create test users and jobs
3. **Part 5**: Test the complete flow!

**Important**: Skip step 2.3 (migration) - it's not needed!

---

## Schema Differences: Original vs. Existing

| Field | Our Phase 5 | Existing Schema |
|-------|-------------|-----------------|
| Status values | pending, reviewed, accepted, rejected, withdrawn | pending, **viewed, shortlisted**, accepted, rejected, withdrawn |
| Cover message | `cover_message` | `cover_letter` |
| Applied date | `created_at` | `applied_at` |
| Updated date | `updated_at` | `status_updated_at` |
| Priority | ❌ Not included | `is_priority` |
| Viewed timestamp | ❌ Not included | `viewed_at` |
| Worker reference | `profiles(id)` | `worker_profiles(id)` |

**The code now matches the existing schema!**

---

## Testing Checklist

After setup, verify these work:

- [ ] Worker can browse jobs (HomeScreen)
- [ ] Worker can apply to job with cover message
- [ ] Application appears in "Applications" tab
- [ ] Employer can view applicants
- [ ] Employer can update status (pending → viewed → accepted/rejected)
- [ ] Real-time updates work (status changes appear instantly)

---

## Still Getting Errors?

### "Worker profile not found"
- Make sure you completed worker profile setup after registration
- Check: `SELECT * FROM worker_profiles WHERE user_id = 'YOUR_USER_ID';`

### "Failed to load applications"
- Check `.env.local` has correct Supabase URL and key
- Verify RLS policies are enabled on applications table

### "Cannot join worker_profiles"
- Make sure base schema created worker_profiles table
- Check: `SELECT * FROM worker_profiles LIMIT 1;`

---

## Summary

✅ **Code updated to work with existing schema**
✅ **No migration needed**
✅ **All functionality preserved**
✅ **Ready to test!**

Follow the updated `SETUP_AND_TEST.md` guide (skipping step 2.3) and you're good to go! 🚀
