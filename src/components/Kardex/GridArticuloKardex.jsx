import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'cantidad', headerName: 'Cantidad', width: 120 },
  { field: 'precio', headerName: 'Precio', width: 120 },
  {
    field: 'fechaVencimiento',
    headerName: 'Vence',
    width: 150,
    valueGetter: (params) => params.row.fechaVencimiento?.substring(0, 10)
  },
  { field: 'kardexId', headerName: 'Kardex ID', width: 120 },
  { field: 'presentacionProductoId', headerName: 'Presentación', width: 200 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 120,
    valueGetter: (params) => params.row.estadoId === 1 ? "Activo" : "Inactivo"
  }
];

export default function GridArticuloKardex({ items, selectedRow, setSelectedRow }) {
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
