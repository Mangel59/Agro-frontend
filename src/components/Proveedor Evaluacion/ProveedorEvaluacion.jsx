import React, { useState, useEffect } from "react";
import FormProveedorEvaluacion from "./FormProveedorEvaluacion.jsx";
import GridProveedorEvaluacion from "./GridProveedorEvaluacion.jsx";

export default function ProveedorEvaluacion() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/proveedor_evaluacion.json")
      .then((response) => response.json())
      .then((data) => setEvaluaciones(data))
      .catch((error) => console.error("Error al cargar evaluaciones de proveedor:", error));
  }, []);

  const handleAdd = (newEvaluacion) => {
    setEvaluaciones([...evaluaciones, { ...newEvaluacion, pre_id: Date.now() }]);
  };

  const handleUpdate = (updatedEvaluacion) => {
    setEvaluaciones(
      evaluaciones.map((evalua) =>
        evalua.pre_id === updatedEvaluacion.pre_id ? updatedEvaluacion : evalua
      )
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setEvaluaciones(evaluaciones.filter((evalua) => evalua.pre_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Evaluaciones de Proveedores</h1>
      <FormProveedorEvaluacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridProveedorEvaluacion evaluaciones={evaluaciones} onEdit={setSelectedRow} />
    </div>
  );
}
