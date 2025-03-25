/**
 * @file Producto.jsx
 * @module Producto
 * @description Componente principal para gestionar productos. Permite visualizar, crear, editar y eliminar productos desde una API.
 * @author Karla
 */

import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Producto.
 *
 * @component
 * @returns {JSX.Element} Interfaz para visualizar y gestionar productos
 */
export default function Producto() {
  /**
   * Estado inicial del producto.
   * @type {Object}
   */
  const row = {
    id: 0,
    nombre: "",
    productoCategoriaId: 0,
    descripcion: "",
    estado: 0,
  };

  /**
   * Fila seleccionada.
   * @type {Object}
   */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /**
   * Estado para mostrar mensajes (snackbar).
   * @type {{open: boolean, severity: string, text: string}}
   */
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  /**
   * Estado del mensaje.
   * @type {{open: boolean, severity: string, text: string}}
   */
  const [message, setMessage] = React.useState(messageData);

  /**
   * Lista de productos cargados desde la API.
   * @type {Array<Object>}
   */
  const [producto, setProductos] = React.useState([]);

  /**
   * Recarga los productos desde el backend.
   * @function
   * @returns {void}
   */
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producto`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.content)) {
          setProductos(response.data.content);
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar producto: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar producto:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar producto'
        });
      });
  };

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
