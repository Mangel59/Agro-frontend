import React from "react";
import { DataGrid } from "@mui/x-data-grid";

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
