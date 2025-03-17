
/**
 * Municipio componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMunicipio from "./FormMunicipio";
import GridMunicipio from "./GridMunicipio";
import { SiteProps } from "../dashboard/SiteProps";


/**
 * Componente Municipio.
 * @module Municipio.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Municipio() {
  const row = {
    id: 0,
    name: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [municipios, setMunicipios] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${SiteProps.urlbasev1}/items/municipio`)
      .then((response) => {
        const municipioData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setMunicipios(municipioData);
        console.log(municipioData);
      })
      .catch((error) => {
        console.error("Error al buscar municipio!", error);
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Municipio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormMunicipio
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        municipios={municipios}
      />
      <GridMunicipio
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        municipios={municipios}
      />
    </div>
  );
}
