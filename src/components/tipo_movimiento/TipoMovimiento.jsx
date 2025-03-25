/**
 * @file TipoMovimiento.jsx
 * @module TipoMovimiento
 * @description Componente principal para gestionar Tipos de Movimiento: formulario, grilla, mensajes y recarga de datos.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoMovimiento from "./FormTipoMovimiento";
import GridTipoMovimiento from "./GridTipoMovimiento";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoMovimientoRow
 * @property {number} id - ID del tipo de movimiento
 * @property {string} nombre - Nombre del tipo de movimiento
 * @property {string} descripcion - Descripción del tipo de movimiento
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 * @property {number} empresa - ID de la empresa asociada
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje snackbar está visible
 * @property {string} severity - Nivel de severidad del mensaje ("success", "error", etc.)
 * @property {string} text - Contenido del mensaje que se mostrará
 */

/**
 * Componente principal para la gestión de Tipos de Movimiento.
 *
 * @component
 * @returns {JSX.Element} Interfaz de administración para tipos de movimiento.
 */
export default function TipoMovimiento() {
  /**
   * Fila inicial vacía.
   * @type {TipoMovimientoRow}
   */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: 0,
  };

  /** @type {React.MutableRefObject<TipoMovimientoRow>} */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {React.MutableRefObject<SnackbarMessage>} */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** @type {Array<TipoMovimientoRow>} */
  const [tiposMovimiento, setTiposMovimiento] = React.useState([]);

  /** @type {{page: number, pageSize: number}} */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /**
   * Carga los datos desde la API.
   * @returns {void}
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
      .get(`${SiteProps.urlbasev1}/tipo_movimiento`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTiposMovimiento(response.data);
        } else if (Array.isArray(response.data.data)) {
          setTiposMovimiento(response.data.data);
        } else {
          console.error("La respuesta no es un array válido:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Tipos de Movimiento: respuesta no válida.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Tipos de Movimiento:", error);
        if (error.response && error.response.status === 403) {
          setMessage({
            open: true,
            severity: "error",
            text: "Error: No tienes permisos para cargar los Tipos de Movimiento.",
          });
        } else {
          setMessage({
            open: true,
            severity: "error",
            text: `Error al cargar Tipos de Movimiento: ${error.message}`,
          });
        }
      });
  };

  // Cargar los datos al cambiar la paginación
  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Tipo Movimiento</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoMovimiento
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        tiposMovimiento={tiposMovimiento}
      />
      <GridTipoMovimiento
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tiposMovimiento={tiposMovimiento}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}
