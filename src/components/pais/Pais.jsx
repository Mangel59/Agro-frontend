/**
 * @file Pais.jsx
 * @module Pais
 * @description Componente principal para la gestión de países.
 *
 * Este componente maneja la lógica del módulo de países, incluyendo la carga de datos,
 * manejo de mensajes, y renderizado del formulario y la tabla de países.
 */

import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPais from "./FormPais";
import GridPais from "./GridPais";

/**
 * @typedef {Object} PaisRow
 * @property {number} id - ID del país
 * @property {string} nombre - Nombre del país
 * @property {string} codigo - Código numérico del país
 * @property {string} acronimo - Acrónimo (ej. COL, USA)
 * @property {number} estadoId - Estado (1: Activo, 2: Inactivo)
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad ("success", "error", etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de países.
 *
 * @returns {JSX.Element} El módulo de gestión de países
 */
export default function Pais() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [paises, setPaises] = useState([]);

  /**
   * Carga los países desde la API.
   */
  const reloadData = () => {
    axios.get("/v1/pais")
      .then((res) => {
        const datosConId = res.data.map((p) => ({
        ...p,
        id: p.id // no sobrescribas estadoId si ya viene bien
      }));
        setPaises(datosConId);
      })
      .catch((err) => {
        console.error("❌ Error al cargar países:", err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar países",
        });
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Gestión de Países</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPais
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridPais
        paises={paises}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
