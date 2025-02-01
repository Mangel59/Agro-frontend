import * as React from "react";
import axios from "../axiosConfig";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";
import { SiteProps } from "../dashboard/SiteProps";

export default function Producto(props) {
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
  const [productos, setProductos] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/productos`)
      .then((response) => {
        // Verificar si la respuesta tiene una propiedad 'data' que contiene un array
        if (response.data && Array.isArray(response.data.data)) {
          setProductos(response.data.data); // Ajustar para acceder al array de productos dentro de 'data'
        } else if (Array.isArray(response.data)) {
          setProductos(response.data); // Si la respuesta ya es un array directamente
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar productos: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar productos'
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
        productos={productos}

      />
      <GridProducto
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        productos={productos}
      />
    </div>
  );
}
