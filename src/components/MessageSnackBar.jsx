/**
 * @file MessageSnackBar.jsx
 * @module MessageSnackBar
 * @description Componente reutilizable que muestra una notificación (Snackbar) con mensaje y nivel de severidad.
 * Utiliza Material UI para mostrar alertas con autodesaparición.
 */

import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

/**
 * Componente MessageSnackBar.
 *
 * Muestra una notificación flotante (Snackbar) con un mensaje y un nivel de severidad visual,
 * utilizando los componentes `Snackbar` y `Alert` de Material UI.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.message - Objeto con los datos del mensaje.
 * @param {boolean} props.message.open - Indica si el mensaje está visible o no.
 * @param {string} props.message.text - Texto del mensaje que se desea mostrar.
 * @param {('success'|'info'|'warning'|'error')} props.message.severity - Nivel de severidad del mensaje.
 * @param {Function} props.setMessage - Función para actualizar el estado del mensaje (cerrarlo).
 * @returns {JSX.Element} Componente que muestra una alerta Snackbar con severidad y texto personalizados.
 */
export default function MessageSnackBar({ message = {}, setMessage }) {
  const { open = false, severity = "info", text = "" } = message;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    setMessage({ open: false, severity, text });
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
}
