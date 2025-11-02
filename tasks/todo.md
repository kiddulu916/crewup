# CrewUp Implementation Plan

## Overview
This plan outlines the implementation of CrewUp, a mobile-first employment platform for the construction industry. The project will be built using React Native (Expo) for mobile, Next.js for web, and Supabase as the backend infrastructure.

**Estimated Timeline:** 20 weeks (5 months)
**Target:** MVP with core features, ready for beta testing

---

## Phase 1: Foundation & Setup (Weeks 1-2) ✅ COMPLETED

### 1.1 Project Initialization ✅
- [x] Initialize React Native Expo project
- [x] Initialize Next.js web project
- [x] Set up monorepo structure (if needed) or separate repos - *Using separate repos*
- [x] Configure TypeScript for both projects
- [x] Set up ESLint and Prettier
- [x] Create Git repository and configure .gitignore
- [ ] Set up GitHub repository - *Manual step for user*

### 1.2 Backend Infrastructure Setup 📝
- [ ] Create Supabase project - *Manual step - see SUPABASE_SETUP.md*
- [ ] Enable PostGIS extension in Supabase - *Manual step - see SUPABASE_SETUP.md*
- [ ] Run database schema migrations (all tables) - *Manual step - see SUPABASE_SETUP.md*
- [ ] Configure Row Level Security (RLS) policies - *Included in migrations*
- [ ] Set up Supabase Auth configuration - *Manual step - see SUPABASE_SETUP.md*
- [ ] Create storage buckets (profile-photos, certifications, resumes) - *Manual step - see SUPABASE_SETUP.md*
- [ ] Configure Resend for email notifications - *Will be done in Phase 7*
- [ ] Set up environment variables (.env files) - *Manual step - see SUPABASE_SETUP.md*

### 1.3 Design System Implementation ✅
- [x] Define color palette constants (#FF6B35, #2C3E50, #FFC107, etc.)
- [x] Configure typography (Roboto Bold, Open Sans)
- [x] Create base theme configuration
- [ ] Build reusable UI components: - *Next phase*
  - [ ] Button component (primary, secondary, outline)
  - [ ] Card component
  - [ ] Input field component
  - [ ] Bottom navigation component
  - [ ] Header component
  - [ ] Loading skeleton component

### 1.4 State Management & Navigation ✅
- [x] Set up Redux Toolkit store structure
- [x] Create auth slice (login, register, logout states)
- [ ] Configure React Navigation (mobile) - *Next phase*
  - [ ] Create Stack Navigator
  - [ ] Create Bottom Tab Navigator
  - [ ] Create Auth Navigator
- [ ] Configure Next.js App Router (web) - *Already configured by Next.js*
- [ ] Install and configure Supabase client - *Next phase*

### 1.5 Testing Setup
- [ ] Install testing libraries (Jest, React Testing Library) - *Will be done as needed*
- [ ] Configure test environment
- [ ] Write initial smoke tests
- [ ] Set up test database configuration

---

## Phase 2: Authentication & User Management (Weeks 3-4)

### 2.1 Authentication Screens
- [ ] Build Login screen (mobile + web)
- [ ] Build Registration screen (mobile + web)
- [ ] Build Role Selection screen (Worker/Employer)
- [ ] Implement form validation (email, password, phone)
- [ ] Add loading and error states
- [ ] Implement "Forgot Password" flow

### 2.2 Authentication Logic
- [ ] Create Supabase auth service layer
- [ ] Implement sign up with email/password
- [ ] Implement sign in with email/password
- [ ] Implement sign out
- [ ] Implement session management
- [ ] Add auth state persistence (AsyncStorage/LocalStorage)
- [ ] Create protected route guards
- [ ] Handle email verification flow

### 2.3 Profile Creation Flow
- [ ] Create profile creation screen (basic info)
- [ ] Implement profile creation for workers
- [ ] Implement profile creation for employers
- [ ] Add profile type selection logic
- [ ] Create profiles table records after auth signup

### 2.4 Testing
- [ ] Test registration flow end-to-end
- [ ] Test login flow end-to-end
- [ ] Test session persistence
- [ ] Test RLS policies for profiles table
- [ ] Test logout functionality

---

## Phase 3: Worker Profile & Geolocation (Weeks 5-6)

### 3.1 Worker Profile UI
- [ ] Build worker profile view screen
- [ ] Build worker profile edit screen
- [ ] Create profile photo upload component (Expo Image Picker)
- [ ] Build skills selection interface (multi-select)
- [ ] Build experience level dropdown
- [ ] Build work history form (add multiple entries)
- [ ] Build certifications upload flow (camera + gallery)
- [ ] Build resume upload component
- [ ] Create profile completion progress indicator

### 3.2 Geolocation Features
- [ ] Request location permissions (mobile)
- [ ] Implement getUserLocation function
- [ ] Build map location picker component (React Native Maps)
- [ ] Build work radius slider (50-200 miles)
- [ ] Add address search/autocomplete
- [ ] Store location as PostGIS GEOGRAPHY type
- [ ] Create availability calendar component

### 3.3 Backend Operations
- [ ] Create worker profile CRUD operations
- [ ] Implement file upload to Supabase Storage
- [ ] Set up Cloudflare R2 for large files (resumes)
- [ ] Create skills management endpoints
- [ ] Create certifications CRUD operations
- [ ] Create work history CRUD operations
- [ ] Test geospatial queries (jobs_within_radius)

### 3.4 Testing
- [ ] Test profile photo upload
- [ ] Test certification upload
- [ ] Test resume upload
- [ ] Test geolocation accuracy
- [ ] Test work radius calculations
- [ ] Test profile CRUD operations
- [ ] Integration test for profile completion flow

---

## Phase 4: Employer Profile & Job Posting (Weeks 7-8)

### 4.1 Employer Profile UI
- [ ] Build employer profile view screen
- [ ] Build employer profile edit screen
- [ ] Create company logo upload component
- [ ] Build company info form (name, size, type)
- [ ] Build license/insurance verification section
- [ ] Create service radius configuration
- [ ] Add primary location map picker

### 4.2 Job Posting UI
- [ ] Build job posting form screen
- [ ] Create job type toggle (Standard/Day Labor)
- [ ] Build job title and description inputs
- [ ] Create trade/skills multi-select
- [ ] Build pay type selector (Hourly/Salary/Per Project)
- [ ] Create pay range slider
- [ ] Add job location picker (map)
- [ ] Build start date picker
- [ ] Create duration estimate input
- [ ] Add certification requirements selector
- [ ] Implement job preview functionality

### 4.3 Job Management UI
- [ ] Build job management dashboard
- [ ] Create job list with tabs (Active/Filled/Drafts/Closed)
- [ ] Add edit job functionality
- [ ] Add pause/close job functionality
- [ ] Show applicant count per job
- [ ] Create quick view applicants modal

### 4.4 Backend Operations
- [ ] Create employer profile CRUD operations
- [ ] Create job posting CRUD operations
- [ ] Implement job filtering logic
- [ ] Set up job geofencing queries
- [ ] Create job expiration Edge Function (Supabase)
- [ ] Set up Meilisearch Cloud account
- [ ] Implement job indexing in Meilisearch
- [ ] Create job status management logic

### 4.5 Testing
- [ ] Test job posting flow end-to-end
- [ ] Test geofenced job search
- [ ] Test Meilisearch indexing
- [ ] Test job edit/delete functionality
- [ ] Test job status transitions

---

## Phase 5: Job Discovery & Applications (Weeks 9-10)

### 5.1 Job Feed UI (Worker)
- [ ] Build job feed screen with infinite scroll
- [ ] Create JobCard component
- [ ] Implement job filters (trade, pay, distance)
- [ ] Build search bar with debouncing
- [ ] Add tab switcher (All Jobs/Day Labor/Saved)
- [ ] Create job detail view screen
- [ ] Add distance display from user location
- [ ] Implement pull-to-refresh
- [ ] Build saved jobs functionality

### 5.2 Day Labor Section
- [ ] Build Day Labor dedicated screen
- [ ] Create map view for day labor jobs
- [ ] Add toggle between map and list view
- [ ] Implement time filters (Today/Tomorrow/This Week)
- [ ] Add urgent jobs badge (posted <2 hours ago)
- [ ] Create quick apply functionality

### 5.3 Application Flow
- [ ] Build application form screen
- [ ] Create cover letter input
- [ ] Add quick apply (one-tap)
- [ ] Build "My Applications" screen
- [ ] Create application status filters (Pending/Viewed/Accepted/Rejected)
- [ ] Add withdraw application functionality
- [ ] Create "Message Employer" button

### 5.4 Backend Operations
- [ ] Optimize job listing queries with indexes
- [ ] Implement advanced filtering logic
- [ ] Create day labor specific queries
- [ ] Create application CRUD operations
- [ ] Implement application status management
- [ ] Create saved jobs operations
- [ ] Set up application notifications (email)
- [ ] Track application views for employers

### 5.5 Testing
- [ ] Test job search and filters
- [ ] Test infinite scroll performance
- [ ] Test application submission flow
- [ ] Test saved jobs functionality
- [ ] Test day labor filtering
- [ ] Integration test for full job discovery flow

---

## Phase 6: Real-time Messaging (Weeks 11-12)

### 6.1 Messaging UI
- [ ] Build conversation list screen
- [ ] Create ConversationCard component
- [ ] Build message thread screen
- [ ] Create MessageBubble component
- [ ] Add message input component
- [ ] Implement typing indicators
- [ ] Add online status indicators
- [ ] Create message read receipts UI
- [ ] Add job context in header

### 6.2 Real-time Implementation
- [ ] Set up Supabase Realtime channels
- [ ] Implement subscribeToConversation function
- [ ] Add real-time message delivery
- [ ] Implement typing indicator with Upstash Redis
- [ ] Add online presence tracking
- [ ] Handle offline message queue
- [ ] Implement message read status tracking

### 6.3 Push Notifications
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Configure FCM in Expo app
- [ ] Implement push notification permissions
- [ ] Create notification triggers (new message, application update)
- [ ] Handle notification taps (deep linking)
- [ ] Add notification badge counts

### 6.4 Backend Operations
- [ ] Set up Upstash Redis for presence
- [ ] Create conversation CRUD operations
- [ ] Implement message storage
- [ ] Create notification triggers
- [ ] Implement push notification sending
- [ ] Create email notifications for offline users

### 6.5 Testing
- [ ] Test real-time message delivery
- [ ] Test typing indicators
- [ ] Test online/offline status
- [ ] Test push notifications
- [ ] Test offline message queue
- [ ] Test notification delivery across platforms

---

## Phase 7: Premium Features & Payments (Weeks 13-14)

### 7.1 Premium UI
- [ ] Build premium upgrade modal
- [ ] Create feature comparison table
- [ ] Add subscription options (monthly/yearly)
- [ ] Build subscription management screen
- [ ] Create profile views tracker (worker premium)
- [ ] Build priority application UI
- [ ] Create recommendation view (employer premium)
- [ ] Add premium badges throughout app

### 7.2 Stripe Integration
- [ ] Set up Stripe account
- [ ] Create subscription products in Stripe dashboard
- [ ] Implement Stripe Checkout (mobile)
- [ ] Implement Stripe Checkout (web)
- [ ] Build subscription management portal
- [ ] Add payment method management

### 7.3 Premium Features Backend
- [ ] Create profile view tracking
- [ ] Deploy recommendation Edge Function to Supabase
- [ ] Implement worker recommendation algorithm
- [ ] Implement application priority logic
- [ ] Set up Stripe webhook handler (Railway/Render)
- [ ] Create subscription status checks
- [ ] Add premium feature access guards

### 7.4 Testing
- [ ] Test Stripe Checkout flow (test mode)
- [ ] Test subscription lifecycle (create, renew, cancel)
- [ ] Test premium feature access
- [ ] Test webhook handling
- [ ] Test recommendation algorithm accuracy

---

## Phase 8: Reviews & Ratings (Weeks 15-16)

### 8.1 Reviews UI
- [ ] Build review submission form
- [ ] Create star rating component
- [ ] Build review list view
- [ ] Create ReviewCard component
- [ ] Add review moderation indicators
- [ ] Implement rating averages display

### 8.2 Backend Operations
- [ ] Create review CRUD operations
- [ ] Implement rating calculation triggers
- [ ] Update profile ratings automatically
- [ ] Create review moderation system
- [ ] Create review notifications

### 8.3 Testing
- [ ] Test review submission
- [ ] Test rating calculation
- [ ] Test review moderation workflow
- [ ] Test rating updates on profiles

---

## Phase 9: Search & Optimization (Weeks 17-18)

### 9.1 Advanced Search
- [ ] Integrate Meilisearch client (mobile + web)
- [ ] Implement advanced search UI
- [ ] Add search filters (trade, location, pay, experience)
- [ ] Create search history (premium feature)
- [ ] Implement typo-tolerant search
- [ ] Add geo-search in Meilisearch

### 9.2 Performance Optimization
- [ ] Optimize bundle size (web)
- [ ] Implement code splitting (Next.js)
- [ ] Add loading skeletons
- [ ] Optimize images with ImageKit or next/image
- [ ] Set up Upstash Redis caching
- [ ] Implement query result caching
- [ ] Add database indexes for slow queries
- [ ] Optimize geospatial queries

### 9.3 Testing
- [ ] Performance testing (Lighthouse)
- [ ] Load testing (database)
- [ ] Search functionality tests
- [ ] Cache hit rate monitoring

---

## Phase 10: Polish & Testing (Weeks 19-20)

### 10.1 UI/UX Polish
- [ ] Polish animations and transitions
- [ ] Add error boundaries
- [ ] Implement offline mode handling
- [ ] Create app icon and splash screens
- [ ] Deep linking setup
- [ ] Accessibility audit (A11y)
- [ ] Cross-device testing

### 10.2 Analytics & Monitoring
- [ ] Set up PostHog or Mixpanel
- [ ] Implement event tracking (job_posted, application_submitted, etc.)
- [ ] Set up Sentry for error monitoring
- [ ] Configure LogTail for logging
- [ ] Set up API rate limiting (Upstash)
- [ ] Create monitoring dashboard

### 10.3 Security & Compliance
- [ ] Security audit
- [ ] Implement request validation
- [ ] Sanitize all user inputs
- [ ] Configure CORS properly
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Implement cookie consent (web)
- [ ] Add age verification (18+)

### 10.4 Deployment Preparation
- [ ] Set up Vercel for web app
- [ ] Configure EAS Build for mobile apps
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Create staging environment
- [ ] Database backup strategy
- [ ] Create deployment documentation

### 10.5 Testing
- [ ] End-to-end testing (Detox for mobile)
- [ ] Cross-browser testing (web)
- [ ] Security penetration testing
- [ ] Beta user testing
- [ ] Bug fixes from testing

---

## Phase 11: Beta Launch (Week 21)

### 11.1 Deployment
- [ ] Deploy web app to Vercel
- [ ] Build mobile apps with EAS (iOS + Android)
- [ ] Submit to TestFlight (iOS)
- [ ] Submit to Google Play Beta (Android)
- [ ] Set up production environment variables
- [ ] Configure production database

### 11.2 Launch Activities
- [ ] Internal beta testing
- [ ] Monitor Sentry for errors
- [ ] Gather crash reports
- [ ] Monitor analytics
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Iterate based on feedback

### 11.3 Marketing Preparation
- [ ] Create landing page
- [ ] Prepare App Store listings
- [ ] Create social media accounts
- [ ] Prepare press kit
- [ ] Set up support email/system

---

## Review Section

### Summary of Changes
*This section will be filled out after implementation is complete*

### Key Decisions Made
*Document any significant architectural or design decisions here*

### Challenges Encountered
*Document any major challenges and how they were resolved*

### Performance Metrics
*Document performance metrics after optimization*

### Next Steps
*Document future features and improvements*
