import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function GridArticuloPedido({ items, setSelectedRows = () => {}, presentaciones = [] }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'cantidad', headerName: 'Cantidad', width: 120 },
    { field: 'pedidoId', headerName: 'Pedido', width: 150 },
    {
      field: 'productoPresentacionId',
      headerName: 'Presentación',
      width: 200,
      valueGetter: (params) => {
        const match = presentaciones.find(p => p.id === params.row.productoPresentacionId);
        return match ? match.nombre : params.row.productoPresentacionId;
      }
    },
    {
      field: 'estadoId',
      headerName: 'Estado',
      width: 120,
      valueGetter: (params) => params.row.estadoId === 1 ? "Activo" : "Inactivo"
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={items}
        columns={columns}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        onRowSelectionModelChange={(ids) => {
          const selected = items.filter(row => ids.includes(row.id));
          setSelectedRows(selected);
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
