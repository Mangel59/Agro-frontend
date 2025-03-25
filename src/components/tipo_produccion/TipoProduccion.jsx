/**
 * @file TipoProduccion.jsx
 * @module TipoProduccion
 * @description Componente principal para gestionar Tipos de Producción: formulario, grilla, mensajes y recarga de datos.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoProduccion from "./FormTipoProduccion";
import GridTipoProduccion from "./GridTipoProduccion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoProduccionRow
 * @property {number} id - ID del tipo de producción
 * @property {string} nombre - Nombre del tipo de producción
 * @property {string} descripcion - Descripción del tipo de producción
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el snackbar está abierto
 * @property {string} severity - Severidad del mensaje ("success", "error", "info", etc.)
 * @property {string} text - Texto a mostrar en el snackbar
 */

/**
 * Componente principal para la gestión de Tipos de Producción.
 * @component
 * @returns {JSX.Element} Interfaz de administración para tipos de producción.
 */
export default function TipoProduccion() {
  /** @type {TipoProduccionRow} */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  /** Estado: fila actualmente seleccionada */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** Estado: lista de tipos de producción */
  const [tiposProduccion, setTiposProduccion] = React.useState([]);

  /** @type {SnackbarMessage} */
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  /** Estado: mensaje actual de Snackbar */
  const [message, setMessage] = React.useState(messageData);

  /** Referencia a la grilla de tipos de producción */
  const gridRef = React.useRef(null);

  /**
   * Carga los datos desde la API y recarga la grilla.
   * @function
   */
  const reloadData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Error: Token de autenticación no encontrado.",
      });
      return;
    }

    axios
      .get(`${SiteProps.urlbasev1}/tipo_produccion`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTiposProduccion(response.data || []);
        if (gridRef.current && typeof gridRef.current.reloadData === "function") {
          gridRef.current.reloadData();
        }
      })
      .catch((error) => {
        console.error("Error al cargar Tipos de Producción:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Tipos de Producción",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Producción</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
      <GridTipoProduccion
        innerRef={gridRef}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
    </div>
  );
}
