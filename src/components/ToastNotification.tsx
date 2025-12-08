import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 4000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;