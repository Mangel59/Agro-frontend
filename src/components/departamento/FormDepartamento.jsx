import * as React from "react";
import PropTypes from "prop-types";

export default function FormMunicipio(props) {
  const [formData, setFormData] = React.useState({ name: "" });

  // Efecto para actualizar el estado del formulario cuando cambia la fila seleccionada
  React.useEffect(() => {
    if (props.selectedRow) {
      setFormData({ name: props.selectedRow.name || "" });
    }
  }, [props.selectedRow]);

  // Solo una visualización simple del estado para mostrar cómo se actualiza `formData`
  console.log("Datos del formulario: ", formData);

  return null; // Retornamos null ya que no se quiere mostrar contenido
}

// Definición de PropTypes
FormMunicipio.propTypes = {
  setSelectedRow: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  reloadData: PropTypes.func,
};
