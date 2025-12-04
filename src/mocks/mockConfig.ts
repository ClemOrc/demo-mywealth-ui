// Mock configuration
export interface MockConfig {
  useMocks: boolean;
  mockDelay: number; // milliseconds
  errorConfig: {
    enabled: boolean;
    errorRate: number; // 0-1
    specificErrors?: {
      [operation: string]: string;
    };
  };
}

// Default mock configuration
const defaultMockConfig: MockConfig = {
  useMocks: false,
  mockDelay: 0,
  errorConfig: {
    enabled: false,
    errorRate: 0,
    specificErrors: {},
  },
};

// Load config from environment or localStorage
const loadMockConfig = (): MockConfig => {
  // Check localStorage FIRST (allows runtime toggling and persists settings)
  let useMocksLocal = false;
  let mockDelayLocal = 0;
  let errorConfigLocal = defaultMockConfig.errorConfig;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedConfig = localStorage.getItem('mockConfig');
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig);
        useMocksLocal = parsed.useMocks ?? false;
        mockDelayLocal = parsed.mockDelay ?? 0;
        errorConfigLocal = parsed.errorConfig ?? defaultMockConfig.errorConfig;
        // If we found a config in localStorage, use it and skip env check
        return {
          useMocks: useMocksLocal,
          mockDelay: mockDelayLocal,
          errorConfig: errorConfigLocal,
        };
      }
    } catch (e) {
      console.warn('Failed to load mock config from localStorage:', e);
    }
  }

  // If no localStorage config, check environment variable (for build-time configuration)
  // In development mode, default to true to enable mocks by default
  const isDevelopment = typeof process !== 'undefined' 
    && process.env.NODE_ENV !== 'production';
  
  const useMocksEnv = isDevelopment ? true : 
    (typeof process !== 'undefined' && process.env.REACT_APP_USE_MOCKS === 'true');
  
  const mockDelayEnv = typeof process !== 'undefined' && process.env.REACT_APP_MOCK_DELAY 
    ? parseInt(process.env.REACT_APP_MOCK_DELAY, 10) 
    : 0;

  return {
    useMocks: useMocksEnv,
    mockDelay: mockDelayEnv,
    errorConfig: defaultMockConfig.errorConfig,
  };
};

// Save config to localStorage
export const saveMockConfig = (config: Partial<MockConfig>) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const currentConfig = loadMockConfig();
      const newConfig = { ...currentConfig, ...config };
      localStorage.setItem('mockConfig', JSON.stringify(newConfig));
      console.log('Mock configuration saved:', newConfig);
      
      // Reload the page to apply changes
      if (config.useMocks !== undefined) {
        console.log('Reloading page to apply mock configuration changes...');
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to save mock config to localStorage:', e);
    }
  }
};

// Get current mock configuration
export const getMockConfig = (): MockConfig => loadMockConfig();

// Helper functions for easy toggling
export const enableMocks = (delay: number = 0) => {
  saveMockConfig({ useMocks: true, mockDelay: delay });
};

export const disableMocks = () => {
  saveMockConfig({ useMocks: false });
};

export const setMockDelay = (delay: number) => {
  saveMockConfig({ mockDelay: delay });
};

export const enableMockErrors = (errorRate: number = 0.1) => {
  const config = getMockConfig();
  saveMockConfig({
    errorConfig: {
      ...config.errorConfig,
      enabled: true,
      errorRate,
    },
  });
};

export const disableMockErrors = () => {
  const config = getMockConfig();
  saveMockConfig({
    errorConfig: {
      ...config.errorConfig,
      enabled: false,
    },
  });
};

export const setSpecificMockError = (operation: string, errorMessage: string) => {
  const config = getMockConfig();
  saveMockConfig({
    errorConfig: {
      ...config.errorConfig,
      enabled: true,
      specificErrors: {
        ...config.errorConfig.specificErrors,
        [operation]: errorMessage,
      },
    },
  });
};

export const clearSpecificMockError = (operation: string) => {
  const config = getMockConfig();
  const { [operation]: _, ...rest } = config.errorConfig.specificErrors || {};
  saveMockConfig({
    errorConfig: {
      ...config.errorConfig,
      specificErrors: rest,
    },
  });
};

// Console helper to display available mock configuration commands
if (typeof window !== 'undefined') {
  (window as any).mockConfig = {
    enable: enableMocks,
    disable: disableMocks,
    setDelay: setMockDelay,
    enableErrors: enableMockErrors,
    disableErrors: disableMockErrors,
    setSpecificError: setSpecificMockError,
    clearSpecificError: clearSpecificMockError,
    getCurrent: getMockConfig,
    help: () => {
      console.log(`
🎭 Mock Configuration API
========================

Enable/Disable Mocks:
  mockConfig.enable(delay?)    - Enable mocks (optional delay in ms)
  mockConfig.disable()          - Disable mocks

Configuration:
  mockConfig.setDelay(ms)       - Set response delay in milliseconds
  
Error Simulation:
  mockConfig.enableErrors(rate) - Enable random errors (rate: 0-1, default 0.1)
  mockConfig.disableErrors()    - Disable error simulation
  mockConfig.setSpecificError(operation, message) - Force specific operation to fail
  mockConfig.clearSpecificError(operation)        - Clear specific error

Information:
  mockConfig.getCurrent()       - Get current configuration
  mockConfig.help()             - Show this help

Examples:
  mockConfig.enable(500)        - Enable mocks with 500ms delay
  mockConfig.enableErrors(0.2)  - 20% of requests will fail
  mockConfig.setSpecificError('createAgreement', 'Failed to create agreement')
      `);
    },
  };

  // Show help message on load if mocks are enabled
  const config = loadMockConfig();
  if (config.useMocks) {
    console.log('%c🎭 Mocks Enabled', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    console.log('Type mockConfig.help() for configuration options');
    console.log('Current config:', config);
  }
}

export default loadMockConfig();
