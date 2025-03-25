/**
 * @file KardexNuevo.jsx
 * @module KardexNuevo
 * @author Karla
 * @description Componente principal que envuelve el formulario `FormKardexNuevo`
 *              y gestiona el estado de los mensajes del sistema.
 */

import React, { useState } from 'react';
import FormKardexNuevo from './FormKardexNuevo';

/**
 * Componente KardexNuevo.
 * Envuelve el formulario de Kardex y pasa el estado del mensaje al subcomponente.
 *
 * @returns {JSX.Element} Componente contenedor para el formulario de Kardex con manejo de mensajes.
 */
export default function KardexNuevo() {
  /**
   * Estado para manejar los mensajes del sistema.
   * @type {{ open: boolean, severity: string, text: string }}
   */
  const [message, setMessage] = useState({ open: false, severity: 'info', text: '' });

  return (
    <div>
      {/* Pasa la función setMessage al formulario para que pueda mostrar mensajes */}
      <FormKardexNuevo setMessage={setMessage} />
    </div>
  );
}
