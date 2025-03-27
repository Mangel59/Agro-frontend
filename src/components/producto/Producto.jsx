/**
 * @file Producto.jsx
 * @module Producto
 * @description Componente principal para la gestión de productos. Permite visualizar, crear, actualizar y eliminar productos mediante un formulario y una grilla interactiva.
 * @author Karla
 */

import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} ProductoRow
 * @property {number} id - ID del producto.
 * @property {string} nombre - Nombre del producto.
 * @property {number} productoCategoriaId - ID de la categoría del producto.
 * @property {string} descripcion - Descripción del producto.
 * @property {number} estado - Estado del producto (1: activo, 0: inactivo).
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje snackbar está visible.
 * @property {string} severity - Tipo de mensaje (success, error, warning, info).
 * @property {string} text - Texto a mostrar en el mensaje.
 */

/**
 * Componente principal para la gestión de productos.
 *
 * @component
 * @returns {JSX.Element} Componente de gestión de productos.
 */
export default function Producto() {
  /** @type {ProductoRow} */
  const row = {
    id: 0,
    nombre: "",
    productoCategoriaId: 0,
    descripcion: "",
    estado: 0,
  };

  /** @type {React.MutableRefObject<ProductoRow>} */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** @type {SnackbarMessage} */
  const initialMessage = {
    open: false,
    severity: "success",
    text: "",
  };

  /** @type {React.MutableRefObject<SnackbarMessage>} */
  const [message, setMessage] = React.useState(initialMessage);

  /** @type {ProductoRow[]} */
  const [producto, setProductos] = React.useState([]);

  /**
   * Función para recargar los productos desde la API.
   * Muestra un mensaje de error si la respuesta no es válida.
   *
   * @function
   * @returns {void}
   */
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producto`)
      .then((response) => {
        console.log("Respuesta recibida:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
          setProductos(response.data.content);
        } else if (Array.isArray(response.data)) {
          setProductos(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar producto: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar producto:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar producto",
        });
      });
  };

  // Se ejecuta al montar el componente
  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Producto</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProducto
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        producto={producto}
      />
      <GridProducto
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        producto={producto}
      />
    </div>
  );
}
