/**
 * @file Unidad.jsx
 * @module Unidad
 * @description Componente principal para la gestión de unidades. 
 * Carga datos desde la API, maneja paginación, mensajes de estado y renderiza el formulario y la grilla de unidades.
 * @author Karla
 * @exports Unidad
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormUnidad from "./FormUnidad";
import GridUnidad from "./GridUnidad";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} UnidadRow
 * @property {number} id - ID único de la unidad
 * @property {string} nombre - Nombre de la unidad
 * @property {string} descripcion - Descripción de la unidad
 * @property {number} estado - Estado de la unidad (1: Activo, 0: Inactivo)
 * @property {string} empresa - Empresa asociada a la unidad
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el snackbar está visible
 * @property {"success"|"error"|"info"|"warning"} severity - Nivel del mensaje
 * @property {string} text - Texto a mostrar en el mensaje
 */

/**
 * @typedef {Object} PaginationModel
 * @property {number} page - Página actual
 * @property {number} pageSize - Tamaño de página
 */

/**
 * Componente principal para gestionar las unidades.
 *
 * Renderiza una interfaz con un formulario de registro/edición y una grilla con las unidades existentes.
 *
 * @function Unidad
 * @returns {JSX.Element} Interfaz para visualizar y gestionar unidades.
 */
export default function Unidad() {
  /** @type {UnidadRow} */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: "",
  };

  /** @type {React.StateUpdater<UnidadRow>} */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {React.StateUpdater<SnackbarMessage>} */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** @type {React.StateUpdater<UnidadRow[]>} */
  const [unidades, setUnidades] = React.useState([]);

  /** @type {React.StateUpdater<PaginationModel>} */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /** @type {React.StateUpdater<number>} */
  const [rowCount, setRowCount] = React.useState(0);

  /**
   * Carga las unidades desde el backend. Usa el token del localStorage.
   * Muestra mensaje de error si no hay token o si falla la petición.
   *
   * @function reloadData
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
      .get(`${SiteProps.urlbasev1}/unidad`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setUnidades(response.data.data);
          setRowCount(response.data.totalCount || response.data.data.length);
        } else if (Array.isArray(response.data)) {
          setUnidades(response.data);
          setRowCount(response.data.length);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Unidades: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Unidades:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Unidades",
        });
      });
  };

  // Ejecuta la carga inicial al cambiar la paginación
  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormUnidad
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        unidades={unidades}
      />

      <GridUnidad
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        unidades={unidades}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}
