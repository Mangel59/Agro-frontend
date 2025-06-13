/**
 * @file Login.jsx
 * @module Login
 * @description Componente de inicio de sesión con soporte para traducción, alternancia de tema, validación de email y enrutamiento dinámico según el estado del usuario.
 * @exports Login
 */

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  useTheme
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
import PropTypes from "prop-types";
import ForgetPassword from './ForgetPassword';

/**
 * Componente de formulario de inicio de sesión.
 * Permite al usuario autenticarse mediante correo y contraseña.
 * Cambia la interfaz según el estado del usuario recibido por el backend.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setIsAuthenticated - Función para actualizar el estado de autenticación global.
 * @param {Function} props.setCurrentModule - Función para establecer el módulo actual después del login.
 * @returns {JSX.Element} Formulario de inicio de sesión.
 */
export default function Login(props) {
  const { t, i18n } = useTranslation(); // Hook de traducción
  const theme = useTheme(); // Accede al tema actual (claro/oscuro)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const toggleTheme = useThemeToggle(); // Alternador de tema personalizado

  /**
   * Alterna la visibilidad del campo de la contraseña.
   */
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  /**
   * Previene la acción predeterminada al presionar el ícono del ojo.
   * @param {React.MouseEvent} event
   */
  const handleMouseDownPassword = (event) => event.preventDefault();

  /**
   * Valida si un email tiene formato válido.
   * @param {string} email - El email a validar.
   * @returns {boolean} true si el formato es válido.
   */
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   * Envía el formulario de login.
   * Realiza autenticación con el backend y redirige según el estado del usuario.
   * @param {React.FormEvent} event - Evento del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(username)) {
      setError(t('invalid_email'));
      return;
    }

    axios.post(import.meta.env.VITE_BACKEND_URI+'/auth/login', {
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
        console.error('There was an error logging in!', error);
      });
  };

  /**
   * Cambia el idioma de la aplicación.
   * @param {string} lng - Código del idioma ('en' o 'es').
   */
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Validación de tipos de props
  Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
    setCurrentModule: PropTypes.func.isRequired,
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
        backgroundColor: theme.palette.background.default,
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
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: theme.shadows[4],
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
            color: theme.palette.primary.main,
          }}
        >
          {t('login')}
        </Typography>

        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <TextField
          label={t("email")}
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label={t("password")}
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

        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          sx={{
            padding: '12px 0',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          {t('login')}
        </Button>
        <Button
          variant="text"
          onClick={() => props.setCurrentModule(<ForgetPassword setCurrentModule={props.setCurrentModule} />)}
          sx={{ color: theme.palette.primary.main }}
        >
          ¿Olvidaste tu contraseña?
        </Button>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 3, color: theme.palette.text.secondary }}
        >
          {t("no_account")}{" "}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
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