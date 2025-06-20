/**
 * @file App.jsx
 * @module App
 * @description Componente principal de la aplicación.
 * Renderiza la estructura general de la app incluyendo barra de navegación, 
 * módulo principal, alternancia de tema e internacionalización.
 * @component
 * @returns {JSX.Element} El componente raíz de la aplicación.
 */

import React from 'react';
import { Box, CssBaseline, Container, Toolbar, Paper } from '@mui/material';
import { useThemeToggle } from './components/dashboard/ThemeToggleProvider';
import { useTranslation } from 'react-i18next';
import './i18n.js';
import './index.css';

import AppBarComponent from './components/dashboard/AppBarComponent.jsx';
import Copyright from './components/dashboard/Copyright';
import Inicio from './components/Inicio.jsx';

/**
 * Componente principal que organiza la estructura visual y funcional de la aplicación.
 * @returns {JSX.Element}
 */
const App = () => {
  const { t } = useTranslation(); // Hook para traducción (i18n)
  const [currentModule, setCurrentModule] = React.useState(<Inicio />); // Módulo principal a mostrar
  const toggleTheme = useThemeToggle(); // Alternador de tema (oscuro/claro)

  React.useEffect(() => {
    console.log('Bienvenido a la aplicación');
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
        <AppBarComponent setCurrentModule={setCurrentModule} />
        <Paper sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {currentModule}
        </Paper>
        <Copyright sx={{ pt: 2, pb: 2 }} />
      </Container>
    </Box>
  );
};

export default App;
