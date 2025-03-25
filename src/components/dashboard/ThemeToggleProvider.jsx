/**
 * @module ThemeToggleProvider
 */
// src/components/dashboard/ThemeToggleProvider.jsx

import React, { createContext, useContext, useState } from 'react';

const ThemeToggleContext = createContext();

/**
 * Proveedor del contexto de tema para alternar entre modos claro y oscuro.
 * @component
 */
export function ThemeToggleProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeToggleContext.Provider value={toggleTheme}>
      {children}
    </ThemeToggleContext.Provider>
  );
}

/**
 * Hook para acceder a la función toggle del contexto de tema.
 * @returns {Function} Función para alternar el tema.
 */
export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}
