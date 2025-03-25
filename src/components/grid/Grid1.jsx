/**
 * @file Grid1.jsx
 * @module Grid1
 * @description Componente contenedor que encapsula la vista principal del sistema, renderizando el componente <Home />.
 * @author Karla
 */

import * as React from 'react';
import Home from '../Home';

/**
 * Componente `Grid1`.
 * Renderiza el componente principal de la interfaz, el cual se encuentra en `Home.jsx`.
 *
 * @function
 * @returns {JSX.Element} Estructura principal de la interfaz renderizada.
 */
export default function Grid1() {
  return <Home />;
}
