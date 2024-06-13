// src/contexts/AlertContext.tsx
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface AlertContextType {
  showAlert: (message: string, severity?: 'success' | 'info' | 'warning' | 'error', timeout?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info', timeout: number = 2000) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, timeout);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar open={snackbarOpen} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>{alertMessage}</Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};
