// CREADO POR: EMANUEL
// FECHA DE CREACION: 8/08/2024
// MODIFICADO POR: MARIA 16/05/2024, 22/08/2024, 15/07/2025

import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Paper,
  Alert, IconButton, InputAdornment, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

export default function Register() {
  const { t } = useTranslation();
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateEmail(username)) {
      setError(t('invalid_email'));
      return;
    }

    if (!validatePassword(password)) {
      setError(t('invalid_password'));
      return;
    }

    axios.post(import.meta.env.VITE_BACKEND_URI + '/auth/register', { username, password })
      .then(() => {
        setSuccessMessage("Se ha enviado un email, por favor revisar su correo.");
      })
      .catch(error => {
        if (error.response?.status === 403) {
          setError(t('email ya existe'));
        } else {
          setError(t('Ya se ha enviado un email de verificación, por favor revisar su correo.'));
        }
      });
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
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          backgroundColor: theme.palette.background.paper,
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
              color: theme.palette.text.primary,
              marginBottom: 3,
            }}
          >
            {t('register')}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <TextField
            id="email-input"
            label={t("email")}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            id="password-input"
            label={t("password")}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            id="register-button"
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              padding: '12px 0',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {t('register')}
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 3, color: theme.palette.text.secondary }}
          >
            {t("already_have_account")}{" "}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              {t('login_here')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
