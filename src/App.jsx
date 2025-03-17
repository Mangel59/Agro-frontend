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
 * Componente principal de la aplicación.
 * Renderiza la estructura general de la aplicación, incluyendo la barra de navegación, 
 * la gestión de rutas y la funcionalidad de alternar temas.
 * 
 * @component
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * App componente principal.
 * @component
 * @returns {JSX.Element}
 */
const App = () => {
  const { t } = useTranslation(); // Hook para la internacionalización
  const [currentModule, setCurrentModule] = React.useState(<Inicio />); // Módulo actual que se muestra
  const toggleTheme = useThemeToggle(); // Función para alternar el tema de la aplicación

  React.useEffect(() => {
    // Simulación de mensaje de bienvenida
    console.log('Bienvenido a la aplicación');
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Toolbar />
        <Container
          maxWidth={false}
          sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)', justifyContent: 'center' }}
        >
          <AppBarComponent setCurrentModule={setCurrentModule} />
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {currentModule}
          </Paper>
          <Copyright sx={{ pt: 2, pb: 2 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default App;
