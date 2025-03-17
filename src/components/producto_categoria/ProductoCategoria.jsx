
/**
 * ProductoCategoria componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente ProductoCategoria.
 * @module ProductoCategoria.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function ProductoCategoria() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1, // Estado por defecto a activo
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [productocategorias, setProductocategorias] = React.useState([]); // Lista de categorías
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = React.useState(0);

  // Función para recargar los datos desde el backend
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
      
      {/* Mensaje de notificación */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario para crear o editar categorías */}
      <FormProductoCategoria
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />

      {/* Tabla para mostrar las categorías */}
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
