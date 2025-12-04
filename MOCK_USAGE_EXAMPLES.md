# Mock System Usage Examples

## Scenario 1: Daily Development

**Goal**: Work on frontend without running BFF

### Setup (One Time)

Create `.env` file:
```bash
REACT_APP_USE_MOCKS=true
```

### Start Development
```bash
npm start
```

That's it! The app now uses mock data for everything.

### What You Can Do
- ✅ View 12 agreements on dashboard
- ✅ Filter by status, type, client
- ✅ Create new agreements (they appear in list!)
- ✅ Edit agreements (changes persist in session)
- ✅ Delete agreements (they're removed)
- ✅ View details, products, terms
- ✅ Create modification requests
- ✅ Approve/reject requests

---

## Scenario 2: Testing Loading States

**Goal**: Verify spinners and loading indicators work

### In Browser Console
```javascript
// Add 2 second delay to all requests
mockConfig.enable(2000)
```

Now every GraphQL operation takes 2 seconds. You'll see:
- Loading spinners
- Skeleton screens
- Disabled buttons during operations

### Variable Delay
```javascript
// Random delay between 500ms and 2000ms
mockConfig.setDelay(Math.floor(Math.random() * 1500) + 500)
```

---

## Scenario 3: Testing Error Handling

**Goal**: Verify error messages and retry logic

### Random Errors
```javascript
// 20% of requests fail randomly
mockConfig.enableErrors(0.2)
```

Now 1 in 5 requests will fail. Test:
- Error messages display correctly
- Retry buttons work
- Error recovery flows

### Specific Operation Errors
```javascript
// Force agreement creation to always fail
mockConfig.setSpecificError(
  'createAgreement', 
  'Insufficient permissions to create agreements'
)

// Try to create an agreement → will fail with this message
```

### Multiple Specific Errors
```javascript
mockConfig.setSpecificError('createAgreement', 'Permission denied')
mockConfig.setSpecificError('deleteAgreement', 'Cannot delete active agreements')
mockConfig.setSpecificError('approveModificationRequest', 'Approval quota exceeded')
```

### Clear Errors
```javascript
mockConfig.clearSpecificError('createAgreement')
mockConfig.disableErrors()
```

---

## Scenario 4: Demo/Presentation

**Goal**: Show features without real backend

### Setup
```javascript
// Fast, reliable, realistic data
mockConfig.enable(0)  // No delay
mockConfig.disableErrors()  // No errors
```

### Demo Flow
1. **Dashboard**: Show 12 agreements with various statuses
2. **Create**: Walk through wizard with autocomplete working
3. **Details**: Show products, terms, documents
4. **Modify**: Create a modification request
5. **Approve**: Show approval workflow

Everything works perfectly with realistic data!

---

## Scenario 5: Integration Testing

**Goal**: Test multiple scenarios quickly

### Test Suite
```javascript
// 1. Normal operation
mockConfig.enable(0)
mockConfig.disableErrors()
// Run tests...

// 2. Slow network
mockConfig.setDelay(3000)
// Run tests...

// 3. Flaky network
mockConfig.enableErrors(0.1)
mockConfig.setDelay(1000)
// Run tests...

// 4. Specific failures
mockConfig.setSpecificError('createAgreement', 'Database locked')
// Run tests...
```

---

## Scenario 6: Working on Specific Feature

**Goal**: Work on create wizard without distractions

### Isolate Feature
```javascript
mockConfig.enable(0)  // Instant responses
```

Now you can:
- Iterate quickly on UI
- Test form validation
- Verify all steps work
- See results immediately

No waiting for network or backend!

---

## Scenario 7: Testing Edge Cases

**Goal**: Test with unusual data

### Access Mock Data
You can modify mock data temporarily:

```javascript
// In src/mocks/mockData.ts, add:
export const testEdgeCase = () => {
  // Add agreement with very long name
  mockAgreements.push({
    id: 'TEST1',
    agreementNumber: 'EDGE-001',
    clientName: 'A'.repeat(200),  // Very long name
    // ... rest of properties
  });
};

// Then in console:
import { testEdgeCase } from './mocks';
testEdgeCase();
```

Or directly modify arrays in mockData.ts.

---

## Scenario 8: Comparing Mock vs Real

**Goal**: Verify mock behavior matches real BFF

### Quick Toggle
```javascript
// Test with mocks
mockConfig.enable()
// Perform action...
// Note behavior

// Test with real BFF
mockConfig.disable()
// Perform same action...
// Compare behavior
```

---

## Scenario 9: Training New Developers

**Goal**: New team member needs to get started quickly

### Onboarding
```bash
# 1. Clone repo
git clone <repo>

# 2. Install
npm install

# 3. Enable mocks
echo "REACT_APP_USE_MOCKS=true" > .env

# 4. Start
npm start
```

New developer can:
- Explore all features immediately
- No backend setup needed
- No database configuration
- See realistic data right away

---

## Scenario 10: Bug Reproduction

**Goal**: Reproduce a bug with specific data

### Create Specific Scenario
```javascript
// In console or temporarily in mockData.ts

// Add agreement that triggers bug
mockAgreements.push({
  id: 'BUG1',
  agreementNumber: 'BUG-001',
  status: 'SUSPENDED',
  endDate: null,  // Missing end date
  // ... rest causing the bug
});

// Now navigate to that agreement to reproduce
```

---

## Scenario 11: Performance Testing

**Goal**: Test UI with lots of data

### Add More Records
Edit `mockData.ts`:
```typescript
// Generate 100 agreements
for (let i = 13; i <= 100; i++) {
  mockAgreements.push({
    id: `AGR${i.toString().padStart(3, '0')}`,
    agreementNumber: `WM-2024-${i.toString().padStart(3, '0')}`,
    // ... rest of properties
  });
}
```

Test:
- Pagination with 100 records
- Filter performance
- Sort performance
- Table rendering

---

## Scenario 12: Offline Development

**Goal**: Work on airplane/train without internet

### Setup Before Going Offline
```javascript
mockConfig.enable()
```

Now you can:
- Work completely offline
- No API calls needed
- Full functionality available
- Code and test normally

---

## Scenario 13: CI/CD Testing

**Goal**: Run tests in CI without real backend

### In Test Config
```javascript
// jest.config.js or test setup
process.env.REACT_APP_USE_MOCKS = 'true';
```

Or in GitHub Actions:
```yaml
- name: Run Tests
  env:
    REACT_APP_USE_MOCKS: true
  run: npm test
```

Tests run without real backend!

---

## Scenario 14: Documentation Screenshots

**Goal**: Generate screenshots with consistent data

### Setup
```javascript
mockConfig.enable(0)  // No delay
// Use provided mock data (always the same)
```

Take screenshots:
- Always same 12 agreements
- Consistent data across screenshots
- No surprises or changes
- Professional documentation

---

## Scenario 15: API Contract Validation

**Goal**: Ensure UI matches GraphQL schema

### Verify All Operations
Check that mockResolvers.ts implements:
- ✅ All queries from schema
- ✅ All mutations from schema
- ✅ Correct return types
- ✅ Proper filtering/pagination

If mock works, real API should too!

---

## Common Patterns

### Pattern: Toggle During Development
```javascript
// Morning: Work with mocks
mockConfig.enable()

// Afternoon: Test with real BFF
mockConfig.disable()

// Before commit: Final test with real
mockConfig.disable()
```

### Pattern: Different Team Members
```javascript
// Frontend developer
REACT_APP_USE_MOCKS=true

// Full-stack developer
REACT_APP_USE_MOCKS=false
```

### Pattern: Feature Branch
```bash
# Feature branch - use mocks
git checkout feature/new-wizard
echo "REACT_APP_USE_MOCKS=true" > .env

# Main branch - use real
git checkout main
echo "REACT_APP_USE_MOCKS=false" > .env
```

---

## Troubleshooting Examples

### Issue: Mocks Not Working
```javascript
// Check configuration
mockConfig.getCurrent()
// Should show useMocks: true

// Force enable
mockConfig.enable()

// Check console
// Should see: "🎭 Mocks Enabled"
```

### Issue: Seeing Old Data
```javascript
// Refresh page to reset mock data
location.reload()

// Or clear everything
localStorage.clear()
location.reload()
```

### Issue: Need Different Data
```javascript
// Edit src/mocks/mockData.ts
// Add/modify/remove records
// Save file
// Refresh browser
```

---

## Advanced Usage

### Custom Error Messages
```javascript
// Simulate specific backend errors
mockConfig.setSpecificError(
  'createAgreement',
  JSON.stringify({
    code: 'VALIDATION_ERROR',
    field: 'clientId',
    message: 'Client not found'
  })
)
```

### Rate Limiting Simulation
```javascript
// Simulate rate limiting
let requestCount = 0;
// In mockResolvers.ts, add:
if (++requestCount > 10) {
  throw new Error('Rate limit exceeded');
}
```

### Network Quality Simulation
```javascript
// Excellent (fast)
mockConfig.setDelay(0)

// Good (normal)
mockConfig.setDelay(200)

// Poor (slow)
mockConfig.setDelay(2000)

// Very Poor (very slow)
mockConfig.setDelay(5000)
mockConfig.enableErrors(0.15)
```

---

## Quick Reference

```javascript
// Start/Stop
mockConfig.enable()              // Start using mocks
mockConfig.disable()             // Use real BFF

// Configuration  
mockConfig.setDelay(ms)          // Set delay
mockConfig.enableErrors(rate)    // Random errors
mockConfig.setSpecificError(...) // Specific error
mockConfig.disableErrors()       // No errors

// Information
mockConfig.getCurrent()          // View config
mockConfig.help()                // Show help
```

---

## Remember

1. ✅ Mocks persist data **during session only**
2. ✅ Refresh page = reset to initial data
3. ✅ Configuration persists in localStorage
4. ✅ All CRUD operations work correctly
5. ✅ Toggle anytime without code changes
