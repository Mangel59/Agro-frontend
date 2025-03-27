/**
 * @module ThemeToggleProvider
 * @description Proveedor de tema para alternar entre modo claro y oscuro usando MUI.
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Crear contexto
const ThemeToggleContext = createContext();

/**
 * Proveedor del tema para aplicar modo claro/oscuro a toda la aplicación.
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function ThemeToggleProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Función para alternar el tema
  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Tema dinámico (claro u oscuro)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}

/**
 * Hook personalizado para acceder a la función de alternar tema.
 * @returns {() => void} Función toggleTheme
 */
export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}
