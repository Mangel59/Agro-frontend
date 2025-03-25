/**
 * @file GridRol.jsx
 * @module GridRol
 * @description Componente de grilla para visualizar los roles registrados. Utiliza DataGrid de Material UI. Permite seleccionar un rol para su edición mediante clic en fila.
 * @author Karla
 */

import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

/**
 * @typedef {Object} RolData
 * @property {number|string} rol_id - ID del rol
 * @property {string} rol_nombre - Nombre del rol
 * @property {string} rol_descripcion - Descripción del rol
 * @property {number} rol_estado - Estado del rol (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} GridRolProps
 * @property {Array<RolData>} roles - Lista de roles a mostrar en la grilla
 * @property {function(RolData): void} onEdit - Función que maneja la selección de un rol para edición
 */

const columns = [
  { field: "rol_id", headerName: "ID", width: 90 },
  { field: "rol_nombre", headerName: "Nombre", width: 200 },
  { field: "rol_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "rol_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (params.row.rol_estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente GridRol.
 *
 * @param {GridRolProps} props - Props del componente
 * @returns {JSX.Element} Grilla con la lista de roles
 */
export default function GridRol({ roles, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={roles}
        columns={columns}
        getRowId={(row) => row.rol_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}

// Validación de PropTypes
GridRol.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      rol_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      rol_nombre: PropTypes.string.isRequired,
      rol_descripcion: PropTypes.string.isRequired,
      rol_estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
};
