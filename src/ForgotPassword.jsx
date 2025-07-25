import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from './components/axiosConfig';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/auth/forgot-password`, { email });

      // En lugar de redirigir, mostramos un mensaje
      setMessage('Revisa tu correo electrónico. Te hemos enviado un enlace para restablecer tu contraseña.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar correo.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>Recuperar Contraseña</Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          ENVIAR ENLACE DE RECUPERACIÓN
        </Button>
      </form>
    </Box>
  );
}
