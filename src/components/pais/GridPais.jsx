// GridPais.jsx
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre del País', width: 200 },
  { field: 'codigo', headerName: 'Código', width: 120 },
  { field: 'acronimo', headerName: 'Acrónimo', width: 120 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 150,
  }
];

export default function GridPais({ paises, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={paises}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
