/**
 * @file GridGrupo.jsx
 * @module GridGrupo
 * @description Componente de tabla para visualizar grupos.
 *
 * Este componente muestra los grupos en una tabla utilizando MUI DataGrid
 * y permite seleccionar una fila para edición o eliminación.
 */

import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

/**
 * Columnas definidas para la tabla de grupos.
 */
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

/**
 * @typedef {Object} GridGrupoProps
 * @property {Array<Object>} grupos - Lista de grupos a mostrar
 * @property {Object} selectedRow - Fila actualmente seleccionada
 * @property {Function} setSelectedRow - Función para actualizar la fila seleccionada
 */

/**
 * Tabla de visualización de grupos.
 *
 * @param {GridGrupoProps} props - Propiedades del componente
 * @returns {JSX.Element} Tabla interactiva de grupos
 */
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
