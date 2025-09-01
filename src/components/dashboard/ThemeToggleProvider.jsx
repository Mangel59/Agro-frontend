import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';

const ThemeToggleContext = createContext();
export const useThemeToggle = () => useContext(ThemeToggleContext);

// VERDE OSCURO
const BRAND_GREEN = '#0F2327';

export const ThemeToggleProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(v => !v);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: BRAND_GREEN },               // verde de marca
          background: {
            default: darkMode ? BRAND_GREEN : '#E7F6F7',
            paper:   darkMode ? '#1B1F22' : '#FFFFFF',
          },
          text: {
            primary: darkMode ? '#E0E0E0' : '#2B3445',
            secondary: darkMode ? '#B0B0B0' : '#5B667C',
          },
          action: {
            active: darkMode ? '#FFFFFF' : '#000000',
            hover: darkMode ? alpha('#FFFFFF', 0.12) : alpha('#000000', 0.08),
            disabled: darkMode ? alpha('#FFFFFF', 0.26) : alpha('#000000', 0.26),
            selected: darkMode ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.12),
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: BRAND_GREEN,
                color: '#FFFFFF',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
                letterSpacing: 0.2,
              },
              outlined: darkMode
                ? {
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: alpha('#FFFFFF', 0.08),
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255,255,255,0.35)',
                      borderColor: 'rgba(255,255,255,0.25)',
                    },
                  }
                : {},
              text: darkMode
                ? {
                    color: '#FFFFFF',
                    '&:hover': { backgroundColor: alpha('#FFFFFF', 0.06) },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.35)' },
                  }
                : {},
              contained: darkMode
                ? {
                    backgroundColor: '#FFFFFF',
                    color: BRAND_GREEN,
                    boxShadow: '0 2px 6px rgba(0,0,0,.35)',
                    '&:hover': { backgroundColor: '#F5F7F8' },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      color: alpha(BRAND_GREEN, 0.55),
                    },
                  }
                : {},
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: `1px solid ${darkMode ? '#FFFFFF' : '#000000'}`, // borde externo
              },
              columnHeaders: {
                borderBottom: `1px solid ${darkMode ? '#FFFFFF' : '#000000'}`, // borde encabezados
              },
              cell: {
                borderBottom: `1px solid ${darkMode ? '#FFFFFF' : '#000000'}`, // borde filas
                //borderRight: `1px solid ${darkMode ? '#FFFFFF' : '#000000'}`,
              },
              columnSeparator: {
                color: darkMode ? '#FFFFFF' : '#000000', // borde entre columnas
                display: 'none', // opcional: ocultar el separador nativo
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
