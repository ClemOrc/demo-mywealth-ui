import { createTheme } from '@mui/material/styles';
import { COLORS } from '../constants';

// Extend Material-UI theme with custom colors
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      backgroundGray: string;
      backgroundLight: string;
      borderGray: string;
      textSecondary: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      backgroundGray?: string;
      backgroundLight?: string;
      borderGray?: string;
      textSecondary?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY,
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: COLORS.WHITE,
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
      contrastText: COLORS.WHITE,
    },
    background: {
      default: COLORS.BACKGROUND_GRAY,
      paper: COLORS.WHITE,
    },
    text: {
      primary: '#333333',
      secondary: COLORS.TEXT_SECONDARY,
    },
    success: {
      main: COLORS.SUCCESS,
    },
    warning: {
      main: COLORS.WARNING,
    },
    error: {
      main: COLORS.ERROR,
    },
    custom: {
      backgroundGray: COLORS.BACKGROUND_GRAY,
      backgroundLight: COLORS.BACKGROUND_LIGHT,
      borderGray: COLORS.BORDER_GRAY,
      textSecondary: COLORS.TEXT_SECONDARY,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
