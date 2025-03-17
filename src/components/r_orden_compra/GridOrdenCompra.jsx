
/**
 * GridOrdenCompra componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * Componente GridOrdenCompra.
 * @module GridOrdenCompra.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridOrdenCompra({ ordenesCompra, onSelectOrdenCompra }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "pedidoId", headerName: "Pedido ID", width: 200 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "estado", headerName: "Estado", width: 100 },
  ];

  return (
    <Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={ordenesCompra}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => onSelectOrdenCompra(params.row)}
        />
      </div>
    </Box>
  );
}
