import React, { useState, useEffect } from "react";
import FormRol from "./FormRol.jsx";
import GridRol from "./GridRol.jsx";

export default function Rol() {
  const [roles, setRoles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/rol.json")
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error("Error al cargar roles:", error));
  }, []);

  const handleAdd = (newRol) => {
    setRoles([...roles, { ...newRol, rol_id: Date.now() }]);
  };

  const handleUpdate = (updatedRol) => {
    setRoles(
      roles.map((rol) =>
        rol.rol_id === updatedRol.rol_id ? updatedRol : rol
      )
    );
    setSelectedRow(null);
  };

  const handleDelete = (id) => {
    setRoles(roles.filter((rol) => rol.rol_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Roles</h1>
      <FormRol
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridRol roles={roles} onEdit={setSelectedRow} />
    </div>
  );
}
