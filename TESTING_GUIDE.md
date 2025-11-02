# CrewUp Testing Guide - Phase 3

## Server Status
✅ **Expo Development Server**: Running on port 8081
✅ **Supabase**: Configured and connected

## How to Connect to the App

### Option 1: Expo Go App (Easiest)
1. Install "Expo Go" from App Store (iOS) or Google Play (Android)
2. Open Expo Go app
3. In another terminal, run: `cd /home/dat1k/CrewUp/mobile && npx expo start`
4. Scan the QR code that appears with your device

### Option 2: iOS Simulator (Mac only)
1. Press `i` in the Expo terminal
2. App will launch in iOS Simulator

### Option 3: Android Emulator
1. Start Android emulator
2. Press `a` in the Expo terminal
3. App will launch in Android emulator

### Option 4: Web Browser
1. Press `w` in the Expo terminal
2. App will open in your default browser (note: some features may not work on web)

---

## Testing Checklist

### 1. Authentication Flow ✅

#### Test Registration
1. Launch the app - should see Login screen
2. Tap "Create Account" or "Register"
3. Enter test credentials:
   - Email: `test-worker@example.com`
   - Password: `Test123!` (must have uppercase, lowercase, number)
4. Tap "Register"
5. **Expected**: Should navigate to Role Selection screen

**Troubleshooting**:
- If you get "Email already exists" error, use a different email or login with existing credentials
- Check Supabase Dashboard → Authentication → Users to verify user was created

---

### 2. Role Selection ✅

#### Test Worker Role Selection
1. On Role Selection screen, you should see two cards: Worker 👷 and Employer 🏗️
2. Tap on the "Worker" card
3. Should see checkmark ✓ appear on selected card
4. Tap "Continue" button
5. **Expected**: Should navigate to Worker Profile Form screen

**What to check**:
- Primary Orange color (#FF6B35) highlights selected role
- "Employer" option shows "Coming Soon" alert (Phase 4)

---

### 3. Worker Profile Creation ✅

#### Test Basic Profile Form
1. You should see "Create Your Worker Profile" title
2. Fill in the form:

   **Profile Photo** (tap the camera icon):
   - Tap "Choose from Library" or "Take Photo"
   - Select/take a photo
   - **Expected**: Photo appears in circular preview

   **Basic Info**:
   - First Name: `John`
   - Last Name: `Doe`
   - Primary Trade: Select "Carpenter" from dropdown
   - Experience Level: Select "Intermediate (2-5 years)"
   - Years of Experience: `5`

   **Bio** (optional):
   - Enter: `Experienced carpenter specializing in framing and finish work.`

   **Hourly Rate** (optional):
   - Min Rate: `35`
   - Max Rate: `55`

   **Work Radius**:
   - Select: `50 miles`

3. **Don't submit yet** - we'll add location first

**What to check**:
- Form validation: Try leaving First Name empty and submitting
- Rate validation: Try entering Max Rate lower than Min Rate
- All dropdowns open properly with modal overlays
- Photo picker shows both camera and library options

---

### 4. Location Picker with Maps ✅

#### Test Interactive Map Location Selection
1. On the Worker Profile Form, scroll down to "Work Location (Optional)"
2. Tap "Set Preferred Location" button
3. **Expected**: Navigate to Location Picker screen with interactive map

4. **Test Current Location**:
   - Tap the 📍 button in bottom-right of map
   - Grant location permissions if prompted
   - **Expected**: Map centers on your current location with marker

5. **Test Tap-to-Select**:
   - Tap anywhere on the map
   - **Expected**: Marker moves to tapped location
   - Coordinates display below map

6. **Test Navigation**:
   - Pinch to zoom in/out
   - Drag to pan around
   - **Expected**: Map responds smoothly

7. Tap "Confirm Location" button
8. **Expected**: Navigate back to Profile Form
9. **Expected**: "Change Location" button appears with coordinates displayed

**What to check**:
- Map loads (requires internet connection)
- Permission dialogs appear properly
- Marker is orange (#FF6B35) matching app theme
- Coordinates are in format: `Lat: XX.XXXX, Lng: -XX.XXXX`

---

### 5. Profile Submission ✅

#### Test Complete Profile Creation
1. With all profile fields filled and location set
2. Scroll down and tap "Create Profile" button
3. **Expected**:
   - Loading spinner appears on button
   - Photo uploads to Supabase Storage
   - Profile data saves to `worker_profiles` table
   - Location saves in PostGIS format
   - Success alert: "Your profile has been created!"
   - Navigate back to Role Selection (temporarily - will change in Phase 5)

**Verify in Supabase Dashboard**:
1. Go to Supabase Dashboard → Table Editor
2. Check `worker_profiles` table:
   - Should see new row with your data
   - `first_name`, `last_name`, `primary_trade`, etc. populated
   - `profile_photo_url` has Supabase storage URL
3. Check `preferred_work_location` column:
   - Should show PostGIS format: `0101000020E610000...` (binary)
   - Run query to see readable format:
     ```sql
     SELECT
       first_name,
       last_name,
       ST_AsText(preferred_work_location) as location
     FROM worker_profiles;
     ```
   - Should show: `POINT(-122.4324 37.78825)` or similar

**What to check**:
- No errors during submission
- Success alert appears
- Photo appears in Storage → profile-photos bucket
- All form data matches database record

---

### 6. Work History Form ✅

#### Test Adding Work History
**Note**: This feature requires navigating from a main profile view, which we haven't built yet. For now, you can test the form directly by uncommenting these lines in `AuthNavigator.tsx`:

1. Add a test navigation button to WorkerProfileForm (temporary):
   ```typescript
   // Add this button after location section
   <Button
     title="Test Work History"
     onPress={() => navigation.navigate('WorkHistoryForm', { workerId: 'test-id' })}
     variant="outline"
   />
   ```

2. Or test navigation manually using:
   ```typescript
   navigation.navigate('WorkHistoryForm', { workerId: data.id });
   ```

#### Test Form Functionality
1. Fill in work history:
   - Company Name: `ABC Construction`
   - Position Title: `Senior Carpenter`
   - Start Date: `2020-01-15`
   - Toggle "Currently working here": OFF
   - End Date: `2023-06-30`
   - Description: `Led framing crews on residential projects...`

2. Tap "Add Work History"
3. **Expected**:
   - Data saves to `work_history` table
   - Success alert appears
   - Navigate back

**Test "Currently Working" Toggle**:
1. Toggle ON: End Date field should disappear
2. Toggle OFF: End Date field should reappear

**Test Date Validation**:
1. Try invalid date format: `01/15/2020`
2. **Expected**: Error message: "Invalid date format. Use YYYY-MM-DD"

**Verify in Supabase**:
```sql
SELECT * FROM work_history ORDER BY created_at DESC LIMIT 5;
```

---

### 7. Certification Form ✅

#### Test Adding Certifications
Similar to Work History, you may need to test this by navigating manually or after building profile view in Phase 5.

1. Fill in certification:
   - Certification Name: `OSHA 30-Hour Construction`
   - Issuing Organization: `OSHA`
   - Issue Date: `2022-05-15`
   - Expiry Date: `2025-05-15`
   - Certification Number: `CERT-123456`

2. Tap "Add Certification"
3. **Expected**:
   - Data saves to `certifications` table
   - `verified` field set to `false` (for admin verification later)
   - Success alert appears

**Test Optional Fields**:
1. Only fill in Certification Name
2. Leave all other fields empty
3. Should submit successfully

**Verify in Supabase**:
```sql
SELECT * FROM certifications ORDER BY created_at DESC LIMIT 5;
```

---

## Common Issues & Solutions

### Issue: "Network request failed" or "Unable to connect"
**Solution**:
- Check that Supabase URL and Anon Key are correct in `.env.local`
- Verify internet connection
- Check Supabase project status at dashboard.supabase.com

### Issue: "Location permissions denied"
**Solution**:
- iOS: Settings → Privacy → Location Services → Expo Go → Allow
- Android: Settings → Apps → Expo Go → Permissions → Location → Allow

### Issue: Map doesn't load
**Solution**:
- Check internet connection (maps require data)
- Android: Verify Google Maps API key is configured (future step)
- Try reloading the app

### Issue: Photo upload fails
**Solution**:
- Check Storage bucket "profile-photos" exists in Supabase
- Verify bucket is public or has correct RLS policies
- Check file size isn't too large (default limit: 50MB)

### Issue: "User not authenticated" error
**Solution**:
- Logout and login again
- Check that session is persisting in AsyncStorage
- Verify Redux store has user data

### Issue: Form validation not working
**Solution**:
- Check console logs for validation errors
- Verify all required fields are filled
- Check date formats match YYYY-MM-DD

---

## Testing Phase 3 Completion Criteria

✅ **Completed when**:
- [ ] User can register and select Worker role
- [ ] User can create complete profile with photo
- [ ] User can select location on interactive map
- [ ] Location saves in PostGIS format in database
- [ ] User can add work history entries
- [ ] User can add certifications
- [ ] All data appears correctly in Supabase tables
- [ ] No console errors during happy path
- [ ] Form validations work as expected
- [ ] Navigation flows smoothly between screens

---

## Next Steps After Testing

Once testing is complete:

### Phase 4: Employer Profile & Job Posting
- Build employer profile creation
- Create job posting form
- Implement job management dashboard
- Add Meilisearch for job search

### Phase 5: Job Discovery & Applications
- Build worker profile view/edit screens
- Create job discovery feed
- Implement job search and filters
- Build application flow

---

## Debugging Tips

### View Expo Logs
```bash
cd /home/dat1k/CrewUp/mobile && npx expo start
```
- All console.log statements appear in terminal
- Errors show with stack traces
- Network requests logged

### View Supabase Logs
1. Supabase Dashboard → Logs
2. See API requests, errors, slow queries
3. Real-time log streaming

### Check Redux State
Add to any component:
```typescript
const state = useAppSelector(state => state);
console.log('Redux State:', state);
```

### Check Network Requests
In Expo DevTools:
- Press `m` in terminal to open DevTools
- View Network tab for API calls
- See request/response bodies

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review console logs in Expo terminal
3. Check Supabase logs in dashboard
4. Verify database schema matches `SUPABASE_SETUP.md`
5. Check that all migrations ran successfully

Happy Testing! 🚀
