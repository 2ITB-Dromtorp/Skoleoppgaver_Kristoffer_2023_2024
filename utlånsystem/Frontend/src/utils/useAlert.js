import React, { createContext, useState, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: null, type: null });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}

      <Snackbar
        open={!!alert.message}
        autoHideDuration={2000}
        onClose={() => setAlert({ message: null, type: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setAlert({ message: null, type: '' })} severity={alert.type}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};