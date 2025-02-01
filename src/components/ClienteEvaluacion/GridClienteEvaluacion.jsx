import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "cle_id", headerName: "ID", width: 90 },
  { field: "cle_fecha", headerName: "Fecha", width: 200 },
  { field: "cle_persona_id", headerName: "Persona ID", width: 150 },
  { field: "cle_evaluacion_id", headerName: "Evaluación ID", width: 150 },
  { field: "cle_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "cle_estado",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.cle_estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridClienteEvaluacion({ evaluaciones, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={evaluaciones}
        columns={columns}
        getRowId={(row) => row.cle_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
