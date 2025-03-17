/**
 * FormDepartamento componente principal.
 *
 * Este componente se encarga de manejar el estado del formulario para departamentos.
 * No tiene UI visible, pero sincroniza los datos desde una fila seleccionada.
 *
 * @module FormDepartamento
 * @component
 * @returns {JSX.Element} Elemento JSX nulo, sin renderizado visual.
 */

import * as React from "react";
import PropTypes from "prop-types";

/**
 * Componente funcional que sincroniza datos del departamento sin mostrar UI.
 *
 * @param {Object} props - Props del componente.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {function} props.setMessage - Función para mostrar mensajes.
 * @param {{ id: number, name: string }} [props.selectedRow] - Fila seleccionada.
 * @param {function} [props.reloadData] - Función opcional para recargar los datos.
 * @returns {JSX.Element} Nada (null).
 */
export default function FormDepartamento(props) {
  const [formData, setFormData] = React.useState({ name: "" });

  React.useEffect(() => {
    if (props.selectedRow) {
      setFormData({ name: props.selectedRow.name || "" });
    }
  }, [props.selectedRow]);

  console.log("Datos del formulario: ", formData);

  return null; // No renderiza UI
}

// ✅ Validación de props con PropTypes
FormDepartamento.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  reloadData: PropTypes.func,
};
