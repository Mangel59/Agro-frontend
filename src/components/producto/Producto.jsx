
/**
 * Producto componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "../axiosConfig";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Producto.
 * @module Producto.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Producto() {
  const row = {
    id: 0,
    nombre: "",
    productoCategoriaId: 0,
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [producto, setProductos] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producto`)
      .then((response) => {
        // Ajuste para acceder a 'content'
        if (response.data && Array.isArray(response.data.content)) {
          setProductos(response.data.content); // Usa 'content' en lugar de 'data'
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
    reloadData();  // Llama al cargar el componente
  }, []);
  
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Producto</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProducto
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormProducto
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
