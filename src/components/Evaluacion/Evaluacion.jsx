
/**
 * Evaluacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useState, useEffect } from "react";
import FormEvaluacion from "./FormEvaluacion.jsx";
import GridEvaluacion from "./GridEvaluacion.jsx";

/**
 * Componente Evaluacion.
 * @module Evaluacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function Evaluacion() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/evaluación.json")
      .then((response) => response.json())
      .then((data) => setEvaluaciones(data))
      .catch((error) => console.error("Error al cargar evaluaciones:", error));
  }, []);

  const handleAdd = (newEvaluacion) => {
    setEvaluaciones([...evaluaciones, { ...newEvaluacion, eva_id: Date.now() }]);
  };

  const handleUpdate = (updatedEvaluacion) => {
    setEvaluaciones(
      evaluaciones.map((eva) =>
        eva.eva_id === updatedEvaluacion.eva_id ? updatedEvaluacion : eva
      )
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setEvaluaciones(evaluaciones.filter((eva) => eva.eva_id !== id));
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
      <GridEvaluacion evaluaciones={evaluaciones} onEdit={setSelectedRow} />
    </div>
  );
}
