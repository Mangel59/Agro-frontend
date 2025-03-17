import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

export default function GridPedido({ pedidos, onGenerateReport, onSelectPedido }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fechaHora", headerName: "Fecha y Hora", width: 200 },
    { field: "almacen", headerName: "Almacén", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "estado", headerName: "Estado", width: 100 },
  ];

  return (
    <Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => onSelectPedido(params.row)}
        />
      </div>
      <Box mt={2}>
        <Button variant="contained" color="success" onClick={onGenerateReport}>
          GENERAR REPORTE
        </Button>
      </Box>
    </Box>
  );
}
