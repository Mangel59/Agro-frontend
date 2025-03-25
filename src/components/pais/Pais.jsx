/**
 * @file Pais.jsx
 * @module Pais
 * @description Componente principal para gestionar países. Incluye formulario y grilla.
 * @author Karla
 */

import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormPais from "./FormPais";
import GridPais from "./GridPais";
import { SiteProps } from '../dashboard/SiteProps';

/**
 * Componente Pais.
 *
 * Maneja la visualización y gestión de países.
 *
 * @component
 * @returns {JSX.Element} Vista principal del componente de país.
 */
export default function Pais() {
  /**
   * Fila seleccionada por defecto.
   * @type {{ id: number, name: string }}
   */
  const row = {
    id: 0,
    name: "",
  };

  /**
   * Mensaje por defecto para Snackbar.
   * @type {{ open: boolean, severity: string, text: string }}
   */
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState(messageData);
  const [pais, setPais] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/items/pais`)
      .then(response => {
        const paisData = response.data.map((item) => ({
          ...item,
          id: item.id, // Asegura que el campo `id` esté presente
        }));
        setPais(paisData);
        console.log(paisData);
      })
      .catch(error => {
        console.error("Error al buscar país:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar la lista de países."
        });
      });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
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
