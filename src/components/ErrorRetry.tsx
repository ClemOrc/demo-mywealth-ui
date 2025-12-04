import React from 'react';
import { Box, Button, Alert, AlertTitle } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorRetryProps {
  error: Error | string;
  onRetry: () => void;
  title?: string;
}

const ErrorRetry: React.FC<ErrorRetryProps> = ({ 
  error, 
  onRetry, 
  title = 'Failed to load data' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Box sx={{ p: 3 }}>
      <Alert 
        severity="error" 
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

export default ErrorRetry;
