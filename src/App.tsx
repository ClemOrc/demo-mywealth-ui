import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '@/config/apollo';
import { theme } from '@/config/theme';
import { AppProvider } from '@contexts/AppContext';
import AppRoutes from '@/routes';
import Layout from '@components/Layout/Layout';
import ErrorBoundary from '@components/ErrorBoundary';

export interface AppConfig {
  basePath?: string;
  graphqlEndpoint?: string;
  standalone?: boolean;
}

interface AppProps extends AppConfig {}

function App({
  basePath = '',
  graphqlEndpoint = 'http://localhost:8080/graphql',
  standalone = true
}: AppProps = {}) {
  const apolloClient = createApolloClient(graphqlEndpoint);

  const content = (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppProvider>
            {standalone ? (
              <Layout>
                <AppRoutes basePath={basePath} />
              </Layout>
            ) : (
              <AppRoutes basePath={basePath} />
            )}
          </AppProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );

  // If standalone, wrap with Router. Otherwise, expect Router from host.
  return standalone ? <Router>{content}</Router> : content;
}

export default App;
