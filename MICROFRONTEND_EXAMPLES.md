# Module Federation Integration Examples

This document provides practical examples for integrating the Agreement UI microfrontend into host applications.

## Prerequisites

Both the host app and the Agreement UI microfrontend must:
- Use Webpack 5 with Module Federation
- Share the same major versions of React, React-DOM, and other core dependencies
- Have Module Federation configured correctly

## Example 1: Host App Configuration

### webpack.config.js (Host App)

```javascript
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

module.exports = {
  // ... other webpack config
  plugins: [
    new ModuleFederationPlugin({
      name: 'myWealthPortal',
      remotes: {
        agreementApp: 'agreementApp@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: '^18.2.0',
          eager: false 
        },
        'react-dom': { 
          singleton: true, 
          requiredVersion: '^18.2.0',
          eager: false 
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.21.0',
          eager: false
        },
        '@mui/material': { 
          singleton: true, 
          requiredVersion: '^5.15.0',
          eager: false 
        },
        '@emotion/react': { 
          singleton: true,
          eager: false 
        },
        '@emotion/styled': { 
          singleton: true,
          eager: false 
        },
        '@apollo/client': { 
          singleton: true, 
          requiredVersion: '^3.8.8',
          eager: false 
        },
        'graphql': { 
          singleton: true,
          eager: false 
        }
      }
    })
  ]
};
```

## Example 2: Full Application Integration

```tsx
// src/pages/AgreementsPage.tsx
import React from 'react';

// @ts-ignore - Module Federation remote
const AgreementApp = React.lazy(() => import('agreementApp/AgreementApp'));

export const AgreementsPage: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading Agreement Module...</div>}>
      <AgreementApp 
        basePath="/wealth/agreements"
        graphqlEndpoint={process.env.REACT_APP_API_URL || 'http://localhost:8080/graphql'}
        standalone={true}
      />
    </React.Suspense>
  );
};
```

## Example 3: Individual Component Integration

```tsx
// src/components/CreateAgreementModal.tsx
import React from 'react';
import { Dialog } from '@mui/material';

// @ts-ignore
const AgreementWizard = React.lazy(() => import('agreementApp/AgreementWizard'));

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (agreementData: any) => void;
}

export const CreateAgreementModal: React.FC<Props> = ({ open, onClose, onComplete }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <React.Suspense fallback={<div>Loading...</div>}>
        <AgreementWizard 
          onComplete={(data) => {
            onComplete(data);
            onClose();
          }}
        />
      </React.Suspense>
    </Dialog>
  );
};
```

## Example 4: Nested Routing

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// @ts-ignore
const AgreementApp = React.lazy(() => import('agreementApp/AgreementApp'));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          
          {/* Agreement module with nested routes */}
          <Route 
            path="/agreements/*" 
            element={
              <React.Suspense fallback={<CircularProgress />}>
                <AgreementApp 
                  basePath="/agreements"
                  graphqlEndpoint="https://api.mywealth.com/graphql"
                  standalone={false}  // Use host's Layout/Router
                />
              </React.Suspense>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
```

## Example 5: Dashboard Widget Integration

```tsx
// src/widgets/AgreementsDashboardWidget.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

// @ts-ignore
const Dashboard = React.lazy(() => import('agreementApp/Dashboard'));

export const AgreementsDashboardWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader title="Agreements Overview" />
      <CardContent>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </React.Suspense>
      </CardContent>
    </Card>
  );
};
```

## Example 6: Type Definitions for Host App

Create a type definition file for better TypeScript support:

```typescript
// src/types/remote-modules.d.ts
declare module 'agreementApp/AgreementApp' {
  import { FC } from 'react';
  
  export interface AppConfig {
    basePath?: string;
    graphqlEndpoint?: string;
    standalone?: boolean;
  }
  
  const AgreementApp: FC<AppConfig>;
  export default AgreementApp;
}

declare module 'agreementApp/AgreementWizard' {
  import { FC } from 'react';
  
  interface AgreementWizardProps {
    onComplete?: (data: any) => void;
    onCancel?: () => void;
  }
  
  const AgreementWizard: FC<AgreementWizardProps>;
  export default AgreementWizard;
}

declare module 'agreementApp/Dashboard' {
  import { FC } from 'react';
  const Dashboard: FC;
  export default Dashboard;
}
```

## Production Considerations

### 1. Remote URL Configuration

```javascript
// Development
remotes: {
  agreementApp: 'agreementApp@http://localhost:3000/remoteEntry.js'
}

// Staging
remotes: {
  agreementApp: 'agreementApp@https://staging-cdn.mywealth.com/agreement-ui/remoteEntry.js'
}

// Production
remotes: {
  agreementApp: 'agreementApp@https://cdn.mywealth.com/agreement-ui/remoteEntry.js'
}
```

### 2. Error Boundaries

Always wrap remote components with error boundaries:

```tsx
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const AgreementApp = React.lazy(() => import('agreementApp/AgreementApp'));

export const AgreementsPage = () => (
  <ErrorBoundary
    fallback={<div>Failed to load Agreement module. Please refresh.</div>}
    onError={(error) => console.error('Module Federation Error:', error)}
  >
    <React.Suspense fallback={<CircularProgress />}>
      <AgreementApp basePath="/agreements" />
    </React.Suspense>
  </ErrorBoundary>
);
```

### 3. Loading States

Provide meaningful loading indicators:

```tsx
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingFallback = () => (
  <Box display="flex" flexDirection="column" alignItems="center" py={8}>
    <CircularProgress />
    <Typography variant="body2" color="text.secondary" mt={2}>
      Loading Agreement Module...
    </Typography>
  </Box>
);

// Use in Suspense
<React.Suspense fallback={<LoadingFallback />}>
  <AgreementApp />
</React.Suspense>
```

## Troubleshooting

### Issue: "Shared module is not available for eager consumption"

**Solution**: Ensure `eager: false` in shared dependencies configuration.

### Issue: Multiple React instances detected

**Solution**: Verify `singleton: true` is set for react and react-dom in both host and remote configs.

### Issue: Module not loading

**Solution**: 
1. Check network tab for 404 on `remoteEntry.js`
2. Verify the Agreement UI dev server is running on port 3000
3. Check CORS configuration if crossing origins

### Issue: Type errors in host app

**Solution**: Create type definition files as shown in Example 6.

## Next Steps

1. Start Agreement UI microfrontend: `cd agreement-ui && npm start`
2. Verify `http://localhost:3000/remoteEntry.js` is accessible
3. Configure your host app's webpack.config.js
4. Import and use the remote modules
5. Test in development before deploying to production
