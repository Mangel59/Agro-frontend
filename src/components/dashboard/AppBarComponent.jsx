
/**
 * AppBarComponent componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Switch } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Login from '../Login'; 
import Register from '../Register'; 
import ProfileMenu from '../ProfileMenu'; 
import { useThemeToggle } from './ThemeToggleProvider';

/**
 * Componente AppBarComponent.
 * @module AppBarComponent.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function AppBarComponent({ setCurrentModule }) {
  const location = useLocation();
  const toggleTheme = useThemeToggle();

  // Estado para el manejo de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función que se ejecuta cuando se hace clic en "Login"
  const handleLogin = () => {
    setCurrentModule(<Login setIsAuthenticated={setIsAuthenticated} setCurrentModule={setCurrentModule} />);
  };

  // Función que se ejecuta cuando se hace clic en "Register"
  const handleRegister = () => {
    setCurrentModule(<Register setCurrentModule={setCurrentModule} />);
  };

  // Redirigir automáticamente a Login o Register según la ruta
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

        {/* Mostrar Login y Register si no está autenticado, de lo contrario mostrar el ProfileMenu */}
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