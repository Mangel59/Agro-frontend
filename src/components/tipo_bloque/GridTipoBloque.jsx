import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'descripcion', headerName: 'Descripción', width: 400 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 150,
    valueGetter: (params) => {
      const val = params.row.estadoId;
      return val === 1 ? "Activo" : val === 2 ? "Inactivo" : "Desconocido";
    }
  }
];

export default function GridTipoBloque({ tiposBloque, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tiposBloque}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
