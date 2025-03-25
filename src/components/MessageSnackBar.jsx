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
export default function MessageSnackBar(props) {
  console.log(props.message);

  /**
   * Maneja el cierre del Snackbar.
   *
   * Evita que se cierre si el motivo es "clickaway", y actualiza el estado del mensaje para cerrarlo.
   *
   * @param {React.SyntheticEvent} event - Evento del cierre.
   * @param {string} reason - Razón del cierre (por ejemplo: 'timeout' o 'clickaway').
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setMessage({
      open: false,
      severity: props.message.severity,
      text: props.message.text
    });
  };

  return (
    <div>
      <Snackbar
        open={props.message.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={props.message.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message.text}
        </Alert>
      </Snackbar>
    </div>
  );
}
