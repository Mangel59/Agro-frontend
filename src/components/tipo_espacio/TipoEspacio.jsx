/**
 * @file TipoEspacio.jsx
 * @module TipoEspacio
 * @description Componente principal para la gestión de tipos de espacios.
 * Permite visualizar, agregar, actualizar y eliminar tipos de espacios con conexión al backend.
 * Incluye formulario (`FormTipoEspacio`), tabla (`GridTipoEspacio`) y notificaciones (`MessageSnackBar`).
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEspacio from "./FormTipoEspacio";
import GridTipoEspacio from "./GridTipoEspacio";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoEspacioRow
 * @property {number} id - ID del tipo de espacio
 * @property {string} nombre - Nombre del tipo de espacio
 * @property {string} descripcion - Descripción del tipo de espacio
 * @property {number} estado - Estado del tipo de espacio (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel del mensaje (success, error, info)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente React para gestionar los tipos de espacios disponibles.
 * Incluye formulario de edición y tabla de visualización.
 *
 * @component
 * @returns {JSX.Element} Componente de administración de tipos de espacios.
 */
export default function TipoEspacio() {
  /** @type {TipoEspacioRow} */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1,
    empresa: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {SnackbarMessage} */
  const defaultMessage = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(defaultMessage);

  /** @type {TipoEspacioRow[]} */
  const [tespacios, setTespacios] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  /**
   * Carga los tipos de espacio desde el backend.
   */
  const reloadData = React.useCallback(() => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/tipo_espacio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const tespaciosData = Array.isArray(response.data)
          ? response.data.map((item) => ({
              id: item.id,
              nombre: item.nombre,
              descripcion: item.descripcion,
              estado: item.estado,
            }))
          : [];
        setTespacios(tespaciosData);
        setError(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error desconocido.";
        setError(errorMessage);
        setMessage({
          open: true,
          severity: "error",
          text: errorMessage,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Espacio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <FormTipoEspacio
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
          />
          <GridTipoEspacio
            setSelectedRow={setSelectedRow}
            reloadData={reloadData}
            tespacios={tespacios}
          />
        </>
      )}
    </div>
  );
}
