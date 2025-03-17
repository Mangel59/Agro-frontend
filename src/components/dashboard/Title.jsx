
/**
 * Title componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

/**
 * Componente Title que renderiza un título estilizado utilizando Material-UI.
 * 
 * @param {Object} props - Props del componente.
 * @param {ReactNode} props.children - Contenido que se mostrará dentro del título.
 * @returns {JSX.Element} Un componente Typography que representa un título.
 */
function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

// Definición de las propiedades esperadas para el componente Title
Title.propTypes = {
  children: PropTypes.node,
};

export default Title;