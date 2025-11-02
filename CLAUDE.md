# CrewUp App

## Project Overview

A mobile-first employment platform targeting the construction industry, connecting workers with employers through geofenced job matching, real-time messaging, and premium recommendation features.

---

## Tech Stack

### Frontend
- **Mobile**: React Native with Expo
- **Web**: Next.js 14+ (App Router)
- **State Management**: Redux Toolkit
- **UI Framework**: React Native Paper (mobile), Tailwind CSS (web)
- **Maps**: React Native Maps (mobile), Leaflet (web)
- **Real-time**: Supabase Realtime Client

### Backend
- **Database**: Supabase PostgreSQL with PostGIS extension
- **Authentication**: Supabase Auth (JWT)
- **Real-time**: Supabase Realtime
- **File Storage**: Supabase Storage + Cloudflare R2
- **Search**: Meilisearch Cloud
- **Caching**: Upstash Redis
- **Payments**: Stripe API
- **Notifications**: Firebase Cloud Messaging
- **Email**: Resend

### Hosting
- **Mobile Apps**: Expo EAS (build & deploy)
- **Web App**: Vercel
- **Database**: Supabase (free tier → Pro at scale)

## Project Structure

### Mobile App (React Native)

```text
crewup-mobile/
├── App.tsx
├── app.json
├── package.json
├── src/
    ├── navigation/
    │   ├── AppNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── WorkerNavigator.tsx
    │   └── EmployerNavigator.tsx
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   ├── RegisterScreen.tsx
    │   │   └── RoleSelectionScreen.tsx
    │   ├── worker/
    │   │   ├── HomeScreen.tsx
    │   │   ├── JobDetailScreen.tsx
    │   │   ├── DayLaborScreen.tsx
    │   │   ├── ProfileScreen.tsx
    │   │   ├── ApplicationsScreen.tsx
    │   │   └── MessagesScreen.tsx
    │   └── employer/
    │       ├── HomeScreen.tsx
    │       ├── PostJobScreen.tsx
    │       ├── JobManagementScreen.tsx
    │       ├── ApplicantsScreen.tsx
    │       └── SearchWorkersScreen.tsx
    ├── components/
    │   ├── JobCard.tsx
    │   ├── WorkerCard.tsx
    │   ├── MessageBubble.tsx
    │   ├── MapView.tsx
    │   └── PremiumBadge.tsx
    ├── store/
    │   ├── store.ts
    │   ├── slices/
    │   │   ├── authSlice.ts
    │   │   ├── jobsSlice.ts
    │   │   ├── profileSlice.ts
    │   │   └── messagesSlice.ts
    ├── services/
    │   ├── supabase.ts
    │   ├── api.ts
    │   ├── location.ts
    │   ├── notifications.ts
    │   └── stripe.ts
    ├── utils/
    │   ├── validation.ts
    │   ├── formatters.ts
    │   └── constants.ts
    └── types/
        └── index.ts
```

### Web App (Next.js)

```text
crewup-web/
├── package.json
├── next.config.js
├── tailwind.config.js
├── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (worker)/
    │   │   ├── jobs/page.tsx
    │   │   ├── profile/page.tsx
    │   │   └── applications/page.tsx
    │   └── (employer)/
    │       ├── dashboard/page.tsx
    │       ├── post-job/page.tsx
    │       └── applicants/page.tsx
    ├── components/
    │   ├── JobCard.tsx
    │   ├── WorkerCard.tsx
    │   ├── Map.tsx
    │   └── Header.tsx
    ├── lib/
    │   ├── supabase.ts
    │   └── utils.ts
    └── types/
        └── index.ts
```

## Rules

### Before Coding

- Ask clarifying questions before jumping into implementation
- Draft and confirm your approach for complex work
- List pros/cons when multiple approaches exist
- Research and plan first

### While Coding

- Follow TDD: write stub → write failing test → implement
- Use existing domain vocabulary for consistency
- Prefer simple, composable, testable functions over classes
- Avoid extracting functions unless they'll be reused or improve testability
- Minimize comments - rely on self-explanatory code

### Testing

- Separate pure-logic unit tests from database-touching integration tests
- Prefer integration tests over heavy mocking
- Test entire structures in one assertion when possible
- Always verify tests can actually fail for real defects

### Tooling

- Always run linters and type checkers before committing
- Use formatters (like Prettier) on all new code
- Set up pre-commit hooks to enforce quality gates
