
/**
 * FormPais componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import PropTypes from "prop-types";

/**
 * Componente FormPais.
 * @module FormPais.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormPais({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  return <div>Formulario de Países</div>;
}

// Definición de PropTypes para evitar errores de validación
FormPais.propTypes = {
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
