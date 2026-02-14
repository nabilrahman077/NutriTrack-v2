# Feature Ticket Template

**IMPORTANT**: Every feature task in NutriTrack v2 must follow this template. Copy this template and fill it out completely before starting work.

## Goal

**Clear, one-sentence objective**: What is this feature trying to achieve?

Example: "Allow users to add a new diary entry (meal or snack) with food items and calories."

---

## In Scope / Out of Scope

### In Scope
- What is explicitly included in this ticket
- Be specific about features, screens, and functionality

### Out of Scope
- What is explicitly NOT included (even if related)
- Future enhancements that should be separate tickets
- Edge cases that will be handled later

**Example**:
- **In Scope**: Add diary entry form with food items, calories, and timestamp
- **Out of Scope**: Food database search, barcode scanning, meal templates

---

## Files Allowed to Change

**Explicit list of files that may be modified or created**. This prevents scope creep and accidental changes.

### Files to Create
- `src/features/diary/screens/AddDiaryEntryScreen.tsx`
- `src/features/diary/services/diaryService.ts`
- `src/features/diary/types.ts`
- `src/__tests__/features/diary/diaryService.test.ts`

### Files to Modify
- `src/navigation/AppNavigator.tsx` (add route)
- `src/services/firestore/diaryService.ts` (if exists)

### Files NOT to Change
- `src/config/firebase.ts` (unless explicitly needed)
- Other feature modules (unless explicitly needed)

---

## Acceptance Criteria

**All criteria must be met for the feature to be considered complete.**

### Functional Requirements
- [ ] User can [specific action]
- [ ] System validates [specific validation]
- [ ] Data is saved to Firestore at path `users/{uid}/diaryEntries/{entryId}`
- [ ] Data includes `createdAt` and `updatedAt` server timestamps

### UI States (REQUIRED)
Every screen must implement these states:

- [ ] **Loading state**: Shows spinner/skeleton while fetching data
  - Example: "Loading diary entries..."
  
- [ ] **Empty state**: Shows message when no data exists
  - Example: "No diary entries yet. Tap + to add your first entry."
  
- [ ] **Error state**: Shows error message when operations fail
  - Example: "Failed to load diary entries. Please try again."
  - Must include retry action if applicable

- [ ] **Success state**: Confirmation when operations succeed (if applicable)
  - Example: "Diary entry added successfully"

### Offline Behavior
- [ ] Feature works offline (for core flows)
- [ ] Data syncs automatically when connection is restored
- [ ] User sees appropriate feedback (sync status indicator)

### Edge Cases
- [ ] Handles network errors gracefully
- [ ] Handles validation errors (show clear messages)
- [ ] Handles Firestore permission errors
- [ ] Handles empty/null data gracefully

---

## Offline Behavior Requirements

**Detailed description of how the feature must work offline.**

### What Must Work Offline
- User can [specific offline action]
- Data is [cached/queued] and syncs when online
- User sees [specific feedback] about offline state

### What Happens When Online
- Queued operations sync automatically
- User sees sync status indicator update
- Data appears in real-time via Firestore listeners

### Example
- **Offline**: User can add diary entry. Entry is saved locally and queued for sync.
- **Online**: Entry syncs automatically. User sees "Synced" status indicator.
- **Error**: If sync fails, show error message with retry option.

---

## Analytics Events (Optional)

**If analytics are implemented, list events to track.**

- `diary_entry_added` - When user adds a diary entry
  - Properties: `entry_type` (meal/snack), `food_items_count`, `total_calories`
- `diary_entry_error` - When adding entry fails
  - Properties: `error_code`, `error_message`

---

## Tests Required

**Minimum testing requirements for this feature.**

### Unit Tests (Required)
- [ ] Test [core function/service] with valid input
- [ ] Test [core function/service] with invalid input
- [ ] Test [core function/service] error handling
- **Files**: `src/__tests__/features/[feature]/[service].test.ts`

### Integration Tests (If Applicable)
- [ ] Test [feature] integration with Firestore
- [ ] Test [feature] offline behavior
- **Files**: `src/__tests__/features/[feature]/[feature].integration.test.ts`

### E2E Tests (For Critical Flows)
- [ ] E2E test: User can [critical user flow]
- **Files**: `e2e/[feature].e2e.ts`

### Test Coverage
- Core logic: Minimum 80% coverage
- Critical flows: 100% coverage (E2E tests)

---

## Verification Steps

**Clear steps for manually verifying the feature works correctly.**

### Setup
1. Ensure Firebase is configured and environment variables are set
2. Build custom dev client (EAS build or local build)
3. Install app on device/simulator

### Happy Path
1. [Step-by-step instructions to test the feature]
2. Expected result: [What should happen]

### Offline Testing
1. Enable airplane mode or disable network
2. [Test offline functionality]
3. Re-enable network
4. Verify data syncs automatically
5. Expected result: [What should happen]

### Error Scenarios
1. [Test error scenario 1]
   - Expected: [Error message/behavior]
2. [Test error scenario 2]
   - Expected: [Error message/behavior]

### UI States
1. **Loading**: [How to trigger loading state]
   - Expected: [Loading UI appears]
2. **Empty**: [How to trigger empty state]
   - Expected: [Empty state UI appears]
3. **Error**: [How to trigger error state]
   - Expected: [Error state UI appears]

### Example Verification Steps
1. Open app and navigate to Diary tab
2. Tap "+" button to add new entry
3. Fill in form: type="meal", food items, calories
4. Tap "Save"
5. **Expected**: Entry appears in list, "Synced" indicator shows, entry saved to Firestore
6. **Offline**: Enable airplane mode, add another entry
7. **Expected**: Entry appears in list, "Offline" indicator shows
8. Disable airplane mode
9. **Expected**: Entry syncs, "Synced" indicator shows

---

## Rollback Plan (If Applicable)

**If this feature could break existing functionality, describe how to rollback.**

### When Rollback is Needed
- Feature causes app crashes
- Feature breaks existing functionality
- Feature causes data loss or corruption

### Rollback Steps
1. Revert commit: `git revert [commit-hash]`
2. Rebuild and redeploy app
3. Verify existing functionality still works
4. Document issues for future fix

### Prevention
- Feature is behind feature flag (if applicable)
- Feature is additive (doesn't modify existing code)
- Feature has comprehensive tests

---

## Additional Notes

**Any additional context, constraints, or considerations.**

- Dependencies: List any new dependencies (must be approved)
- Breaking changes: List any breaking changes (should be avoided)
- Migration needed: If data migration is required
- Performance considerations: Any performance implications

---

## References

- [Project Rules](../.cursor/rules/project-rules.mdc) - Hard rules for all changes
- [V2 Blueprint](V2_BLUEPRINT.md) - Architecture and data model
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Documentation](https://rnfirebase.io/)

---

## Checklist Before Starting

- [ ] Ticket follows this template completely
- [ ] All sections are filled out
- [ ] Files allowed to change are explicitly listed
- [ ] Acceptance criteria are specific and testable
- [ ] Offline behavior is clearly defined
- [ ] Verification steps are detailed
- [ ] Reviewed [Project Rules](../.cursor/rules/project-rules.mdc)
- [ ] Reviewed [V2 Blueprint](V2_BLUEPRINT.md)

---

## Implementation Notes

**Use this section during implementation to track progress and decisions.**

- [ ] Implementation started
- [ ] Core functionality complete
- [ ] UI states implemented (loading/empty/error)
- [ ] Offline behavior tested
- [ ] Tests written and passing
- [ ] Verification steps completed
- [ ] Ready for review
