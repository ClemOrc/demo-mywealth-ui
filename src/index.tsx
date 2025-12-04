// Initialize mocks in browser localStorage BEFORE anything else loads
// This must run synchronously before any async imports
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const stored = localStorage.getItem('mockConfig');
    if (!stored) {
      const isDevelopment = true; // Always treat as development in browser
      if (isDevelopment) {
        const mockConfig = {
          useMocks: true,
          mockDelay: 0,
          errorConfig: {
            enabled: false,
            errorRate: 0,
            specificErrors: {}
          }
        };
        localStorage.setItem('mockConfig', JSON.stringify(mockConfig));
        console.log('🎭 [INIT] Development mode - mocks initialized in localStorage');
        console.log('🎭 [INIT] Storage:', localStorage.getItem('mockConfig'));
      }
    }
  } catch (e) {
    console.warn('Failed to initialize mock config:', e);
  }
}

// Bootstrap pattern for Module Federation
// This lazy import ensures shared dependencies are loaded before the app initializes
import('./bootstrap');
