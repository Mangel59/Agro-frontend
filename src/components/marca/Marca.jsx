/**
 * @file Marca.jsx
 * @module Marca
 * @description Componente principal para gestionar marcas. Incluye formulario, grilla, paginación, ordenamiento y filtros conectados al backend con autenticación vía token JWT. El listado de marcas se gestiona desde el servidor y se representa en una tabla editable con Material-UI DataGrid.
 * @author Karla
 */

import React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} MarcaRow
 * @property {number} id - ID de la marca.
 * @property {string} nombre - Nombre de la marca.
 * @property {string} descripcion - Descripción de la marca.
 * @property {number} estado - Estado de la marca (1 = Activo, 0 = Inactivo).
 * @property {string|number} empresa - Empresa asociada a la marca.
 */

/**
 * Componente principal `Marca`.
 * Administra el CRUD de marcas y la vista de tabla con paginación y ordenamiento.
 *
 * @returns {JSX.Element} Componente completo con formulario y tabla.
 */
export default function Marca() {
  /** Marca vacía como valor inicial para selección */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: "",
  };

  /** Marca seleccionada actualmente */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** Estado del snackbar para mostrar mensajes */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** Lista de marcas obtenidas desde el backend */
  const [marcas, setMarcas] = React.useState([]);

  /** Modelo de paginación de la grilla */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /** Total de registros para la paginación */
  const [rowCount, setRowCount] = React.useState(0);

  /** Modelo de ordenamiento aplicado a la tabla */
  const [sortModel, setSortModel] = React.useState([]);

  /** Modelo de filtros aplicado a la tabla */
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  /**
   * Carga la lista de marcas desde el backend aplicando
   * paginación y ordenamiento con token de autenticación.
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
      .get(`${SiteProps.urlbasev1}/marca`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sort: sortModel[0]?.field,
          order: sortModel[0]?.sort,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setMarcas(response.data.data);
          setRowCount(response.data.totalCount || response.data.data.length);
        } else if (Array.isArray(response.data)) {
          setMarcas(response.data);
          setRowCount(response.data.length);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Marcas: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Marcas:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Marcas",
        });
      });
  };

  /**
   * Hook que recarga los datos cada vez que cambian
   * los parámetros de paginación o de ordenamiento.
   */
  React.useEffect(() => {
    reloadData();
  }, [paginationModel, sortModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Marca</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormMarca
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        marcas={marcas}
      />

      <GridMarca
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        marcas={marcas}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
      />
    </div>
  );
}
