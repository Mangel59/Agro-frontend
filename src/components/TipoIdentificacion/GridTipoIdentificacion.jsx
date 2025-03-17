
/**
 * GridTipoIdentificacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "tii_id", headerName: "ID", width: 90 },
  { field: "tii_nombre", headerName: "Nombre", width: 200 },
  { field: "tii_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "tii_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (params.row.tii_estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente GridTipoIdentificacion.
 * @module GridTipoIdentificacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridTipoIdentificacion({ tiposIdentificacion, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tiposIdentificacion}
        columns={columns}
        getRowId={(row) => row.tii_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
