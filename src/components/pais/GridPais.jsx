/**
 * @file GridPais.jsx
 * @module GridPais
 * @description Componente de tabla para visualizar los países registrados.
 *
 * Esta tabla muestra los países disponibles y permite seleccionar una fila
 * para edición o eliminación.
 */

import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

/**
 * Columnas que se muestran en la tabla de países.
 */
export const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'nombre', headerName: 'Nombre del País', width: 200 },
  { field: 'codigo', headerName: 'Código', width: 120 },
  { field: 'acronimo', headerName: 'Acrónimo', width: 120 },
  { field: 'estadoId', headerName: 'Estado', width: 150 },
];

/**
 * @param {Object} props
 * @param {Array} props.paises - Lista de países
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada
 * @param {Object} props.selectedRow - Fila actualmente seleccionada
 * @returns {JSX.Element} Tabla de países
 */
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
