// import * as React from 'react';
// import ReportOrdenCompraViewer from './ReportOrdenCompraViewer'; // Importamos el componente ReportViewer

// export default function Reportes() {
//   return (
//     <ReportOrdenCompraViewer />
//   );
// }

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

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
