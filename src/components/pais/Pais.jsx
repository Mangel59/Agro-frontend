/**
 * @file Pais.jsx
 * @module Pais
 * @description Componente principal para gestionar países. Incluye formulario y grilla.
 * @author Maria
 */

import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormPais from "./FormPais";
import GridPais from "./GridPais";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} PaisRow
 * @property {number} id - ID del país
 * @property {string} name - Nombre del país
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Indica si el mensaje está visible
 * @property {string} severity - Severidad del mensaje (success, error, etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente Pais.
 * Maneja la visualización y gestión de países mediante formulario y tabla.
 *
 * @component
 * @returns {JSX.Element} Vista principal del componente de país.
 */
export default function Pais() {
  /** @type {PaisRow} */
  const row = {
    id: 0,
    name: "",
  };

  /** @type {SnackbarMessage} */
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState(messageData);

  /** @type {PaisRow[]} */
  const [pais, setPais] = React.useState([]);

  // Cargar la lista de países al montar el componente
  React.useEffect(() => {
    axios
      .get(`${SiteProps.urlbasev1}/items/pais`)
      .then((response) => {
        const paisData = response.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setPais(paisData);
        console.log(paisData);
      })
      .catch((error) => {
        console.error("Error al buscar país:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de países.",
        });
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>País</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPais
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        pais={pais}
      />
      <GridPais
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        pais={pais}
      />
    </div>
  );
}
