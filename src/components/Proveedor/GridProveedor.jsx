/**
 * @file GridProveedor.jsx
 * @module GridProveedor
 * @description Componente de grilla para mostrar la lista de proveedores. Utiliza Material UI DataGrid para paginar, visualizar y seleccionar proveedores. Cada fila muestra el ID, empresa, fecha de creación y estado (activo/inactivo).
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Columnas definidas para la grilla de proveedores.
 * @constant
 * @type {Array<Object>}
 */
const columns = [
  { field: "pro_id", headerName: "ID", width: 90 },
  { field: "pro_empresa_id", headerName: "Empresa ID", width: 150 },
  { field: "pro_fecha_creacion", headerName: "Fecha Creación", width: 200 },
  {
    field: "pro_estado",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.pro_estado === 1 ? "Activo" : "Inactivo"),
  },
];


/**
 * Componente GridProveedor.
 *
 * Muestra una grilla con los proveedores cargados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.proveedores - Lista de proveedores a mostrar
 * @param {function(Object): void} props.onEdit - Función para seleccionar un proveedor
 * @returns {JSX.Element} Tabla con datos de proveedores
 */
export default function GridProveedor({ proveedores, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={proveedores}
        columns={columns}
        getRowId={(row) => row.pro_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
