/**
 * @file FormMunicipio.jsx
 * @module FormMunicipio
 * @description Componente de formulario para gestionar municipios. Actualmente es un componente base sin implementación visual.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";

/**
 * Componente FormMunicipio.
 *
 * Muestra un formulario para crear o editar un municipio.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {Object} props.selectedRow - Fila actualmente seleccionada.
 * @param {Function} props.setMessage - Función para establecer mensajes (snackbar).
 * @param {Array<Object>} props.municipios - Lista de municipios.
 * @returns {JSX.Element} Componente del formulario.
 */
export default function FormMunicipio({ setSelectedRow, selectedRow, setMessage, municipios }) {
  return (
    <div>
    </div>
  );
}

FormMunicipio.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  setMessage: PropTypes.func.isRequired,
  municipios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
