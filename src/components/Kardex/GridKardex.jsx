import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "fechaHora", headerName: "Fecha/Hora", width: 180, valueGetter: (params) => new Date(params.value).toLocaleString() },
  { field: "almacenId", headerName: "Almacén", width: 120 },
  { field: "produccionId", headerName: "Producción", width: 140 },
  { field: "tipoMovimientoId", headerName: "Tipo Movimiento", width: 160 },
  { field: "descripcion", headerName: "Descripción", width: 250 },
  { field: "empresaId", headerName: "Empresa", width: 120 },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridKardex({ kardexes, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={kardexes}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
