import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

export const ThemeToggleProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev); // Agregado correctamente
const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',

        background: {
          default: darkMode ? '#121212' : '#e4e4e4',    // Fondo general
          paper: darkMode ? '#1E1E1E' : '#dcdde1',       // Tarjetas, contenedores
        },

        text: {
          primary: darkMode ? '#E0E0E0' : '#2B3445',     // Texto principal
          secondary: darkMode ? '#B0B0B0' : '#5B667C',   // Texto secundario
        },

        primary: {
          main: darkMode ? '#4DB6AC' : '#005B4F',        // Verde agua/verde oscuro
        },

        secondary: {
          main: darkMode ? '#80CBC4' : '#00897B',
        },
      },

      typography: {
        fontFamily: 'Roboto, sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },

      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              boxShadow: darkMode
                ? '0 3px 6px rgba(0,0,0,0.5)'
                : '0 3px 10px rgba(0,0,0,0.08)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#1B1B1B' : '#005B4F',
              color: '#FFFFFF',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
      },
    }),
  [darkMode]
);

  return (
    <ThemeToggleContext.Provider value={{ toggleTheme, darkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
