
/**
 * KardexNuevo componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useState } from 'react';
import FormKardexNuevo from './FormKardexNuevo';

/**
 * Componente principal que envuelve `FormKardexNuevo` y maneja mensajes de estado.
 * 
 * @function KardexNuevo
 * @returns {JSX.Element} Componente contenedor para el formulario de Kardex.
 */
/**
 * Componente KardexNuevo.
 * @module KardexNuevo.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function KardexNuevo() {
  // Estado para manejar el mensaje de notificación o alerta
  const [message, setMessage] = useState({ open: false, severity: 'info', text: '' });

  return (
    <div>
      {/* Pasa la función setMessage al formulario para que pueda mostrar mensajes */}
      <FormKardexNuevo setMessage={setMessage} />
    </div>
  );
}