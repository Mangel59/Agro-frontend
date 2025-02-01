import * as React from "react";
import axios from "../axiosConfig";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacion from "./FormPresentacion";
import GridPresentacion from "./GridPresentacion";
import { SiteProps } from "../dashboard/SiteProps";

export default function Presentacion (props) {
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
  const [Presentacion, setPresentacion] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/presentaciones`)
      .then((response) => {
        // Verificar si la respuesta tiene una propiedad 'data' que contiene un array
        if (response.data && Array.isArray(response.data.data)) {
          setPresentacion(response.data.data); // Ajustar para acceder al array de Presentacion dentro de 'data'
        } else if (Array.isArray(response.data)) {
          setPresentacion(response.data); // Si la respuesta ya es un array directamente
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar Presentacion: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar Presentacion:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar Presentacion'
        });
      });
  };  
  React.useEffect(() => {
    reloadData();  // Llama al cargar el componente
  }, []);
  
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Presentacion</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormPresentacion
        Presentacion={Presentacion}

      />
      <GridPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        Presentacion={Presentacion}
      />
    </div>
  );
}
