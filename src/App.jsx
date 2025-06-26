import React from 'react';
import { Box, CssBaseline, Container, Toolbar, Paper } from '@mui/material';
import { useThemeToggle } from './components/dashboard/ThemeToggleProvider';
import { useTranslation } from 'react-i18next';
import './i18n.js';
import './index.css';

import AppBarComponent from './components/dashboard/AppBarComponent.jsx';
import Copyright from './components/dashboard/Copyright';
import Inicio from './components/Inicio.jsx';

const App = () => {
  const { t } = useTranslation();
  const toggleTheme = useThemeToggle();

  const [currentModule, setCurrentModule] = React.useState(null); // Primero null

  React.useEffect(() => {
    setCurrentModule(<Inicio setCurrentModule={setCurrentModule} />);
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
