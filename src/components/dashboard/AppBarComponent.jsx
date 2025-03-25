/**
 * AppBarComponent.jsx
 * @module AppBarComponent
 * @description Barra de navegación superior con gestión de autenticación y cambio de tema.
 * @component
 */

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Switch } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Login from '../Login'; 
import Register from '../Register'; 
import ProfileMenu from '../ProfileMenu'; 
import { useThemeToggle } from './ThemeToggleProvider';

/**
 * Componente de la barra de navegación superior.
 *
 * @param {Object} props - Props del componente.
 * @param {Function} props.setCurrentModule - Función para cambiar el módulo mostrado.
 * @returns {JSX.Element} Componente de AppBar.
 */
export default function AppBarComponent({ setCurrentModule }) {
  const location = useLocation();
  const toggleTheme = useThemeToggle();

  /**
   * Estado que indica si el usuario está autenticado.
   * @type {boolean}
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Redirige al componente Login.
   */
  const handleLogin = () => {
    setCurrentModule(<Login setIsAuthenticated={setIsAuthenticated} setCurrentModule={setCurrentModule} />);
  };

  /**
   * Redirige al componente Register.
   */
  const handleRegister = () => {
    setCurrentModule(<Register setCurrentModule={setCurrentModule} />);
  };

  // Redirección automática si cambia la ruta
  useEffect(() => {
    if (location.pathname === '/login') {
      handleLogin(); 
    }
    if (location.pathname === '/register') {
      handleRegister();
    }
  }, [location.pathname]);

  return (
    <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#114232' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Agro Application
        </Typography>

        {/* Switch para alternar tema */}
        <Switch onChange={toggleTheme} sx={{ mr: 2 }} />

        {/* Mostrar Login y Register si no está autenticado, de lo contrario el menú de perfil */}
        {!isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleLogin}>Login</Button>
            <Button color="inherit" onClick={handleRegister}>Register</Button>
          </>
        ) : (
          <ProfileMenu setCurrentModule={setCurrentModule} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Toolbar>
    </AppBar>
  );
}
