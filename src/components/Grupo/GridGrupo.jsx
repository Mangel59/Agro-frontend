import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre del Grupo', width: 200 },
  { field: 'descripcion', headerName: 'Descripción', width: 250 },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 120,
    valueGetter: (params) => {
      switch (params.row.estadoId) {
        case 1: return "Activo";
        case 2: return "Inactivo";
        default: return "Desconocido";
      }
    }
  }
];

export default function GridGrupo({ grupos, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={grupos}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
