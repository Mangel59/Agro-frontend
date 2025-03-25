/**
 * @file Rol.jsx
 * @module Rol
 * @description Componente principal para la gestión de roles. Incluye formulario y grilla, trabajando con archivo JSON local para CRUD básico.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import FormRol from "./FormRol.jsx";
import GridRol from "./GridRol.jsx";

/**
 * @typedef {Object} RolData
 * @property {number} rol_id - ID del rol
 * @property {string} rol_nombre - Nombre del rol
 * @property {string} rol_descripcion - Descripción del rol
 * @property {number} rol_estado - Estado del rol (1: activo, 0: inactivo)
 */

/**
 * Componente principal para la gestión de roles.
 *
 * Este componente permite crear, actualizar y eliminar roles desde un archivo JSON.
 * Incluye un formulario para ingresar datos y una tabla para visualizarlos.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function Rol() {
  /** @type {RolData[]} */
  const [roles, setRoles] = useState([]);

  /** @type {(RolData|null)} */
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch("/rol.json")
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error("Error al cargar roles:", error));
  }, []);

  /**
   * Agrega un nuevo rol a la lista.
   * @param {RolData} newRol
   */
  const handleAdd = (newRol) => {
    setRoles([...roles, { ...newRol, rol_id: Date.now() }]);
  };

  /**
   * Actualiza un rol existente en la lista.
   * @param {RolData} updatedRol
   */
  const handleUpdate = (updatedRol) => {
    setRoles(
      roles.map((rol) =>
        rol.rol_id === updatedRol.rol_id ? updatedRol : rol
      )
    );
    setSelectedRow(null);
  };

  /**
   * Elimina un rol por su ID.
   * @param {number} id
   */
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
