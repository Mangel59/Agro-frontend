import React, { useState, useEffect } from "react";
import FormTipoIdentificacion from "./FormTipoIdentificacion.jsx";
import GridTipoIdentificacion from "./GridTipoIdentificacion.jsx";

export default function TipoIdentificacion() {
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/tipo_identificacion .json")
      .then((response) => response.json())
      .then((data) => setTiposIdentificacion(data))
      .catch((error) => console.error("Error al cargar tipos de identificación:", error));
  }, []);

  const handleAdd = (newTipo) => {
    setTiposIdentificacion([...tiposIdentificacion, { ...newTipo, tii_id: Date.now() }]);
  };

  const handleUpdate = (updatedTipo) => {
    setTiposIdentificacion(
      tiposIdentificacion.map((tipo) =>
        tipo.tii_id === updatedTipo.tii_id ? updatedTipo : tipo
      )
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setTiposIdentificacion(tiposIdentificacion.filter((tipo) => tipo.tii_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Tipos de Identificación</h1>
      <FormTipoIdentificacion
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridTipoIdentificacion tiposIdentificacion={tiposIdentificacion} onEdit={setSelectedRow} />
    </div>
  );
}
