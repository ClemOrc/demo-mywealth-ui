# Mock System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Dashboard   │  │   Wizard     │  │   Details    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                  │                 │
│         └─────────────────┴──────────────────┘                 │
│                           │                                    │
│                    Apollo Client                               │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                ┌───────────▼───────────┐
                │   Mock Config Check   │
                │  (mockConfig.ts)      │
                └───────────┬───────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
     MOCKS ENABLED                  MOCKS DISABLED
            │                               │
            │                               │
    ┌───────▼────────┐              ┌──────▼───────┐
    │   Mock Link    │              │  HTTP Link   │
    │  (MockLink.ts) │              │  (Apollo)    │
    └───────┬────────┘              └──────┬───────┘
            │                               │
    ┌───────▼──────────┐                    │
    │ Mock Resolvers   │            ┌───────▼────────┐
    │ (Query/Mutation) │            │   Real BFF     │
    └───────┬──────────┘            │   GraphQL      │
            │                       │  :8080/graphql │
    ┌───────▼──────────┐            └────────────────┘
    │   Mock Data      │
    │  - Agreements    │
    │  - Clients       │
    │  - Products      │
    │  - etc.          │
    └──────────────────┘
```

## Data Flow - Mock Enabled

```
┌─────────┐    1. GraphQL Query     ┌──────────────┐
│  React  │ ───────────────────────> │  Mock Link   │
│  Query  │                          └──────┬───────┘
└─────────┘                                 │
                                            │ 2. Extract operation
                                            │    name from query
                                            │
                                     ┌──────▼──────────┐
                                     │ Mock Resolvers  │
                                     │                 │
                                     │ - Filter data   │
     ┌──────────┐                   │ - Paginate      │
     │  React   │ <────────────────  │ - Sort          │
     │  State   │    4. Return data  │ - Transform     │
     └──────────┘                    └──────┬──────────┘
                                            │
                                            │ 3. Access
                                            │    mock data
                                            │
                                     ┌──────▼──────────┐
                                     │   Mock Data     │
                                     │  (in-memory)    │
                                     └─────────────────┘
```

## Data Flow - Mock Disabled

```
┌─────────┐   1. GraphQL Query    ┌──────────────┐
│  React  │ ─────────────────────> │  HTTP Link   │
│  Query  │                        └──────┬───────┘
└─────────┘                               │
                                          │ 2. HTTP POST
                                          │
     ┌──────────┐                  ┌──────▼──────────┐
     │  React   │                  │   Real BFF      │
     │  State   │ <──────────────  │   GraphQL       │
     └──────────┘   4. Response    │   Server        │
                                   └──────┬──────────┘
                                          │
                                          │ 3. Database
                                          │    queries
                                          │
                                   ┌──────▼──────────┐
                                   │   PostgreSQL    │
                                   │   Database      │
                                   └─────────────────┘
```

## Configuration Flow

```
                  Application Startup
                         │
                         ▼
              ┌────────────────────┐
              │  Load Configuration│
              │   (mockConfig.ts)  │
              └──────────┬─────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐           ┌──────────────────┐
│ Check .env file │           │ Check localStorage│
│ REACT_APP_USE_  │           │   'mockConfig'    │
│    MOCKS        │           │                   │
└────────┬────────┘           └────────┬──────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
            ┌───────▼────────┐
            │  Merge Config  │
            │ (localStorage  │
            │  overrides env)│
            └───────┬────────┘
                    │
         ┌──────────▼───────────┐
         │                      │
         ▼                      ▼
   useMocks: true       useMocks: false
         │                      │
         ▼                      ▼
   Create MockLink       Create HttpLink
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
            Apollo Client Ready
```

## Mock Data Mutation Flow

```
User Action (Create/Update/Delete)
         │
         ▼
┌─────────────────┐
│ GraphQL Mutation│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Mock Link     │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Mock Resolver      │
│  (Mutation)         │
│                     │
│  1. Validate input  │
│  2. Generate IDs    │
│  3. Update arrays   │
│  4. Return result   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐      ┌───────────────┐
│   Update Mock Data  │ ───> │ mockAgreements│
│   (in-memory)       │      │ mockClients   │
│                     │      │ mockProducts  │
│   - Push new item   │      │ etc.          │
│   - Splice deleted  │      └───────────────┘
│   - Replace updated │
└────────┬────────────┘
         │
         ▼
    Return to React
  (Apollo cache updates)
         │
         ▼
   UI Re-renders
```

## Browser Console API

```
Window Object
    │
    └── mockConfig
         │
         ├── enable(delay?)
         ├── disable()
         ├── setDelay(ms)
         ├── enableErrors(rate)
         ├── disableErrors()
         ├── setSpecificError(op, msg)
         ├── clearSpecificError(op)
         ├── getCurrent()
         └── help()
              │
              └── Saves to localStorage
                   │
                   └── Reloads page
```

## File Organization

```
agreement-ui/
├── src/
│   ├── mocks/
│   │   ├── index.ts              ← Exports
│   │   ├── mockConfig.ts         ← Configuration & API
│   │   ├── mockData.ts           ← 30+ records
│   │   ├── mockResolvers.ts      ← Query/Mutation logic
│   │   └── MockLink.ts           ← Apollo interceptor
│   │
│   └── config/
│       └── apollo.ts             ← Updated to use mocks
│
├── .env                          ← REACT_APP_USE_MOCKS
├── MOCK_SYSTEM_GUIDE.md         ← Complete guide
├── MOCK_IMPLEMENTATION_SUMMARY.md
├── MOCK_QUICK_REFERENCE.md
└── README.md                     ← Updated
```

## Key Components

### 1. mockConfig.ts
- Reads environment variables
- Manages localStorage
- Provides browser API
- Handles page reload

### 2. mockData.ts
- Defines all mock records
- Helper functions
- Initial state

### 3. mockResolvers.ts
- Implements GraphQL schema
- Filters, pagination, sorting
- CRUD operations
- Error simulation

### 4. MockLink.ts
- Extends Apollo Link
- Intercepts requests
- Routes to resolvers
- Adds optional delay

### 5. apollo.ts (updated)
- Checks mock config
- Creates appropriate link
- Initializes Apollo Client

## Error Simulation

```
Request → MockLink → Check Error Config
                            │
            ┌───────────────┴────────────────┐
            │                                │
            ▼                                ▼
    Specific Error Set?            Random Error?
    (by operation name)           (based on rate)
            │                                │
            │ Yes                            │ Yes
            ▼                                ▼
    Throw GraphQLError          Throw GraphQLError
            │                                │
            └────────────┬───────────────────┘
                         │
                         ▼
                   Error Handler
                         │
                         ▼
                   UI Error Display
```

## Benefits

```
Development Time
     │
     ├── Without Mocks
     │   ├── Wait for BFF
     │   ├── Database setup
     │   ├── Test data creation
     │   └── Network issues
     │
     └── With Mocks
         ├── ✅ Instant responses
         ├── ✅ 30+ records ready
         ├── ✅ Full CRUD working
         ├── ✅ Error testing
         └── ✅ No dependencies
```
