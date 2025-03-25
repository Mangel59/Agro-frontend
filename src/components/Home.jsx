/**
 * @file Home.jsx - Componente que centraliza la navegación entre módulos como Persona, Tipo de Identificación y PerfilGroup.
 * @module Home
 * @exports Home
 */

import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Componente principal de navegación que muestra el módulo actual renderizado dinámicamente.
 *
 * @function Home
 * @param {Object} props - Props del componente.
 * @param {JSX.Element} props.currentModule - El componente o módulo actual que debe renderizarse.
 * @returns {JSX.Element} Vista principal con el módulo seleccionado.
 */
export default function Home({ currentModule }) {
  return (
    <Box sx={{ padding: 2 }}>
      {currentModule}
    </Box>
  );
}

Home.propTypes = {
  currentModule: PropTypes.element,
};
