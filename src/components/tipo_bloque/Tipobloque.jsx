/**
 * @file TipoBloque.jsx
 * @module TipoBloque
 * @description Componente principal para gestionar los tipos de bloque del sistema. 
 * Contiene formulario, grilla y manejo de estado y errores. Se conecta al backend para cargar datos dinámicamente.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoBloque from "./FormTipoBloque";
import GridTipoBloque from "./GridTipoBloque";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoBloqueRow
 * @property {number} id - ID del tipo de bloque
 * @property {string} nombre - Nombre del tipo de bloque
 * @property {string} descripcion - Descripción del tipo de bloque
 * @property {number} estado - Estado del tipo de bloque (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje está visible
 * @property {string} severity - Severidad del mensaje (success, error, etc.)
 * @property {string} text - Texto del mensaje a mostrar
 */

/**
 * Componente principal para gestionar los tipos de bloque.
 * Este componente muestra un formulario para crear o editar tipos de bloque,
 * y una grilla con la lista de tipos registrados. También maneja la carga de datos desde el backend,
 * el estado de errores y los mensajes tipo snackbar.
 *
 * @function TipoBloque
 * @returns {JSX.Element} Elemento JSX renderizado
 */
export default function TipoBloque() {
  /** @type {TipoBloqueRow} */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState(
    /** @type {SnackbarMessage} */ ({ open: false, severity: "success", text: "" })
  );
  const [bloques, setBloques] = React.useState(
    /** @type {TipoBloqueRow[]} */ ([]));
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(
    /** @type {string | null} */ (null)
  );

  /**
   * Carga los tipos de bloque desde el backend.
   * Actualiza el estado de la lista de bloques.
   */
  const reloadData = React.useCallback(() => {
    setLoading(true);
    axios
      .get(`${SiteProps.urlbasev1}/tipo_bloque`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setBloques(data);
        setError(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error al cargar datos.";
        setError(errorMessage);
        setMessage({ open: true, severity: "error", text: errorMessage });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    reloadData();
  }, [reloadData]);

  /**
   * Cierra el snackbar de mensaje.
   */
  const handleMessageClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>Tipo Bloque</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <FormTipoBloque
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            addTipoBloque={() => {}}
            updateTipoBloque={() => {}}
            reloadData={reloadData}
          />
          <GridTipoBloque bloques={bloques} setSelectedRow={setSelectedRow} />
        </>
      )}
    </div>
  );
}
