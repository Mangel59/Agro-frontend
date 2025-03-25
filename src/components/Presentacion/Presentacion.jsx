/**
 * @file Presentacion.jsx
 * @module Presentacion
 * @description Componente principal para gestionar presentaciones. Incluye formulario y grilla.
 * @author Karla
 */

import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacion from "./FormPresentacion";
import GridPresentacion from "./GridPresentacion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Presentacion.
 *
 * Maneja la visualización y gestión de presentaciones, incluyendo creación, actualización y listado.
 *
 * @component
 * @returns {JSX.Element} El componente de Presentación con formulario y grilla.
 */
export default function Presentacion() {
  /**
   * Estructura base de una fila de presentación.
   * @type {{id: number, nombre: string, descripcion: string, estado: number}}
   */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [presentaciones, setPresentacion] = React.useState([]);

  /**
   * Función para cargar las presentaciones desde la API.
   * Actualiza el estado con los datos recibidos o muestra un error.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/presentaciones`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setPresentacion(response.data.data);
        } else if (Array.isArray(response.data)) {
          setPresentacion(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Presentación: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Presentación:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Presentación",
        });
      });
  };

  // Cargar presentaciones al montar el componente
  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Presentación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        Presentacion={presentaciones}
      />

      <GridPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        Presentacion={presentaciones}
      />
    </div>
  );
}
