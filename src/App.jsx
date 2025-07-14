import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Toolbar,
  Paper,
} from '@mui/material';

import { useThemeToggle } from './components/dashboard/ThemeToggleProvider';
import { useTranslation } from 'react-i18next';
import './i18n.js';
import './index.css';

import AppBarComponent from './components/dashboard/AppBarComponent.jsx';
import Copyright from './components/dashboard/Copyright';
import Login from './components/Login.jsx';
import Inicio from './components/Inicio.jsx';
import Contenido from './components/dashboard/Contenido.jsx';

const App = () => {
  const { t } = useTranslation();
  const toggleTheme = useThemeToggle();

  const [currentModule, setCurrentModule] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('token_expiration');
    const isTokenValid = token && expiresAt && Date.now() < Number(expiresAt);

    if (isTokenValid) {
      setIsAuthenticated(true);
      setCurrentModule(<Contenido setCurrentModule={setCurrentModule} />);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      setIsAuthenticated(false);
      setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
    }
  }, []);

  return (
    <Box
      component="main"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      })}
    >
      <CssBaseline />
      <Toolbar />
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
    <AppBarComponent
      key={isAuthenticated} // 🔁 clave para forzar render al cambiar estado
      setCurrentModule={setCurrentModule}
      />

        <Paper
          sx={{
            p: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {currentModule}
        </Paper>
        <Copyright sx={{ pt: 2, pb: 2 }} />
      </Container>
    </Box>
  );
};

export default App;
