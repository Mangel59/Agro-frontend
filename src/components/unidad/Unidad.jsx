import * as React from "react";
import axios from "axios";  // Usa axios directamente
import MessageSnackBar from "../MessageSnackBar";
import FormUnidad from "./FormUnidad";
import GridUnidad from "./GridUnidad";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Unidad gestiona el módulo de Unidades, integrando el formulario
 * y la tabla de datos.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @returns {JSX.Element} El módulo de gestión de Unidades.
 */
export default function Unidad(props) {
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
  const [unidades, setUnidades] = React.useState([]);

  /**
   * Recarga los datos de las Unidades desde el servidor.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/unidades`)
      .then((response) => {
        const unidadData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setUnidades(unidadData);
      })
      .catch((error) => {
        console.error("Error al buscar Unidades!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormUnidad
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormUnidad
        unidades={unidades}

      />
      <GridUnidad
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        unidades={unidades}
      />
    </div>
  );
}

