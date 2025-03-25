/**
 * @file Evaluacion.jsx
 * @module Evaluacion
 * @description Componente principal para la gestión de evaluaciones. Integra un formulario y una grilla para CRUD.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import FormEvaluacion from "./FormEvaluacion.jsx";
import GridEvaluacion from "./GridEvaluacion.jsx";

/**
 * Componente Evaluacion.
 * Administra una lista de evaluaciones, permite agregar, actualizar y eliminar.
 *
 * @function
 * @returns {JSX.Element} Interfaz completa para gestionar evaluaciones.
 */
export default function Evaluacion() {
  /** 
   * Lista de evaluaciones cargadas desde archivo JSON.
   * @type {Object[]} 
   */
  const [evaluaciones, setEvaluaciones] = useState([]);

  /**
   * Evaluación seleccionada para editar.
   * @type {Object|null}
   */
  const [selectedRow, setSelectedRow] = useState(null);

  // Carga inicial desde el archivo evaluación.json
  useEffect(() => {
    fetch("/evaluación.json")
      .then((response) => response.json())
      .then((data) => setEvaluaciones(data))
      .catch((error) =>
        console.error("Error al cargar evaluaciones:", error)
      );
  }, []);

  /**
   * Agrega una nueva evaluación.
   * @param {Object} newEvaluacion - Objeto con los datos de la evaluación.
   */
  const handleAdd = (newEvaluacion) => {
    setEvaluaciones((prev) => [
      ...prev,
      { ...newEvaluacion, eva_id: Date.now() },
    ]);
  };

  /**
   * Actualiza una evaluación existente.
   * @param {Object} updatedEvaluacion - Evaluación modificada.
   */
  const handleUpdate = (updatedEvaluacion) => {
    setEvaluaciones((prev) =>
      prev.map((eva) =>
        eva.eva_id === updatedEvaluacion.eva_id ? updatedEvaluacion : eva
      )
    );
    setSelectedRow(null);
  };

  /**
   * Elimina una evaluación por ID.
   * @param {number} id - ID de la evaluación a eliminar.
   */
  const handleDelete = (id) => {
    setEvaluaciones((prev) => prev.filter((eva) => eva.eva_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Evaluaciones</h1>
      <FormEvaluacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridEvaluacion
        evaluaciones={evaluaciones}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
