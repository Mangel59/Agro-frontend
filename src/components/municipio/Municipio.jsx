/**
 * @file Municipio.jsx
 * @module Municipio
 * @description Componente principal para gestionar municipios. Incluye formulario y grilla de datos, junto con snackbar de mensajes.
 * @author Karla
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMunicipio from "./FormMunicipio";
import GridMunicipio from "./GridMunicipio";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Municipio.
 *
 * Muestra y gestiona una lista de municipios, incluyendo formulario de edición y tabla.
 *
 * @returns {JSX.Element} El componente de Municipio.
 */
export default function Municipio() {
  const row = {
    id: 0,
    name: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
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
