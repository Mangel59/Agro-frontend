import * as React from "react";
import axios from "../axiosConfig"; // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";

export default function ProductoCategoria(props) {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [productocategorias, setProductocategorias] = React.useState([]);

  const reloadData = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setMessage({
        open: true,
        severity: "error",
        text: "Token no disponible. Inicie sesión nuevamente.",
      });
      return;
    }
  
    axios.get(`http://172.16.79.156:8080/api/v1/productoCategorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          const productocategoriaData = response.data.map((item) => ({
            ...item,
            id: item.id,
          }));
          setProductocategorias(productocategoriaData);
        } else {
          setProductocategorias([]);
          setMessage({
            open: true,
            severity: "error",
            text: "No se encontraron categorías de productos.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al buscar producto categorías!", error);
        console.log("Detalles del error:", error.response); 
        setProductocategorias([]);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al buscar producto categorías. Revise la conexión o los permisos.",
        });
      });
  };  
  React.useEffect(() => {
    reloadData(); 
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProductoCategoria
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData} 
        productocategorias={productocategorias}
      />
      <GridProductoCategoria
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        productocategorias={productocategorias}
      />
    </div>
  );
}
