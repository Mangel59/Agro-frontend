import React, { useMemo, useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "./axiosConfig";

export default function ResetPassword({ token: propToken, setCurrentModule }) {
  const token = propToken || new URLSearchParams(window.location.search).get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reglas mínimas (ajústalas si quieres: mayúscula, número, símbolo, etc.)
  const validatePassword = (pwd = '') => pwd.length >= 8;

  const canSubmit = useMemo(() => {
    return Boolean(token)
      && validatePassword(password)
      && password === confirmPassword
      && !submitting;
  }, [token, password, confirmPassword, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Token no válido o ausente.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setSubmitting(true);

      // Importante: este endpoint es público; tu axiosConfig debería evitar adjuntar Authorization.
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/auth/reset-password`,
        { token, newPassword: password }
      );

      if (data?.success) {
        // Limpia cualquier residuo de sesión local, por si el usuario tenía algo guardado
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('token_expiration');
          localStorage.removeItem('tver');
          localStorage.removeItem('empresaId');
          localStorage.removeItem('rolId');
          localStorage.removeItem('empresaNombre');
          localStorage.removeItem('rolesByCompany');
        } catch { /* no-op */ }

        setMessage('Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión…');
        // Redirige al login (recomendado por el flujo de revocación por tver)
        setTimeout(() => window.location.replace('/login'), 1000);
      } else {
        setError(data?.message || 'Error al restablecer contraseña.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al restablecer contraseña.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 8, p: { xs: 2, md: 0 } }}>
      <Typography variant="h4" gutterBottom>Restablecer Contraseña</Typography>

      {!token && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Enlace inválido o expirado: falta el token.
        </Alert>
      )}

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nueva contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          helperText="Mínimo 8 caracteres."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          error={Boolean(password) && !validatePassword(password)}
        />

        <TextField
          label="Confirmar contraseña"
          type={showConfirm ? 'text' : 'password'}
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
          error={Boolean(confirmPassword) && confirmPassword !== password}
          helperText={confirmPassword && confirmPassword !== password ? 'Las contraseñas no coinciden.' : ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!canSubmit}
        >
          {submitting ? 'Procesando…' : 'Cambiar contraseña'}
        </Button>
      </form>
    </Box>
  );
}
