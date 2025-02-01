import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "eva_id", headerName: "ID", width: 90 },
  { field: "eva_nombre", headerName: "Nombre", width: 200 },
  { field: "eva_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "eva_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (params.row.eva_estado === 1 ? "Activo" : "Inactivo"),
  },
];

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
