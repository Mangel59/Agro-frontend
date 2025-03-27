/**
 * Login componente principal.
 * @module Login.jsx
 * @component
 * @returns {JSX.Element}
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
import { useTheme } from '@mui/material/styles';
import ForgetPassword from './ForgetPassword';
import FormRegistroPersona from './seguridad/FormRegistroPersona';
import FormRegistroEmpresa from './seguridad/FormRegistroEmpresa';
import Contenido from '../components/dashboard/Contenido';
import PropTypes from "prop-types";

export default function Login(props) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        console.error('Login error:', error);
      });
  };

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
          boxShadow: theme.shadows[5],
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
        >
          {t('login')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

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
          startIcon={<LoginIcon />}
          fullWidth
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

        <Typography variant="body2" align="center">
          {t("no_account")}{" "}
          <Link
            component={RouterLink}
            to="/register"
            sx={{ color: theme.palette.primary.main }}
          >
            {t('register_here')}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
