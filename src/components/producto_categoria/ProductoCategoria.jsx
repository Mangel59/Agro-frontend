import * as React from "react";
import axios from "../axiosConfig"; // Usa axios configurado
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";

export default function ProductoCategoria() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 1, // Estado por defecto a activo
  };

  const [selectedRow, setSelectedRow] = React.useState(row); // Fila seleccionada
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [productocategorias, setProductocategorias] = React.useState([]); // Lista de categorías
  const [loading, setLoading] = React.useState(false); // Estado de carga
  const [error, setError] = React.useState(null); // Manejo de errores

  // Función para recargar los datos desde el backend
  const reloadData = () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Token no disponible. Inicie sesión nuevamente.",
      });
      setLoading(false);
      return;
    }

    axios
      .get(`http://172.16.79.156:8080/api/v1/producto_categoria`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setProductocategorias(response.data);
          setError(null); // Limpiar errores si se cargaron datos correctamente
        } else {
          setProductocategorias([]);
          setError("No se encontraron categorías de productos.");
          setMessage({
            open: true,
            severity: "error",
            text: "No se encontraron categorías de productos.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar las categorías de productos:", error);
        setError("Error al cargar las categorías. Intente nuevamente.");
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar las categorías. Verifique su conexión o permisos.",
        });
      })
      .finally(() => {
        setLoading(false); // Terminar estado de carga
      });
  };

  React.useEffect(() => {
    reloadData(); // Cargar datos al montar el componente
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Producto Categoria</h1>
      {/* Mensaje de notificación */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>
          {error}
        </div>
      ) : (
        <>
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
            reloadData={reloadData}
          />
        </>
      )}
    </div>
  );
}
