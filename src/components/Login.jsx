/**
 * Componente Login.
 * @module Login
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setIsAuthenticated - Función para actualizar el estado de autenticación.
 * @param {Function} props.setCurrentModule - Función para cambiar el módulo actual.
 * @returns {JSX.Element} Componente de formulario de inicio de sesión.
 */

import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box,
  IconButton, InputAdornment, Alert, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import LoginIcon from '@mui/icons-material/Login';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import FormRegistroPersona from './seguridad/FormRegistroPersona';
import FormRegistroEmpresa from './seguridad/FormRegistroEmpresa';
import Contenido from '../components/dashboard/Contenido';
import PropTypes from 'prop-types';

/**
 * Alterna la visibilidad de la contraseña.
 * @function handleClickShowPassword
 * @returns {void}
 */

/**
 * Previene el comportamiento por defecto al hacer clic en el botón del icono.
 * @function handleMouseDownPassword
 * @param {React.MouseEvent} event
 * @returns {void}
 */

/**
 * Valida si un correo electrónico tiene un formato válido.
 * @function validateEmail
 * @param {string} email
 * @returns {boolean}
 */

/**
 * Cambia el idioma de la aplicación.
 * @function handleLanguageChange
 * @param {string} lng - Código del idioma (ej: 'es', 'en').
 * @returns {void}
 */

/**
 * Envía el formulario de login y autentica al usuario.
 * @function handleSubmit
 * @param {React.FormEvent} event
 * @returns {void}
 */

export default function Login(props) {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const toggleTheme = useThemeToggle();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(username)) {
      setError(t('invalid_email'));
      return;
    }

    axios.post('http://localhost:8080/auth/login', {
      username,
      password,
    })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        if (props.setIsAuthenticated && typeof props.setIsAuthenticated === 'function') {
          props.setIsAuthenticated(true);
        }

        const usuarioEstado = response.data.usuarioEstado;

        if (usuarioEstado === 2) {
          props.setCurrentModule(<FormRegistroPersona setCurrentModule={props.setCurrentModule} />);
        } else if (usuarioEstado === 3) {
          props.setCurrentModule(<FormRegistroEmpresa setCurrentModule={props.setCurrentModule} />);
        } else if (usuarioEstado === 4) {
          props.setCurrentModule(<Contenido setCurrentModule={props.setCurrentModule} />);
        }
      })
      .catch(error => {
        setError(t('login_error'));
        console.error('Error al iniciar sesión:', error);
      });
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFF',
        padding: 3,
        mt: 15,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{
            fontWeight: 'bold',
            marginBottom: 3,
            color: '#1a237e',
          }}
        >
          {t('login')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label={t('email')}
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />

        <TextField
          label={t('password')}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link
          component={RouterLink}
          to="/forgetpassword"
          variant="body2"
          align="center"
          sx={{
            color: '#1e88e5',
            textDecoration: 'none',
            marginBottom: 2,
            fontWeight: 'bold',
            alignSelf: 'flex-end'
          }}
        >
          {t('Forgot your password?')}
        </Link>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<LoginIcon />}
        >
          {t('login')}
        </Button>

        <Typography variant="body2" align="center" sx={{ marginTop: 3, color: '#666' }}>
          {t('no_account')}{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{ color: '#1e88e5', textDecoration: 'none', fontWeight: 'bold' }}
          >
            {t('register_here')}
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button onClick={() => handleLanguageChange('en')}>English</Button>
          <Button onClick={() => handleLanguageChange('es')}>Español</Button>
        </Box>
      </Box>
    </Container>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setCurrentModule: PropTypes.func.isRequired,
};
