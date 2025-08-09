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

        // Diferencia clara entre fondo general y tarjetas
      background: {
        default: darkMode ? '#0B0F14' : '#E6ECF2', // panel exterior
        paper:   darkMode ? '#1E1E1E' : '#FFFFFF', // tarjeta

        // NUEVO: zonas internas de la tarjeta (siempre distinto a 'paper')
        cardHeader: darkMode ? '#5a5b5d' : '#E9EEF3', // parte superior (icono)
        cardFooter: darkMode ? '#1D2631' : '#DDE3EA', // barra del título
      },

        text: {
          primary:   darkMode ? '#E0E0E0' : '#2B3445',
          secondary: darkMode ? '#B0B0B0' : '#5B667C',
        },

        primary:   { main: darkMode ? '#4DB6AC' : '#005B4F' },
        secondary: { main: darkMode ? '#80CBC4' : '#00897B' },
      },

      typography: {
        fontFamily: 'Roboto, sans-serif',
        button: { textTransform: 'none', fontWeight: 500 },
      },

      components: {
        // Fuerza contraste por elevación: contenedor vs tarjeta
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              backgroundImage: 'none',
              boxShadow: darkMode
                ? '0 3px 6px rgba(0,0,0,0.5)'
                : '0 3px 10px rgba(0,0,0,0.08)',
            },
          },
          variants: [
            // Paper "plano" para secciones grandes (afuera)
            {
              props: { elevation: 0 },
              style: {
                backgroundColor: darkMode ? '#151515' : '#ECEFF1',
              },
            },
            // Tarjetas (adentro)
            {
              props: { elevation: 1 },
              style: {
                backgroundColor: darkMode ? '#1F1F1F' : '#FFFFFF',
              },
            },
            // Outlined con otro pelín de contraste
            {
              props: { variant: 'outlined' },
              style: {
                backgroundColor: darkMode ? '#1A1A1A' : '#F7F7F9',
                borderColor: darkMode ? '#2A2A2A' : '#E6E8F0',
              },
            },
          ],
        },

        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#1F1F1F' : '#FFFFFF',
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
          styleOverrides: { root: { borderRadius: 6 } },
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
