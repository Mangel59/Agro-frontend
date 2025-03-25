/**
 * @file Deposits.jsx
 * @module Deposits
 * @description Componente que muestra los depósitos recientes con una opción para ver el balance.
 * @component
 */

import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../../codes/Title';

/**
 * Función para prevenir el comportamiento por defecto del enlace.
 *
 * @param {React.MouseEvent} event - El evento del clic.
 */
function preventDefault(event) {
  event.preventDefault();
}

/**
 * Componente Deposits.
 *
 * Muestra un resumen de los depósitos recientes y un enlace para ver el balance.
 *
 * @returns {JSX.Element} El componente renderizado.
 */
export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
