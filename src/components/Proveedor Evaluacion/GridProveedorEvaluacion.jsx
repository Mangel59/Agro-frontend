import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "pre_id", headerName: "ID", width: 90 },
  { field: "pre_fecha_hora", headerName: "Fecha y Hora", width: 200 },
  { field: "pre_proveedor_id", headerName: "Proveedor ID", width: 150 },
  { field: "pre_evaluacion_id", headerName: "Evaluación ID", width: 150 },
  { field: "pre_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "pre_estado",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.pre_estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridProveedorEvaluacion({ evaluaciones, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={evaluaciones}
        columns={columns}
        getRowId={(row) => row.pre_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
