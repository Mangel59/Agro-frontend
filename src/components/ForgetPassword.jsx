/**
 * @file ForgetPassword.jsx
 * @module ForgetPassword
 * @description Componente que permite recuperar la contraseña mediante el envío de un enlace al correo electrónico.
 * @author Karla
 * @modified Maria
 */

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Switch
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from './axiosConfig';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import AppBarComponent from './dashboard/AppBarComponent';

/**
 * Componente ForgetPassword.
 *
 * Muestra un formulario que permite al usuario ingresar su correo electrónico
 * para solicitar un enlace de recuperación de contraseña.
 *
 * @function ForgetPassword
 * @name ForgetPassword
 * @memberof module:ForgetPassword
 * @returns {JSX.Element} Vista del formulario de recuperación de contraseña.
 */
const ForgetPassword = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const toggleTheme = useThemeToggle();

  /**
   * Maneja el envío del formulario y ejecuta la solicitud de recuperación.
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError(t('invalid_email'));
      return;
    }

    axios.post('http://tu-api.com/auth/forgot-password', { email })
      .then(() => {
        setSuccess(t('registration_success'));
      })
      .catch((error) => {
        setError(t('login_error'));
        console.error('There was an error!', error);
      });
  };

  /**
   * Cambia el idioma actual de la aplicación.
   * @param {string} lng - Código de idioma (por ejemplo, 'en' o 'es')
   */
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
        mt: 5,
      }}
    >
      <AppBarComponent switchComponent={<Switch onChange={toggleTheme} />} />

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
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          sx={{
            padding: '6px',
            borderRadius: 3,
            minWidth: 'auto',
            width: '36px',
            height: '36px',
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </Button>

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
          {t('Recover Password')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label={t('email')}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <Button
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
          {t('Send recovery link')}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button onClick={() => handleLanguageChange('en')}>English</Button>
          <Button onClick={() => handleLanguageChange('es')}>Español</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
