/**
 * @file Grupo.jsx
 * @module Grupo
 * @description Componente principal para la gestión de grupos.
 *
 * Este componente maneja la carga de datos de grupos desde la API,
 * el manejo de mensajes, y la integración del formulario y la tabla.
 */

import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormGrupo from "./FormGrupo";
import GridGrupo from "./GridGrupo";

/**
 * @typedef {Object} GrupoRow
 * @property {number} id - ID del grupo
 * @property {string} nombre - Nombre del grupo
 * @property {string} descripcion - Descripción del grupo
 * @property {number} estadoId - Estado del grupo (1: Activo, 2: Inactivo)
 */

/**
 * Componente principal para la gestión de grupos.
 *
 * @returns {JSX.Element} El módulo de gestión de grupos
 */
export default function Grupo() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [grupos, setGrupos] = useState([]);

  /**
   * Carga los grupos desde la API y actualiza el estado.
   */
  const reloadData = () => {
    axios.get("/v1/grupo")
      .then((res) => {
        const datosConId = res.data.map((g) => ({
          ...g,
          id: g.id,
          estadoId: g.estadoId
        }));
        setGrupos(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar grupos:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar grupos",
        });
      });
  };

  /**
   * Ejecuta la carga inicial de datos cuando se monta el componente.
   */
  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Grupos</h1>

      {/* Notificación Snackbar */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Formulario de creación/edición */}
      <FormGrupo
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      {/* Tabla de visualización */}
      <GridGrupo
        grupos={grupos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
