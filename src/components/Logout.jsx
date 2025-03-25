/**
 * @file Logout.js
 * @module Logout
 * @description Función que maneja el cierre de sesión del usuario eliminando el token del almacenamiento local y redirigiendo al inicio.
 */

import axios from 'axios';

/**
 * Componente Logout.
 *
 * Esta función realiza el proceso de cierre de sesión del usuario:
 * - Elimina el token del almacenamiento local.
 * - Redirige al usuario a la página principal.
 * - (Opcional) Podría realizar una solicitud al backend para invalidar el token.
 *
 * @function
 * @memberof module:Logout
 * @returns {Promise<void>} No retorna nada directamente, pero redirige y puede lanzar errores.
 */
const logout = async () => {
  try {
    // Si deseas notificar al backend, puedes descomentar esta línea:
    // await axios.post('http://localhost:8080/auth/logout');

    // Eliminar token local
    localStorage.removeItem('token');

    // Redirigir al inicio
    window.location.href = '/';
  } catch (error) {
    console.error('There was an error logging out!', error);
  }
};

export default logout;
