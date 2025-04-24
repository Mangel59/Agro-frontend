import React, { useState, useEffect } from "react";
import FormCriterioEvaluacion from "./Formcriterio_evaluacion.jsx";
import GridCriterioEvaluacion from "./GridCriterioEvaluacion";

export default function CriterioEvaluacion() {
  const [criteriosEvaluacion, setCriteriosEvaluacion] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/criterio_evaluacion.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("El JSON no es un array válido");
        }
        setCriteriosEvaluacion(data);
      })
      .catch((error) =>
        console.error("Error al cargar criterios de evaluación:", error)
      );
  }, []);

  const handleAdd = (nuevoCriterio) => {
    const newId =
      criteriosEvaluacion.length > 0
        ? Math.max(...criteriosEvaluacion.map((cre) => cre.cre_id)) + 1
        : 1;

    setCriteriosEvaluacion([
      ...criteriosEvaluacion,
      { ...nuevoCriterio, cre_id: newId },
    ]);
  };

  const handleUpdate = (criterioActualizado) => {
    setCriteriosEvaluacion(
      criteriosEvaluacion.map((cre) =>
        cre.cre_id === criterioActualizado.cre_id ? criterioActualizado : cre
      )
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setCriteriosEvaluacion(
      criteriosEvaluacion.filter((cre) => cre.cre_id !== id)
    );
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Criterios de Evaluación</h1>
      <FormCriterioEvaluacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridCriterioEvaluacion
        criteriosEvaluacion={criteriosEvaluacion}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
