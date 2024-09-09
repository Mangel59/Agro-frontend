import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormPersona from "./FormPersona";
import GridPersona from "./GridPersona";
import { SiteProps } from "../dashboard/SiteProps";

export default function Persona(props) {
  const row = {
    id: 0,
    tipoIdentificacionId: 0,
    identificacion: "",
    apellido: "",
    nombre: "",
    genero: "",
    fechaNacimiento: "",
    estrato: 0,
    direccion: "",
    celular: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [personas, setPersonas] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/personas`)
      .then((response) => {
        const personaData = response.data.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setPersonas(personaData);
      })
      .catch((error) => {
        console.error("Error al buscar personas!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPersona
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormPersona
        personas={personas}

      />
      <GridPersona
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        personas={personas}
      />
    </div>
  );
}

