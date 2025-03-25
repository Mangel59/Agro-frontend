/**
 * @file GridEvaluacion.jsx
 * @module GridEvaluacion
 * @description Componente que muestra una grilla de evaluaciones con opción de selección para edición.
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Columnas definidas para la grilla de evaluaciones.
 * @type {Object[]}
 */
const columns = [
  { field: "eva_id", headerName: "ID", width: 90 },
  { field: "eva_nombre", headerName: "Nombre", width: 200 },
  { field: "eva_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "eva_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) =>
      params.row.eva_estado === 1 ? "Activo" : "Inactivo",
  },
];

/**
 * Componente GridEvaluacion.
 * Muestra una tabla de evaluaciones con opción de seleccionar una fila para edición.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object[]} props.evaluaciones - Lista de evaluaciones a mostrar.
 * @param {Function} props.onEdit - Función que se ejecuta al seleccionar una fila.
 * @returns {JSX.Element} Tabla de evaluaciones renderizada con DataGrid.
 */
export default function GridEvaluacion({ evaluaciones, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={evaluaciones}
        columns={columns}
        getRowId={(row) => row.eva_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
