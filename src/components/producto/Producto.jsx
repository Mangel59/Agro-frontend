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
    axios
      .get(`${SiteProps.urlbasev1}/productos`)
      .then((response) => {
        const productoData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setProductos(productoData);
      })
      .catch((error) => {
        console.error("Error al buscar productos!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
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

