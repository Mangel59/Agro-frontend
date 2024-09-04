import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Container, Box, CssBaseline, Paper, Grid, Button, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import axios from './components/axiosConfig.js';
import { Drawer } from './components/dashboard/Drawer';
import Copyright from './components/dashboard/Copyright';
import Navigator2 from './components/dashboard/Navigator2';
import Grid1 from './components/grid/Grid1';
import { useThemeToggle } from './components/dashboard/ThemeToggleProvider';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Persona from './components/personas/Persona.jsx';
import FormRegistroPersona from './components/seguridad/FormRegistroPersona.jsx';
import Empresa from './components/empresas/Empresa.jsx';
// import Logout from './components/Logout';
import Inicio from './components/Inicio.jsx';  
import ForgetPassword from './components/ForgetPassword.jsx';  
import ProfileMenu from './components/ProfileMenu';
import { useTranslation } from 'react-i18next';
import './i18n.js';
import './index.css';
import AppBarComponent from './components/dashboard/AppBarComponent.jsx';


const App = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  // const [currentModule, setCurrentModule] = React.useState(<Grid1 />);
  const [currentModule, setCurrentModule] = React.useState(<Inicio />);

  const [message, setMessage] = React.useState(null);
  const toggleTheme = useThemeToggle();

    // const handleLogin = () => {
    //     // navigate('/login');
    //     setCurrentModule (<Login/>)
    // };

    // const handleRegister = () => {
    //     // navigate('/register');
    //     setCurrentModule (<Register/>)
    // };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    // Simulación o comentario de la petición mientras no haya backend
    
    // axios.get('http://172.16.79.156:8080/auth/home')
    //   .then(response => {
    //     setMessage(response.data);
    //   })
    //   .catch(error => {
    //     console.error('There was an error fetching the home message!', error);
    //   });
    
    setMessage('Bienvenido a la aplicación');//  // Mensaje simulado
  }, []);

  const isAuthenticated = !!localStorage.getItem('token');
  
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
          <AppBarComponent
            // buttonLabel="Register"
            // onButtonClick={handleRegister}
            // secondaryButtonLabel="Login"
            // onSecondaryButtonClick={handleLogin}
            // switchComponent={<Switch onChange={toggleTheme} 
            setCurrentModule={setCurrentModule}     
          />
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            {currentModule}
            </Paper>
          </Grid>
          <Copyright sx={{ pt: 2, pb: 2 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default App;