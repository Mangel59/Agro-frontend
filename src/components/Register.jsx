// CREADO POR: EMANUEL
// FECHA DE CREACION: 8/08/2024
// MODIFICADO POR: MARIA 16/05/2024, 22/08/2024

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Snackbar, Alert, IconButton, InputAdornment, Link, Switch } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import axios from '../components/axiosConfig';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import AppBarComponent from './dashboard/AppBarComponent'; 

/**
 * Register component handles the registration form, validating user input,
 * and sending data to the backend.
 *
 * @component
 * @example
 * return (
 *   <Register />
 * )
 */
/**
 * Componente Register.
 * @module Register.jsx
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * Register componente principal.
 * @component
 * @returns {JSX.Element}
 */
export default function Register(props) {
  const { t, i18n } = useTranslation(); // Hook de traducción
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const toggleTheme = useThemeToggle();

  const navigate = useNavigate();

  /**
 * Toggles the visibility of the password field.
 */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
 * Prevents the default action when the mouse button is pressed on the password visibility toggle.
 *
 * @param {Event} event - The mouse down event.
 */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
 * Validates if the input is a properly formatted email.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  /**
 * Handles the form submission, validates the input, and sends the registration
 * request to the server.
 *
 * @param {Event} event - The form submit event.
 */
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(username)) {
      setError(t('invalid_email'));
      return;
    }

    /**
 * Validates if the password meets the required criteria:
 * at least 8 characters, one uppercase letter, one digit, and one special character.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
    if (!validatePassword(password)) {
      setError(t('invalid_password'));
      return;
    }
    
    axios.post('http://172.16.79.156:8080/auth/register', {
    //axios.post('http://localhost:8080/auth/register', {
      username,
      password,
    })
    .then(response => {
      // Aquí puedes manejar la respuesta de éxito si es necesario
      setOpenSnackbar(true); // Muestra el Snackbar de éxito
    })
    .catch(error => {
      if (error.response && error.response.status === 403) {
        // Aquí mostramos el mensaje de que el correo ya existe
        setError(t('email ya existe'));
      } else {
        // Otros posibles errores
        setError(t('registration_failed'));
      }
    });
   
    
  };

  /**
 * Changes the language of the application using the i18n library.
 *
 * @param {string} lng - The language code to switch to (e.g., 'en' for English, 'es' for Spanish).
 */
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>

    <Container 
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: 3,
        mt: 8,
      }}
    >

      <Paper 
        elevation={6}
        sx={{ 
          padding: 4, 
          backgroundColor: '#ffffff',
          borderRadius: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: 3,
            }}
          >
            {t('register')}
          </Typography>
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <TextField
            id="email-input"
            label={t("email")}
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': {
                  borderColor: '#1e88e5',
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1e88e5',
              },
            }}
          />
          <TextField
            id="password-input"
            label={t("password")}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': {
                  borderColor: '#1e88e5',
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1e88e5',
              },
            }}
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
          id="register-button"
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{
              padding: '12px 0',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: '#1e88e5',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {t('register')}
          </Button>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ marginTop: 3, color: '#666' }}
          >
            {t("already_have_account")}{" "}
            <Link 
              component={RouterLink} 
              to="/login" 
              sx={{ 
                color: '#1e88e5',
                textDecoration: 'none', 
                fontWeight: 'bold' 
              }}
            >
              {t('login_here')}
            </Link>
          </Typography>

          {/* Botones de cambio de idioma */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Button onClick={() => handleLanguageChange('en')}>English</Button>
            <Button onClick={() => handleLanguageChange('es')}>Español</Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }} timeout="10000">
        {t('registration_success')}
      </Alert>
    </Snackbar>

    </Container>
    </>
  );
}

