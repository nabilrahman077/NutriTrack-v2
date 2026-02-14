# NutriTrack v2 - Architecture Blueprint

This document defines the architecture, tech stack, data model, and development standards for NutriTrack v2.

## Tech Stack

### Core Platform
- **Mobile-first**: Expo (React Native) - latest stable version
- **Web companion**: React Native Web (shared codebase) - to be implemented later
- **Language**: TypeScript with strict mode enabled
- **Build**: Custom dev client / EAS Build required (Expo Go cannot be used due to native Firebase SDK)

### Firebase Services
- **Firebase SDK**: React Native Firebase (native SDK)
  - `@react-native-firebase/app` - Core Firebase
  - `@react-native-firebase/auth` - Authentication
  - `@react-native-firebase/firestore` - Database
- **Authentication**: Firebase Auth (single system, no fallbacks)
- **Database**: Firestore with offline persistence enabled
- **Why native SDK**: Reliable offline persistence on mobile requires native modules

### Additional Libraries
- **Navigation**: React Navigation (Stack + Tab navigators)
- **State Management**: To be determined (recommend Zustand or React Context)
- **UI Library**: To be determined (recommend React Native Paper or NativeBase)

### Environment Configuration
- Environment variables must be validated at runtime
- Missing required variables must show a clear error screen (do not silently fail)
- Store config in `src/config/env.ts` with validation logic

## Authentication Approach

### Firebase Auth Setup
- Use Firebase Auth as the single authentication system
- No Supabase, no backend fallbacks, no multiple auth providers
- Auth state persistence handled automatically by Firebase SDK

### Session Handling
- Firebase Auth automatically persists sessions across app restarts
- On app launch:
  1. Check `auth().currentUser` or use `onAuthStateChanged` listener
  2. Show loading screen while checking auth state
  3. Route based on auth state (see Routing Strategy below)

### Secure Storage
- Firebase Auth tokens are stored securely by the native SDK
- No manual token storage required
- Session restoration happens automatically on app launch

### Auth Flow
1. User opens app → Check auth state
2. If unauthenticated → Show auth screens (Login, Signup, Forgot Password)
3. If authenticated → Show main app
4. On logout → Clear auth state → Route to auth screens

## Data Model

### Firestore Structure

All user data is scoped under `users/{uid}/` to ensure proper security and isolation.

#### User Profile
```
users/{uid}/profile
  - displayName: string
  - email: string
  - photoURL: string | null
  - createdAt: Timestamp (server timestamp)
  - updatedAt: Timestamp (server timestamp)
```

#### Diary Entries
```
users/{uid}/diaryEntries/{entryId}
  - type: 'meal' | 'snack'
  - foodItems: Array<{
      name: string
      calories: number
      protein?: number
      carbs?: number
      fat?: number
    }>
  - totalCalories: number
  - timestamp: Timestamp
  - notes?: string
  - createdAt: Timestamp (server timestamp)
  - updatedAt: Timestamp (server timestamp)
```

#### Workouts
```
users/{uid}/workouts/{workoutId}
  - name: string
  - exercises: Array<{
      name: string
      sets?: number
      reps?: number
      duration?: number (minutes)
      weight?: number
    }>
  - totalDuration: number (minutes)
  - caloriesBurned?: number
  - timestamp: Timestamp
  - notes?: string
  - createdAt: Timestamp (server timestamp)
  - updatedAt: Timestamp (server timestamp)
```

#### Settings
```
users/{uid}/settings
  - dailyCalorieGoal?: number
  - dailyProteinGoal?: number
  - weeklyWorkoutGoal?: number
  - units: 'metric' | 'imperial'
  - notificationsEnabled: boolean
  - createdAt: Timestamp (server timestamp)
  - updatedAt: Timestamp (server timestamp)
```

### Timestamp Requirements
- All documents must include `createdAt` and `updatedAt` fields
- Use Firestore server timestamps (`serverTimestamp()`) where possible
- Client-side timestamps are acceptable as fallback, but server timestamps are preferred

## Offline + Sync Strategy

### Firestore Offline Persistence
- **Offline persistence is enabled by default** in React Native Firebase on iOS/Android
- No configuration needed - Firestore automatically caches data locally and syncs when online
- No manual sync queue required - Firestore handles this automatically
- Note: The `firestore().settings({ persistence: true })` pattern is for the web SDK, not React Native Firebase

### What Works Offline
- **Read operations**: All queries serve from local cache when offline
- **Write operations**: All writes are queued and automatically synced when connection is restored
- **All CRUD operations**: Create, Read, Update, Delete all work offline
- **Example flow**: User can add a diary entry offline, it will sync automatically when online

### Conflict Resolution
- **Strategy**: Firestore default "last-write-wins"
- **How it works**: Server timestamps (`updatedAt`) determine which write wins
- **For v2 MVP**: Accept this default behavior. More sophisticated conflict resolution can be added later if needed.

### Sync Status Monitoring
- Monitor Firestore connection state using `onSnapshot` with metadata
- Connection states:
  - `waiting` → "Syncing" (yellow indicator)
  - `online` → "Synced" (green indicator)
  - `offline` → "Offline" (red/gray indicator)
- UI must display sync status indicator on relevant screens (at minimum: main app screens)

### Network Detection
- Use Firestore's `onSnapshot` metadata to detect offline state
- Example: `onSnapshot(query, { includeMetadataChanges: true }, (snapshot) => { const isOffline = snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites; })`
- Alternatively, use `@react-native-community/netinfo` for general network state

## Routing Strategy

### Auth Gate Pattern
The app uses an auth gate pattern where the root navigator checks authentication state and routes accordingly.

#### Root Navigator Structure
```
RootNavigator (checks auth state)
  ├─ AuthNavigator (if unauthenticated)
  │   ├─ LoginScreen
  │   ├─ SignupScreen
  │   └─ ForgotPasswordScreen
  │
  └─ AppNavigator (if authenticated)
      └─ TabNavigator
          ├─ DiaryTab
          ├─ WorkoutsTab
          └─ ProfileTab
```

#### Implementation
1. **RootNavigator.tsx**: 
   - Listens to `onAuthStateChanged`
   - Shows loading screen while checking auth state
   - Renders `AuthNavigator` or `AppNavigator` based on auth state

2. **AuthNavigator.tsx**:
   - Stack navigator with Login, Signup, Forgot Password screens
   - No tabs, simple stack flow

3. **AppNavigator.tsx**:
   - Tab navigator for main app features
   - Each tab can have its own stack navigator if needed

### Session Restoration
- Firebase Auth automatically restores sessions
- On app launch:
  1. Show splash/loading screen
  2. Check `auth().currentUser` (synchronous check)
  3. If user exists, route to AppNavigator
  4. If no user, route to AuthNavigator
  5. Set up `onAuthStateChanged` listener for future changes

## Folder Structure

```
src/
  features/              # Feature-based modules (each feature is self-contained)
    auth/                # Authentication feature
      screens/           # Auth screens (Login, Signup, ForgotPassword)
      components/        # Auth-specific components
      hooks/             # Auth-specific hooks (useAuth, etc.)
      types.ts           # Auth-specific types
    diary/               # Diary entries feature
      screens/           # Diary screens (List, Add, Edit, Detail)
      components/        # Diary-specific components
      hooks/             # Diary-specific hooks
      services/          # Diary Firestore operations
      types.ts           # Diary-specific types
    workouts/            # Workouts feature
      screens/           # Workout screens (List, Add, Edit, Detail)
      components/        # Workout-specific components
      hooks/             # Workout-specific hooks
      services/          # Workout Firestore operations
      types.ts           # Workout-specific types
    profile/             # Profile/settings feature
      screens/           # Profile and settings screens
      components/        # Profile-specific components
      hooks/             # Profile-specific hooks
      services/          # Profile Firestore operations
      types.ts           # Profile-specific types

  shared/                # Shared code across features
    components/          # Reusable UI components
      LoadingSpinner.tsx
      ErrorMessage.tsx
      EmptyState.tsx
      SyncStatusIndicator.tsx
      Button.tsx
      Input.tsx
      # ... other shared components
    hooks/                 # Custom React hooks
      useFirestoreQuery.ts
      useSyncStatus.ts
      useNetworkStatus.ts
      # ... other shared hooks
    utils/               # Utility functions
      dateUtils.ts
      validationUtils.ts
      formatters.ts
      # ... other utilities

  services/              # Firebase service wrappers
    auth/                # Auth service
      authService.ts     # Wrapper around Firebase Auth
    firestore/           # Firestore services
      diaryService.ts    # Diary Firestore operations
      workoutService.ts  # Workout Firestore operations
      profileService.ts  # Profile Firestore operations
      settingsService.ts # Settings Firestore operations
    sync/                # Sync status monitoring
      syncStatusService.ts # Monitor Firestore connection state

  types/                 # Global TypeScript definitions
    firestore.ts         # Firestore document types
    navigation.ts        # Navigation types
    index.ts            # Re-export all types

  navigation/            # Navigation configuration
    AuthNavigator.tsx    # Auth stack navigator
    AppNavigator.tsx     # Main app tab navigator
    RootNavigator.tsx    # Root navigator with auth gate
    types.ts            # Navigation param types

  config/                # Configuration
    firebase.ts          # Firebase initialization and setup
    env.ts               # Environment variable validation
    constants.ts         # App constants

  App.tsx                # Root component
```

### Module Boundaries
- **Features**: Self-contained modules with screens, components, hooks, services, and types
- **Shared**: Code used across multiple features (components, hooks, utils)
- **Services**: Firebase service wrappers (keep Firebase logic isolated)
- **Types**: Global type definitions
- **Navigation**: All navigation configuration in one place
- **Config**: App-wide configuration (Firebase, env, constants)

## Firestore Security Rules

### High-Level Approach
All user data is scoped under `users/{uid}/` to ensure users can only access their own data.

### Security Rules Structure
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User-scoped data: users can only access their own data
    match /users/{userId}/{document=**} {
      // Ensure user is authenticated
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Specific rules for each collection (more granular control if needed)
    match /users/{userId}/profile {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/diaryEntries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/workouts/{workoutId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId}/settings {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Key Principles
- **User isolation**: Users can only read/write data under their own `users/{uid}/` path
- **Authentication required**: All operations require `request.auth != null`
- **UID validation**: Ensure `request.auth.uid == userId` for user-scoped paths
- **No public access**: All data is private to the user who owns it

## Definition of Done (DoD)

Every feature in NutriTrack v2 must meet these criteria before being considered complete:

### Functional Requirements
- [ ] Feature works as specified in the ticket
- [ ] All acceptance criteria are met
- [ ] Feature works offline (for core flows like adding diary entries)
- [ ] Feature syncs correctly when connection is restored

### UI Requirements
- [ ] Loading state implemented (shows while fetching data)
- [ ] Empty state implemented (shows when no data exists)
- [ ] Error state implemented (shows when operations fail)
- [ ] Sync status indicator visible (if applicable)
- [ ] UI is responsive and handles edge cases

### Code Quality
- [ ] TypeScript strict mode passes (no `any` types unless justified)
- [ ] Code follows project folder structure
- [ ] Small, reviewable diff (no giant refactors)
- [ ] No new dependencies added without approval

### Testing
- [ ] Unit tests for core logic (minimum requirement)
- [ ] E2E smoke tests for critical flows (if applicable)
- [ ] Tests pass in CI/CD
- [ ] Manual testing completed

### Documentation
- [ ] Verification steps documented (how to test the feature)
- [ ] Offline behavior documented (how to test offline)
- [ ] Error scenarios documented (how to test error states)

### Firebase Integration
- [ ] Firestore security rules updated (if new collections/paths added)
- [ ] Environment variables validated (if new ones added)
- [ ] Firebase initialization handles errors gracefully

## Development Workflow

### Before Starting Work
1. Read the feature ticket (must follow [FEATURE_TICKET_TEMPLATE.md](FEATURE_TICKET_TEMPLATE.md))
2. Review [.cursor/rules](../.cursor/rules/project-rules.mdc) for hard rules
3. Understand the data model and folder structure

### During Development
1. Follow the folder structure (features, shared, services, etc.)
2. Implement loading/empty/error states
3. Ensure offline functionality works
4. Write tests as you go
5. Keep diffs small and reviewable

### Before Submitting
1. Verify all DoD criteria are met
2. Test offline behavior
3. Test error scenarios
4. Run tests and ensure they pass
5. Document verification steps

## References

- [Project Rules](../.cursor/rules/project-rules.mdc) - Hard rules for all changes
- [Feature Ticket Template](FEATURE_TICKET_TEMPLATE.md) - Required format for all tickets
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Documentation](https://rnfirebase.io/)
