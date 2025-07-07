import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'descripcion', headerName: 'Descripción', width: 250 },
  { field: 'productoCategoriaNombre', headerName: 'Categoría', width: 180 },
  { field: 'unidadMinimaNombre', headerName: 'Unidad Mínima', width: 180 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 120,
    valueGetter: (params) => params.row.estadoId === 1 ? "Activo" : "Inactivo"
  }
];

export default function GridProducto({ productos, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={productos}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}