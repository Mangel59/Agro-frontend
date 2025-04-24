import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "evi_id", headerName: "ID", width: 90 },
  { field: "evi_evaluacion_id", headerName: "Evaluación ID", width: 150 },
  { field: "evi_valor", headerName: "Valor", width: 100 },
  {
    field: "evi_criterio_evaluacion_id",
    headerName: "Criterio Evaluación ID",
    flex: 1,
  },
  {
    field: "evi_descripcion",
    headerName: "Descripción",
    flex: 2,
  },
  {
    field: "evi_estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.evi_estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridEvaluacionItem({ items, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={items || []}
        columns={columns}
        getRowId={(row) => row.evi_id}
        onRowClick={(params) => onEdit(params.row)}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
