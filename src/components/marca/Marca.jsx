/**
 * @file Marca.jsx
 * @module Marca
 * @author Karla
 * @description Componente principal para gestionar marcas. Incluye formulario, grilla, paginación, ordenamiento y filtros.
 */

import React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Marca.
 * Muestra el listado de marcas y permite crear, editar y eliminar registros.
 *
 * @returns {JSX.Element} Componente principal con formulario y grilla de marcas.
 */
export default function Marca() {
  /**
   * Valor inicial para una marca vacía.
   * @type {{id: number, nombre: string, descripcion: string, estado: number, empresa: string}}
   */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    empresa: "",
  };

  /** Marca seleccionada en la grilla */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** Estado del mensaje del snackbar */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** Lista de marcas cargadas desde el backend */
  const [marcas, setMarcas] = React.useState([]);

  /** Modelo de paginación */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /** Número total de filas (rowCount) */
  const [rowCount, setRowCount] = React.useState(0);

  /** Modelo de ordenamiento */
  const [sortModel, setSortModel] = React.useState([]);

  /** Modelo de filtros aplicado a la tabla */
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  /**
   * Carga los datos de marcas desde el backend, aplicando paginación y ordenamiento.
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
   * Efecto que se ejecuta al montar el componente y cada vez que cambian la paginación o el ordenamiento.
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
