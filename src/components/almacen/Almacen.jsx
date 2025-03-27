/**
 * @file Almacen.jsx
 * @module Almacen
 * @description Componente principal para la gestión de Almacenes.
 * Permite seleccionar una sede, visualizar los almacenes relacionados, y gestionar los datos mediante formulario y grilla.
 * Conecta con el backend para obtener y actualizar datos.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormAlmacen from "./FormAlmacen";
import GridAlmacen from "./GridAlmacen";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad del mensaje ('success', 'error', etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * @typedef {Object} SedeMinimal
 * @property {number} id - ID de la sede
 * @property {string} nombre - Nombre de la sede
 */

/**
 * @typedef {Object} AlmacenRow
 * @property {number} id - ID del almacén
 * @property {string} nombre - Nombre del almacén
 * @property {string} descripcion - Descripción del almacén
 * @property {number} estado - Estado del almacén (1: Activo, 0: Inactivo)
 */

/**
 * Componente principal de gestión de almacenes.
 *
 * @component
 * @returns {JSX.Element} El componente de interfaz para gestionar almacenes por sede.
 */
export default function Almacen() {
  const [sedes, setSedes] = useState(/** @type {SedeMinimal[]} */ ([]));
  const [almacenes, setAlmacenes] = useState(/** @type {AlmacenRow[]} */ ([]));
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(/** @type {SnackbarMessage} */ ({
    open: false,
    severity: "success",
    text: "",
  }));

  /**
   * Carga la lista de sedes al iniciar el componente.
   */
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (err) {
        console.error("Error al cargar las sedes:", err);
      }
    };

    fetchSedes();
  }, []);

  /**
   * Carga los almacenes cuando cambia la sede seleccionada.
   */
  useEffect(() => {
    if (!selectedSede) {
      setAlmacenes([]);
      setSelectedRow(null);
      return;
    }

    const fetchAlmacenes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/almacen/sede/${selectedSede}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = response.data?.content || [];
        setAlmacenes(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los almacenes:", err);
        setError("No se pudieron cargar los almacenes.");
        setAlmacenes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlmacenes();
  }, [selectedSede]);

  /**
   * Recarga los almacenes de la sede seleccionada.
   */
  const reloadAlmacenes = () => {
    if (selectedSede) {
      const fetchAlmacenes = async () => {
        try {
          const response = await axios.get(`${SiteProps.urlbasev1}/almacen/sede/${selectedSede}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = response.data?.content || [];
          setAlmacenes(data);
        } catch (err) {
          console.error("Error al recargar los almacenes:", err);
        }
      };

      fetchAlmacenes();
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Almacen</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Selector de sede */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="sede-select">Seleccionar Sede: </label>
        <select
          id="sede-select"
          value={selectedSede || ""}
          onChange={(e) => setSelectedSede(e.target.value)}
        >
          <option value="">Seleccione una sede</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario para agregar/editar almacén */}
      <FormAlmacen
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        sedeId={selectedSede}
        reloadData={reloadAlmacenes}
      />

      {/* Tabla de almacenes */}
      <div style={{ height: 500, width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
        ) : (
          <GridAlmacen almacenes={almacenes} setSelectedRow={setSelectedRow} />
        )}
      </div>
    </div>
  );
}
