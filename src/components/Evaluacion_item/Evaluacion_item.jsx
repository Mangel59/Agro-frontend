import React, { useState, useEffect } from "react";
import FormEvaluacionItem from "./FormEvaluacionItem.jsx";
import GridEvaluacionItem from "./GridEvaluacionItem.jsx";

export default function EvaluacionItem() {
  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/evaluacion_item.json")
      .then((response) => {
        if (!response.ok) throw new Error("Error al cargar el archivo JSON");
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("El JSON no es un array válido");
        setItems(data);
      })
      .catch((error) => console.error("Error al cargar evaluacion_item:", error));
  }, []);

  const handleAdd = (nuevoItem) => {
    const newId = items.length > 0
      ? Math.max(...items.map((item) => item.evi_id)) + 1
      : 1;

    setItems([...items, { ...nuevoItem, evi_id: newId }]);
  };

  const handleUpdate = (itemActualizado) => {
    setItems(
      items.map((item) => (item.evi_id === itemActualizado.evi_id ? itemActualizado : item))
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.evi_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Ítems de Evaluación</h1>
      <FormEvaluacionItem
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridEvaluacionItem
        items={items}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
