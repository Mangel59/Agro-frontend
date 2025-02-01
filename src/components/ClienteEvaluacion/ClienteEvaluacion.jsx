import React, { useState, useEffect } from "react";
import FormClienteEvaluacion from "./FormClienteEvaluacion.jsx";
import GridClienteEvaluacion from "./GridClienteEvaluacion.jsx";

export default function ClienteEvaluacion() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/cliente_evaluacion.json")
      .then((response) => response.json())
      .then((data) => setEvaluaciones(data))
      .catch((error) => console.error("Error al cargar evaluaciones de clientes:", error));
  }, []);

  const handleAdd = (newEvaluacion) => {
    setEvaluaciones([...evaluaciones, { ...newEvaluacion, cle_id: Date.now() }]);
  };

  const handleUpdate = (updatedEvaluacion) => {
    setEvaluaciones(evaluaciones.map((eva) => (eva.cle_id === updatedEvaluacion.cle_id ? updatedEvaluacion : eva)));
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setEvaluaciones(evaluaciones.filter((eva) => eva.cle_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Evaluaciones de Clientes</h1>
      <FormClienteEvaluacion onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
      <GridClienteEvaluacion evaluaciones={evaluaciones} onEdit={setSelectedRow} />
    </div>
  );
}
