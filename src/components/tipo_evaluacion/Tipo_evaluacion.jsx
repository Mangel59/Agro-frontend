/**
 * @file TipoEvaluacion.jsx
 * @description Componente para gestionar Tipos de Evaluación con API real.
 */

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormTipoEvaluacion from "./FormTipoEvaluacion";
import GridTipoEvaluacion from "./GridTipoEvaluacion";
import { SiteProps } from "../dashboard/SiteProps";

export default function TipoEvaluacion() {
  const [tipoEvaluaciones, setTipoEvaluaciones] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // Función para cargar los datos de los tipos de evaluación
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado." });
      return;
    }

    try {
      const response = await axios.get("/api/v1/tipo_evaluacion/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTipoEvaluaciones(response.data || []);
    } catch (error) {
      console.error("Error al cargar tipo_evaluacion:", error);
      setMessage({
        open: true,
        severity: "error",
        text: "Error al cargar los datos. Intente nuevamente.",
      });
    }
  };

  // Función para agregar un nuevo tipo de evaluación
  const handleAdd = async (nuevo) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado." });
      return;
    }

    try {
      const payload = {
        nombre: nuevo.tie_nombre,
        estadoId: parseInt(nuevo.tie_estado),
      };
      await axios.post("/api/v1/tipo_evaluacion", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setMessage({ open: true, severity: "success", text: "Tipo de evaluación agregado exitosamente." });
    } catch (error) {
      console.error("Error al agregar:", error.response ? error.response.data : error);
      setMessage({ open: true, severity: "error", text: "No se pudo agregar." });
    }
  };

  // Función para actualizar un tipo de evaluación
  const handleUpdate = async (actualizado) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado." });
      return;
    }

    try {
      const payload = {
        id: actualizado.tie_id,
        nombre: actualizado.tie_nombre,
        estadoId: parseInt(actualizado.tie_estado),
      };
      await axios.put(`/api/v1/tipo_evaluacion/${actualizado.tie_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setMessage({ open: true, severity: "success", text: "Actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar:", error.response ? error.response.data : error);
      setMessage({ open: true, severity: "error", text: "Error al actualizar." });
    }
  };

  // Función para eliminar un tipo de evaluación
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ open: true, severity: "error", text: "Token no encontrado." });
      return;
    }

    try {
      await axios.delete(`/api/v1/tipo_evaluacion/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setMessage({ open: true, severity: "success", text: "Eliminado correctamente." });
    } catch (error) {
      console.error("Error al eliminar:", error.response ? error.response.data : error);
      setMessage({ open: true, severity: "error", text: "Error al eliminar." });
    }
  };

  // Cargar los datos cuando se monta el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Mapeamos los datos de la API para que se adapten al formulario
  const mappedData = tipoEvaluaciones.map((item) => ({
    tie_id: item.id,
    tie_nombre: item.nombre,
    tie_estado: item.estadoId,
  }));

  return (
    <Box sx={{ padding: "2rem" }}>
      <h1>Tipos de Evaluación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTipoEvaluacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridTipoEvaluacion tipoEvaluaciones={mappedData} onEdit={setSelectedRow} />
    </Box>
  );
}
