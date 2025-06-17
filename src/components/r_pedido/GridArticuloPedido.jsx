
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'cantidad', headerName: 'Cantidad', width: 120 },
  { field: 'pedidoId', headerName: 'Pedido', width: 150 },
  { field: 'productoPresentacionId', headerName: 'Presentación', width: 200 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 120,
    valueGetter: (params) => params.row.estadoId === 1 ? "Activo" : "Inactivo"
  }
];

export default function GridArticuloPedido({ items, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={items}
        columns={columns}
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } }
        }}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
