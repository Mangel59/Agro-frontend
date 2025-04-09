import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, Switch } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import ProfileMenu from '../ProfileMenu';
import { useThemeToggle } from './ThemeToggleProvider';

/**
 * Componente de barra superior de navegación.
 */
export default function AppBarComponent({ setCurrentModule }) {
  const location = useLocation();
  const toggleTheme = useThemeToggle();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (typeof setCurrentModule === 'function') {
      setCurrentModule(
        <Login
          setIsAuthenticated={setIsAuthenticated}
          setCurrentModule={setCurrentModule}
        />
      );
    }
  };

  const handleRegister = () => {
    if (typeof setCurrentModule === 'function') {
      setCurrentModule(<Register setCurrentModule={setCurrentModule} />);
    }
  };

  useEffect(() => {
    if (location.pathname === '/login') handleLogin();
    if (location.pathname === '/register') handleRegister();
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

        <Switch onChange={toggleTheme} sx={{ mr: 2 }} />

        {!isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
            <Button color="inherit" onClick={handleRegister}>
              Register
            </Button>
          </>
        ) : (
          <ProfileMenu
            setCurrentModule={setCurrentModule}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
