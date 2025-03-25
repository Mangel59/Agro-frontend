/**
 * @file FormPais.jsx
 * @module FormPais
 * @description Componente formulario para gestionar la información de países. Actualmente es una estructura básica para pruebas o futuros formularios.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";

/**
 * Componente FormPais.
 *
 * Muestra un formulario (placeholder) para gestión de países.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.selectedRow - Fila actualmente seleccionada en la tabla.
 * @param {function(Object): void} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {function(Object): void} props.setMessage - Función para mostrar mensajes tipo snackbar.
 * @param {function(): void} props.reloadData - Función para recargar los datos desde el backend.
 * @returns {JSX.Element} Elemento JSX que representa el formulario (actualmente un placeholder).
 */
export default function FormPais({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  return <div></div>;
}

FormPais.propTypes = {
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
