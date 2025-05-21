import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'tipoIdentificacionNombre',
    headerName: 'Tipo ID',
    width: 180
  },
  { field: 'identificacion', headerName: 'Identificación', width: 130 },
  { field: 'nombre', headerName: 'Nombre', width: 120 },
  { field: 'apellido', headerName: 'Apellido', width: 120 },
  { field: 'genero', headerName: 'Género', width: 90 },
  { field: 'fechaNacimiento', headerName: 'Nacimiento', width: 130 },
  { field: 'estrato', headerName: 'Estrato', width: 80 },
  { field: 'direccion', headerName: 'Dirección', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'celular', headerName: 'Celular', width: 130 },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 100,
    valueGetter: (params) => params.row.estado === 1 ? "Activo" : "Inactivo"
  }
];

export default function GridPersona({ personas, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={personas}
        columns={columns}
        pageSize={8}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
