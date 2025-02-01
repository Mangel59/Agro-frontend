import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormPersona from "./FormPersona";
import GridPersona from "./GridPersona";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Persona gestiona el módulo de personas, integrando el formulario
 * y la tabla de datos.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @returns {JSX.Element} El módulo de gestión de personas.
 */
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

  /**
   * Recarga los datos de las personas desde el servidor.
   */
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
      <h1>Persona</h1>
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

