# Mock BFF System - User Guide

## 🎭 Overview

The frontend is now completely isolated from the BFF with a comprehensive mocking system. You can toggle between using real BFF calls or mock data at any time, without code changes.

## 📋 Features

- ✅ **30+ mock records** - Realistic agreements, clients, products, modification requests
- ✅ **Simulated behavior** - Mutations actually modify mock data (CRUD operations work)
- ✅ **Easy toggle** - Switch between mock/real with environment variable or at runtime
- ✅ **Instant responses** - No delay by default, configurable if needed
- ✅ **Error simulation** - Test error handling with configurable failure rates
- ✅ **Browser console API** - Control mocks directly from DevTools

## 🚀 Quick Start

### Method 1: Environment Variable (Development)

Create/edit `.env` file in the `agreement-ui` directory:

```bash
# Enable mocks
REACT_APP_USE_MOCKS=true

# Optional: Add delay in milliseconds
REACT_APP_MOCK_DELAY=0
```

Then restart your development server:
```bash
npm start
```

### Method 2: Runtime Toggle (Browser Console)

Open browser DevTools console and type:

```javascript
// Enable mocks (no delay)
mockConfig.enable()

// Enable mocks with 500ms delay (simulates network)
mockConfig.enable(500)

// Disable mocks (use real BFF)
mockConfig.disable()
```

The page will automatically reload to apply changes.

## 🎮 Browser Console API

When mocks are enabled, a `mockConfig` object is available in the console:

### Basic Commands

```javascript
// Show all available commands
mockConfig.help()

// Get current configuration
mockConfig.getCurrent()

// Enable/disable mocks
mockConfig.enable()           // Enable with no delay
mockConfig.enable(500)        // Enable with 500ms delay
mockConfig.disable()          // Disable (use real BFF)

// Set response delay
mockConfig.setDelay(300)      // 300ms delay
mockConfig.setDelay(0)        // No delay
```

### Error Simulation

```javascript
// Enable random errors (10% failure rate)
mockConfig.enableErrors(0.1)

// Higher failure rate (30%)
mockConfig.enableErrors(0.3)

// Disable error simulation
mockConfig.disableErrors()

// Force specific operation to always fail
mockConfig.setSpecificError('createAgreement', 'Unable to create agreement at this time')
mockConfig.setSpecificError('getAgreements', 'Database connection failed')

// Clear specific error
mockConfig.clearSpecificError('createAgreement')
```

## 📊 Mock Data

The system includes realistic mock data:

### Clients (10 clients)
- Individual clients (John Smith, Sarah Johnson, etc.)
- Corporate clients (Acme Corporation, TechStart Inc, etc.)
- All with complete contact information

### Agreements (12 agreements)
- Various statuses: ACTIVE, PENDING_APPROVAL, DRAFT, SUSPENDED, EXPIRED
- Different types: Wealth Management, Investment Advisory, Retirement Planning, etc.
- With products, terms, and documents
- Realistic amounts (75K - 500K CAD)

### Products (8 products)
- Wealth Management services
- Investment Advisory
- Tax Planning
- Estate Planning
- Retirement Planning
- Financial Planning
- Insurance Review

### Modification Requests (3 requests)
- PENDING, APPROVED, and REJECTED statuses
- Linked to actual agreements
- With change tracking

### Other Data
- 4 Asset Allocation Policies
- 3 Mock Accounts (RRSP, TFSA, Cash)
- 2 Household Members
- Program Fees structure
- Dashboard Statistics

## 🔧 How It Works

### Architecture

```
┌─────────────────┐
│  React App      │
└────────┬────────┘
         │
         ├─── Mock Enabled ───→ ┌──────────────┐
         │                      │  Mock Link   │
         │                      │  (Apollo)    │
         │                      └──────┬───────┘
         │                             │
         │                      ┌──────▼────────┐
         │                      │ Mock Resolvers│
         │                      │  & Mock Data  │
         │                      └───────────────┘
         │
         └─── Mock Disabled ──→ ┌──────────────┐
                                │  HTTP Link   │
                                │  (Apollo)    │
                                └──────┬───────┘
                                       │
                                ┌──────▼───────┐
                                │  Real BFF    │
                                │  (GraphQL)   │
                                └──────────────┘
```

### Key Components

1. **mockData.ts** - Contains all mock records
2. **mockResolvers.ts** - Implements GraphQL resolvers that actually modify data
3. **MockLink.ts** - Apollo Link that intercepts requests
4. **mockConfig.ts** - Configuration management and browser API
5. **apollo.ts** - Updated to choose between mock/real link

### Data Persistence

- Mock data is **in-memory only**
- Changes persist during the session
- Refreshing the page resets all mock data
- Configuration (toggle, delay, errors) persists in localStorage

## 📖 Usage Examples

### Example 1: Develop Without BFF

```javascript
// In browser console
mockConfig.enable()
```

Now you can:
- View agreements list (12 records available)
- Create new agreements (they'll appear in the list)
- Edit agreements (changes are reflected)
- Delete agreements (they're removed from mock data)
- Test all CRUD operations

### Example 2: Test Loading States

```javascript
// Add 2 second delay to all requests
mockConfig.enable(2000)
```

Now you'll see loading spinners and states.

### Example 3: Test Error Handling

```javascript
// 20% of requests will fail randomly
mockConfig.enableErrors(0.2)

// Force agreement creation to always fail
mockConfig.setSpecificError('createAgreement', 'Insufficient permissions')
```

### Example 4: Demo Mode

```javascript
// Quick responses with rich mock data
mockConfig.enable(0)
```

Perfect for demos where BFF isn't available.

### Example 5: Return to Real BFF

```javascript
// Switch back to real backend
mockConfig.disable()
```

## 🧪 Testing Scenarios

### Test All CRUD Operations

1. **Create**: Use the "Create Agreement" wizard
2. **Read**: View agreements list and details
3. **Update**: Modify an agreement or create modification request
4. **Delete**: Delete an agreement

All operations work with mocks enabled!

### Test Filters and Pagination

- Filter by status, type, client name
- Search by agreement number or description
- Paginate through results (mock has 12 agreements)
- Sort by different fields

### Test Error Recovery

```javascript
// Simulate occasional failures
mockConfig.enableErrors(0.15)
```

Verify that error messages display correctly and users can retry.

## 🎯 Production Notes

**The mock system is for development only:**

- Mocks are **automatically disabled** in production builds
- Environment variable `REACT_APP_USE_MOCKS` is ignored in production
- The `mockConfig` API is only available in development
- Mock files are included in the bundle but never executed in production

## 📁 File Structure

```
agreement-ui/src/
└── mocks/
    ├── index.ts           # Main export file
    ├── mockConfig.ts      # Configuration and browser API
    ├── mockData.ts        # All mock records (agreements, clients, etc.)
    ├── mockResolvers.ts   # GraphQL resolver implementations
    └── MockLink.ts        # Apollo Link for intercepting requests
```

## 🔍 Troubleshooting

### Mocks not working?

1. Check console - should see "🎭 Mocks Enabled"
2. Verify config: `mockConfig.getCurrent()`
3. Try: `mockConfig.enable()` in console
4. Clear localStorage: `localStorage.clear()` and reload

### Need to reset mock data?

Just refresh the page - all mock data resets to initial state.

### Seeing "Mock resolver not found" error?

This means a query/mutation isn't implemented in mockResolvers.ts. Check the operation name and add it if needed.

### Want to add more mock data?

Edit `agreement-ui/src/mocks/mockData.ts` and add more records to the appropriate arrays.

## 🎓 Advanced Usage

### Add Custom Mock Scenarios

You can temporarily modify mock data in the console:

```javascript
// Access mock data (in development)
// Note: Requires importing in component first
import { mockAgreements } from './mocks';

// Then in console you can inspect
console.log(mockAgreements);
```

### Combine with React DevTools

1. Enable mocks with `mockConfig.enable()`
2. Use React DevTools to inspect state
3. Verify components receive and display mock data correctly

### Performance Testing

```javascript
// Add significant delay to test loading states
mockConfig.enable(5000)

// Or random delays between 500-2000ms
mockConfig.setDelay(Math.random() * 1500 + 500)
```

## 📞 Support

For issues or questions:
1. Check this README
2. Type `mockConfig.help()` in browser console
3. Review mock implementation in `agreement-ui/src/mocks/`

---

**Happy mocking! 🎭**
