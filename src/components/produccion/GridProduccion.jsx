import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 180 },
  { field: "descripcion", headerName: "Descripción", width: 250 },
  {
    field: "tipoProduccionId",
    headerName: "Tipo Producción",
    width: 160,
  },
  {
    field: "productoId",
    headerName: "Producto ID",
    width: 120,
  },
  {
    field: "empresaId",
    headerName: "Empresa ID",
    width: 120,
  },
  {
    field: "fechaInicio",
    headerName: "Inicio",
    width: 170,
    valueGetter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "fechaFinal",
    headerName: "Final",
    width: 170,
    valueGetter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "espacioId",
    headerName: "Espacio ID",
    width: 120,
  },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 110,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridProduccion({ producciones, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={producciones}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
