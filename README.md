# NutriTrack v2

Mobile-first nutrition and fitness tracking app built with Expo, React Native, and Firebase.

## Project Structure

```
src/
  features/          # Feature-based modules
    auth/            # Authentication screens
    diary/           # Diary entries
    workouts/        # Workout logs
    profile/         # Profile and settings
  shared/            # Shared components and utilities
  navigation/        # Navigation configuration
  config/            # App configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app (note: custom dev client required for Firebase)

## Development

### TypeScript

This project uses TypeScript with strict mode enabled. All code must pass strict type checking.

### Code Standards

See [.cursor/rules/project-rules.mdc](.cursor/rules/project-rules.mdc) for hard rules and [docs/V2_BLUEPRINT.md](docs/V2_BLUEPRINT.md) for architecture details.

## Verification Steps for Ticket #1

### 1. App Boots Successfully

1. Run `npm install` to install dependencies
2. Run `npm start` to start Expo
3. Press `i` (iOS) or `a` (Android) to launch simulator
4. **Expected**: App should boot without errors, show LoadingScreen briefly, then show Login screen

### 2. Navigation Works

1. From Login screen, navigate to Signup:
   - The app should allow navigation between Login and Signup screens
2. Change `isAuthenticated` to `true` in `src/navigation/RootNavigator.tsx` (line 30)
3. Restart the app
4. **Expected**: App should show tab navigator with Diary, Workouts, and Profile tabs
5. Navigate between tabs
6. **Expected**: All tabs should be accessible and show placeholder content

### 3. Config Error Screen

1. Modify `src/config/env.ts` to require a test variable:
   ```typescript
   if (!process.env.EXPO_PUBLIC_TEST_VAR) {
     missing.push('EXPO_PUBLIC_TEST_VAR');
   }
   ```
2. Restart the app
3. **Expected**: ConfigErrorScreen should appear showing the missing variable
4. The screen should display:
   - Error message
   - List of missing variables
   - Instructions on how to fix
   - Example .env file format

### 4. TypeScript Strict Mode

1. Run `npx tsc --noEmit` to check TypeScript
2. **Expected**: No TypeScript errors should be reported

### 5. Folder Structure

Verify the folder structure matches the blueprint:
- `src/features/` - Feature modules
- `src/shared/` - Shared components
- `src/navigation/` - Navigation config
- `src/config/` - Configuration

## Next Steps

- [ ] Add Firebase configuration
- [ ] Implement real authentication
- [ ] Add Firestore data models
- [ ] Implement diary entry features
- [ ] Implement workout features

## References

- [Project Rules](.cursor/rules/project-rules.mdc)
- [V2 Blueprint](docs/V2_BLUEPRINT.md)
- [Feature Ticket Template](docs/FEATURE_TICKET_TEMPLATE.md)
