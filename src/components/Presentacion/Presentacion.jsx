/**
 * @file Presentacion.jsx
 * @module Presentacion
 * @description Componente principal para gestionar presentaciones. Incluye formulario y grilla.
 * Carga los datos desde el backend y permite crear o actualizar elementos.
 * @author Karla
 */

import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacion from "./FormPresentacion";
import GridPresentacion from "./GridPresentacion";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} PresentacionRow
 * @property {number} id - ID único de la presentación
 * @property {string} nombre - Nombre de la presentación
 * @property {string} descripcion - Descripción de la presentación
 * @property {number} estado - Estado (1: Activo, 0: Inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {"success"|"error"|"info"|"warning"} severity - Nivel de severidad del mensaje
 * @property {string} text - Contenido del mensaje
 */

/**
 * Componente principal Presentacion.
 * 
 * Muestra un formulario para registrar o editar presentaciones, y una grilla para listarlas.
 * 
 * @function
 * @returns {JSX.Element} Componente de gestión de presentaciones.
 */
export default function Presentacion() {
  /** Fila por defecto para edición o nuevo registro */
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
  };

  /** Estado para la fila seleccionada */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** Estado para mensajes tipo snackbar */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** Lista de presentaciones */
  const [presentaciones, setPresentaciones] = React.useState([]);

  /**
   * Carga todas las presentaciones desde la API.
   * Si hay un error, lo muestra en el snackbar.
   */
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/presentaciones`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setPresentaciones(response.data.data);
        } else if (Array.isArray(response.data)) {
          setPresentaciones(response.data);
        } else {
          console.error("La respuesta no es un array:", response.data);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar Presentaciones: respuesta no válida",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cargar Presentaciones:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar Presentaciones",
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
