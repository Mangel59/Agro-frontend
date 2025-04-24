import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "cre_id", headerName: "ID", width: 90 },
  { field: "cre_tipo_evaluacion_id", headerName: "Tipo Evaluación", width: 150 },
  { field: "cre_nombre", headerName: "Nombre", flex: 1 },
  { field: "cre_descripcion", headerName: "Descripción", flex: 1 },
  {
    field: "cre_estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.cre_estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridCriterioEvaluacion({ criteriosEvaluacion, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={criteriosEvaluacion || []}
        columns={columns}
        getRowId={(row) => row.cre_id}
        onRowClick={(params) => onEdit(params.row)}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
