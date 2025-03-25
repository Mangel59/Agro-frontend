/**
 * @file TipoIdentificacion.jsx
 * @module TipoIdentificacion
 * @description Componente principal para la gestión de tipos de identificación. Maneja la carga de datos desde un archivo JSON y permite agregar, actualizar y eliminar registros desde el frontend sin conexión al backend.
 * @author Karla
 */

import React, { useState, useEffect } from "react";
import FormTipoIdentificacion from "./FormTipoIdentificacion.jsx";
import GridTipoIdentificacion from "./GridTipoIdentificacion.jsx";

/**
 * Componente principal del módulo TipoIdentificacion.
 * Permite gestionar los tipos de identificación a través de un formulario y una grilla.
 *
 * @component
 * @returns {JSX.Element} Componente renderizado de gestión de tipos de identificación.
 */
export default function TipoIdentificacion() {
  /** Lista de tipos de identificación cargados.
   * @type {Array<Object>}
   */
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);

  /** Fila actualmente seleccionada.
   * @type {Object|null}
   */
  const [selectedRow, setSelectedRow] = useState(null);

  // Cargar datos desde archivo JSON al montar el componente
  useEffect(() => {
    fetch("/tipo_identificacion.json")
      .then((response) => response.json())
      .then((data) => setTiposIdentificacion(data))
      .catch((error) =>
        console.error("Error al cargar tipos de identificación:", error)
      );
  }, []);

  /**
   * Maneja la adición de un nuevo tipo de identificación.
   * @param {Object} newTipo - Nuevo objeto de tipo identificación.
   */
  const handleAdd = (newTipo) => {
    setTiposIdentificacion([
      ...tiposIdentificacion,
      { ...newTipo, tii_id: Date.now() }, // ID simulado
    ]);
  };

  /**
   * Maneja la actualización de un tipo de identificación.
   * @param {Object} updatedTipo - Objeto actualizado.
   */
  const handleUpdate = (updatedTipo) => {
    setTiposIdentificacion(
      tiposIdentificacion.map((tipo) =>
        tipo.tii_id === updatedTipo.tii_id ? updatedTipo : tipo
      )
    );
    setSelectedRow(null);
  };

  /**
   * Maneja la eliminación de un tipo de identificación por ID.
   * @param {number} id - ID del tipo de identificación a eliminar.
   */
  const handleDelete = (id) => {
    setTiposIdentificacion(
      tiposIdentificacion.filter((tipo) => tipo.tii_id !== id)
    );
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
      <GridTipoIdentificacion
        tiposIdentificacion={tiposIdentificacion}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
