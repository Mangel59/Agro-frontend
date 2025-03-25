/**
 * @file Proveedor.jsx
 * @module Proveedor
 * @description Componente principal para la gestión de proveedores. Permite listar, agregar, actualizar y eliminar proveedores utilizando datos desde un archivo JSON local. Integra los componentes FormProveedor y GridProveedor para interacción y visualización.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import FormProveedor from "./FormProveedor";
import GridProveedor from "./GridProveedor";

/**
 * Componente principal Proveedor.
 *
 * Este componente gestiona la carga, creación, edición y eliminación de proveedores desde un archivo JSON.
 *
 * @component
 * @returns {JSX.Element} Interfaz de gestión de proveedores
 */
export default function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // Cargar datos desde archivo JSON local
  useEffect(() => {
    fetch("/proveedor.json")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error("Error al cargar proveedores:", error));
  }, []);

  /**
   * Agrega un nuevo proveedor a la lista.
   * @param {Object} newProveedor - Nuevo proveedor a agregar
   */
  const handleAdd = (newProveedor) => {
    setProveedores([...proveedores, { ...newProveedor, pro_id: Date.now() }]);
  };

  /**
   * Actualiza un proveedor existente.
   * @param {Object} updatedProveedor - Proveedor actualizado
   */
  const handleUpdate = (updatedProveedor) => {
    setProveedores(
      proveedores.map((prov) =>
        prov.pro_id === updatedProveedor.pro_id ? updatedProveedor : prov
      )
    );
    setSelectedRow(null);
  };

  /**
   * Elimina un proveedor por su ID.
   * @param {number|string} id - ID del proveedor a eliminar
   */
  const handleDelete = (id) => {
    setProveedores(proveedores.filter((prov) => prov.pro_id !== id));
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Proveedores</h1>
      <FormProveedor
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridProveedor
        proveedores={proveedores}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
