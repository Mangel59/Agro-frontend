import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 200 },
  { field: "descripcion", headerName: "Descripción", width: 300 },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridTipoIdentificacion({ tiposIdentificacion, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tiposIdentificacion}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
