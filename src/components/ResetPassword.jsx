import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from "./axiosConfig";

export default function ResetPassword({ token: propToken, setCurrentModule }) {
  const token = propToken || new URLSearchParams(window.location.search).get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Token no válido o ausente.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      if (response.data.success) {
        setMessage('Contraseña restablecida exitosamente. Puedes iniciar sesión.');
      } else {
        setError(response.data.message || 'Error al restablecer contraseña.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer contraseña.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>Restablecer Contraseña</Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nueva contraseña"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirmar contraseña"
          type="password"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Cambiar contraseña
        </Button>
      </form>
    </Box>
  );
}
