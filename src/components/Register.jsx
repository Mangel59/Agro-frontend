/**
 * @file Register.jsx
 * @module Register
 * @description Componente que maneja el formulario de registro de usuario, validaciones y conexión con el backend.
 * @author Emanuel
 * @created 2024-08-08
 * @modified Maria 2024-05-16, 2024-08-22
 */

import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Paper, Snackbar,
  Alert, IconButton, InputAdornment, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeToggle } from './dashboard/ThemeToggleProvider';

/**
 * Muestra/oculta la contraseña.
 * @function handleClickShowPassword
 * @returns {void}
 */

/**
 * Prevenir comportamiento por defecto al hacer clic para mostrar contraseña.
 * @function handleMouseDownPassword
 * @param {React.MouseEvent} event
 * @returns {void}
 */

/**
 * Valida si el correo es válido.
 * @function validateEmail
 * @param {string} email
 * @returns {boolean}
 */

/**
 * Valida si la contraseña cumple con los requisitos.
 * @function validatePassword
 * @param {string} password
 * @returns {boolean}
 */

/**
 * Envía los datos al backend para registrar un nuevo usuario.
 * @function handleSubmit
 * @param {React.FormEvent} event
 * @returns {void}
 */

/**
 * Cambia el idioma de la app.
 * @function handleLanguageChange
 * @param {string} lng - Código del idioma (ej: 'en', 'es').
 * @returns {void}
 */

/**
 * Componente Register. Muestra un formulario para registrar nuevos usuarios.
 *
 * @function
 * @name Register
 * @memberof module:Register
 * @returns {JSX.Element}
 */
export default function Register() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const toggleTheme = useThemeToggle();
  const navigate = useNavigate();

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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(username)) {
      setError(t('invalid_email'));
      return;
    }

    if (!validatePassword(password)) {
      setError(t('invalid_password'));
      return;
    }

    axios.post('http://172.16.79.156:8080/auth/register', {
      username,
      password,
    })
    .then(() => {
      setOpenSnackbar(true);
    })
    .catch(error => {
      if (error.response?.status === 403) {
        setError(t('email ya existe'));
      } else {
        setError(t('registration_failed'));
      }
    });
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Container>{/* ...formulario como ya lo tienes... */}</Container>
  );
}
