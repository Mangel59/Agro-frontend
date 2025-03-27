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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';
import AppBarComponent from './dashboard/AppBarComponent';
import axios from './axiosConfig';
import Login from './Login';
import { useTheme } from '@mui/material/styles';

/**
 * Componente para recuperar la contraseña.
 *
 * @component
 */
const ForgetPassword = ({ setCurrentModule }) => {
  const { t, i18n } = useTranslation();
  const toggleTheme = useThemeToggle();
  const theme = useTheme(); // 🔥 Usamos el tema MUI para modo claro/oscuro

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Correo inválido.' });
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('email', email);

      await axios.post('/auth/forgot-password', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      setStatus({
        type: 'success',
        message: 'Se ha enviado un enlace de recuperación a tu correo.'
      });
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      setStatus({
        type: 'error',
        message: 'No se pudo enviar el enlace. Intenta más tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lng) => i18n.changeLanguage(lng);

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
        mt: 5
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
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentModule(<Login setCurrentModule={setCurrentModule} />)}
          sx={{
            padding: '6px',
            borderRadius: 3,
            minWidth: 'auto',
            width: '36px',
            height: '36px'
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
            color: theme.palette.text.primary
          }}
        >
          Recuperar contraseña
        </Typography>

        {status.message && (
          <Alert severity={status.type}>{status.message}</Alert>
        )}

        <TextField
          label="Correo electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            padding: '12px 0',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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
