import React, { createContext, useMemo, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Crear un contexto para el cambio de tema
const ThemeToggleContext = createContext();

/**
 * Hook para usar el contexto de cambio de tema.
 * @returns {function} Función para alternar el tema.
 */
export const useThemeToggle = () => {
  return useContext(ThemeToggleContext);
};

// Definición del tema claro
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Definición del tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

/**
 * Proveedor de contexto para alternar entre temas.
 * @param {Object} props - Props del componente.
 * @param {ReactNode} props.children - Componentes hijos que se renderizarán dentro del proveedor.
 * @returns {JSX.Element} Proveedor de contexto y tema.
 */
export const ThemeToggleProvider = ({ children }) => {
  // Estado para controlar si el modo oscuro está activo
  const [darkMode, setDarkMode] = useState(false);

  // Función para alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Memoización del tema basado en el estado de darkMode
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}