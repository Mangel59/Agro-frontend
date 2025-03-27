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
 * @typedef {Object} MunicipioRow
 * @property {number} id - ID del municipio
 * @property {string} name - Nombre del municipio
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad (success, error, info, warning)
 * @property {string} text - Contenido del mensaje
 */

/**
 * Componente Municipio.
 * Gestiona la visualización y edición de municipios mediante formulario y grilla.
 *
 * @component
 * @returns {JSX.Element} El componente de Municipio.
 */
export default function Municipio() {
  /** @type {MunicipioRow} */
  const row = {
    id: 0,
    name: "",
  };

  /** @type {SnackbarMessage} */
  const defaultMessage = {
    open: false,
    severity: "success",
    text: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState(defaultMessage);

  /** @type {MunicipioRow[]} */
  const [municipios, setMunicipios] = React.useState([]);

  // Cargar municipios al montar el componente
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
        console.error("Error al buscar municipio:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de municipios.",
        });
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
