/**
 * @file TipoSede.jsx
 * @module TipoSede
 * @description Componente principal para gestionar Tipos de Sede: lista, formulario, eliminación y mensajes.
 * @author Karla
 */

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoSedes from "./FormTipoSede";
import GridTipoSedes from "./GridTipoSede";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoSedeRow
 * @property {number} id - ID del tipo de sede
 * @property {string} nombre - Nombre del tipo de sede
 * @property {string} descripcion - Descripción del tipo de sede
 * @property {number} estado - Estado (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Tipo de severidad: "success", "error", "info"
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para gestionar Tipos de Sede.
 * @component
 * @returns {JSX.Element} Interfaz de gestión para Tipos de Sede.
 */
export default function TipoSedes() {
  /**
   * Valor inicial de la fila seleccionada.
   * @type {TipoSedeRow}
   */
  const initialRow = { id: null, nombre: "", descripcion: "", estado: 1 };

  /**
   * Lista de Tipos de Sede.
   * @type {TipoSedeRow[]}
   */
  const [tipoSedes, setTipoSedes] = useState([]);

  /**
   * Fila seleccionada actualmente.
   * @type {TipoSedeRow}
   */
  const [selectedRow, setSelectedRow] = useState(initialRow);

  /**
   * Estado del mensaje tipo snackbar.
   * @type {SnackbarMessage}
   */
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  /**
   * Cargar datos desde la API.
   * @function
   * @returns {Promise<void>}
   */
  const fetchData = async () => {
    try {
      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_sede`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTipoSedes(response.data || []);
      setMessage({ open: false });
    } catch (error) {
      console.error("Error al cargar tipo_sedes:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar los datos. Intente nuevamente.",
      });
    }
  };

  /**
   * Eliminar un Tipo de Sede por ID.
   * @function
   * @param {number} id - ID del Tipo de Sede a eliminar
   * @returns {Promise<void>}
   */
  const deleteTipoSedes = async (id) => {
    try {
      await axios.delete(`${SiteProps.urlbasev1}/tipo_sede/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTipoSedes((prevData) => prevData.filter((item) => item.id !== id));
      setMessage({
        open: true,
        severity: "success",
        text: "Tipo de Sedes eliminado con éxito.",
      });
    } catch (error) {
      console.error("Error al eliminar tipo_sede:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al eliminar los datos. Intente nuevamente.",
      });
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <h1>Tipo Sede</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoSedes
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={fetchData}
        setMessage={setMessage}
      />
      <GridTipoSedes
        tipoSedes={tipoSedes}
        setSelectedRow={setSelectedRow}
        deleteTipoSedes={deleteTipoSedes}
      />
    </Box>
  );
}
