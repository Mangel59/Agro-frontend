/**
 * @file ProductoCategoria.jsx
 * @module ProductoCategoria
 * @description Componente principal para gestionar categorías de productos. Permite listar, crear, actualizar y eliminar categorías usando un formulario y una grilla. Usa paginación desde el backend y muestra mensajes con Snackbar.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} ProductoCategoriaRow
 * @property {number} id - ID de la categoría de producto.
 * @property {string} nombre - Nombre de la categoría.
 * @property {string} descripcion - Descripción de la categoría.
 * @property {number} estado - Estado (1: activo, 0: inactivo).
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el Snackbar está visible.
 * @property {string} severity - Tipo del mensaje (success, error, etc.).
 * @property {string} text - Contenido del mensaje.
 */

/**
 * @typedef {Object} PaginationModel
 * @property {number} page - Número de página actual.
 * @property {number} pageSize - Tamaño de página.
 */

/**
 * Componente ProductoCategoria
 *
 * @returns {JSX.Element}
 */
export default function ProductoCategoria() {
  /** @type {ProductoCategoriaRow} */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1,
  };

  /** @type {React.State<ProductoCategoriaRow>} */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {React.State<SnackbarMessage>} */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** @type {React.State<ProductoCategoriaRow[]>} */
  const [productocategorias, setProductocategorias] = React.useState([]);

  /** @type {React.State<PaginationModel>} */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /** @type {React.State<number>} */
  const [rowCount, setRowCount] = React.useState(0);

  /**
   * Recarga los datos de categorías desde la API.
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
      .get(`${SiteProps.urlbasev1}/producto_categoria`, {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Respuesta de la API:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setProductocategorias(response.data.data);
          setRowCount(response.data.totalCount || response.data.data.length);
        } else if (Array.isArray(response.data)) {
          setProductocategorias(response.data);
          setRowCount(response.data.length);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar categorías de productos: respuesta no válida.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías de productos:", error);

        let errorMessage = "Error al cargar categorías de productos.";
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        }

        setMessage({
          open: true,
          severity: "error",
          text: errorMessage,
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Producto Categoría</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormProductoCategoria
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />

      <GridProductoCategoria
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        productocategorias={productocategorias}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </div>
  );
}
