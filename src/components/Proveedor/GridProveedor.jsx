import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "identificacion", headerName: "Identificación", width: 150 },
  { field: "contacto", headerName: "Contacto", width: 160 },
  { field: "correo", headerName: "Correo", width: 200 },
  { field: "celular", headerName: "Celular", width: 120 },
  { field: "tipoIdentificacionId", headerName: "Tipo Identificación", width: 140 },
  { field: "fechaCreacion", headerName: "Fecha de Creación", width: 180 },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridProveedor({ proveedores, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={proveedores}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
