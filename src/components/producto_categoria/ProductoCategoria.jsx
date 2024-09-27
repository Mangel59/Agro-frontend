import * as React from "react";
import axios from "../axiosConfig";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormProductoCategoria from "./FormProductoCategoria";
import GridProductoCategoria from "./GridProductoCategoria";
import { SiteProps } from "../dashboard/SiteProps";

export default function ProductoCategoria(props) {
  const row = {
    id: 0,
    nombre: "",
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
  const [productocategorias, setProductocategorias] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/productoCategorias`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) { // Verificar que response.data es un array
          const productocategoriaData = response.data.map((item) => ({
            ...item,
            id: item.id,
          }));
          setProductocategorias(productocategoriaData);
        } else {
          setProductocategorias([]);  // Si no hay datos, establece una lista vacía
          console.error("No se encontraron categorias de productos!");
        }
      })
      .catch((error) => {
        console.error("Error al buscar producto categorias!", error);
        setProductocategorias([]);  // En caso de error, establece una lista vacía
      });
  };
  
  
  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProductoCategoria
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormProductocategoria
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

