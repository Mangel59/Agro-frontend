import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Marca gestiona el módulo de marcas, integrando el formulario
 * y la tabla de datos.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @returns {JSX.Element} El módulo de gestión de marcas.
 */
export default function Marca(props) {
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
  const [marcas, setMarcas] = React.useState([]);

  /**
   * Recarga los datos de las Marcas desde el servidor.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/marcas`)
      .then((response) => {
        const marcaData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setMarcas(marcaData);
      })
      .catch((error) => {
        console.error("Error al buscar Marcas!", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar marcas!",
        });
      });
  };
  

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormMarca
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormMarca
        marcas={marcas}

      />
      <GridMarca
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        marcas={marcas}
      />
    </div>
  );
}

