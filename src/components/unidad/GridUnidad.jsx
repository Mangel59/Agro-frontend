/**
 * @file GridUnidad.jsx
 * @module GridUnidad
 * @description Componente que muestra la grilla de unidades con paginación, filtrado y ordenamiento desde el servidor. La grilla se adapta al tamaño del contenedor sin salirse del cuadro visual definido en la interfaz del usuario (contenedor blanco). Incluye barra de filtros personalizada con Material UI DataGrid Pro o XGrid (MUI X DataGrid Pro requerido para filtros avanzados en producción). 
 * @author Karla
 */

import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';

/**
 * Columnas configuradas para la grilla de unidades.
 * @constant {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'empresa', headerName: 'Empresa', width: 150, type: 'string' },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 100,
    type: 'number',
    valueGetter: (params) => (params.row.estado === 1 ? 'Activo' : 'Inactivo'),
  },
];

/**
 * Barra de herramientas personalizada para la grilla.
 * Incluye el botón de filtros.
 * @returns {JSX.Element}
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

/**
 * Componente que renderiza una grilla de unidades con filtros, paginación y ordenamiento.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.unidades - Lista de unidades a mostrar.
 * @param {number} props.rowCount - Total de filas en el servidor.
 * @param {boolean} [props.loading] - Si se está cargando la información.
 * @param {Object} props.paginationModel - Modelo de paginación `{ page, pageSize }`.
 * @param {Function} props.setPaginationModel - Función para actualizar la paginación.
 * @param {Object} props.filterModel - Modelo de filtros.
 * @param {Function} props.setFilterModel - Función para actualizar el filtro.
 * @param {Array<Object>} props.sortModel - Modelo de ordenamiento.
 * @param {Function} props.setSortModel - Función para actualizar el ordenamiento.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element}
 */
export default function GridUnidad({
  unidades,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  filterModel,
  setFilterModel,
  sortModel,
  setSortModel,
  setSelectedRow,
}) {
  return (
    <div style={{ height: '450px', width: '100%', backgroundColor: 'white' }}>
      <DataGrid
        rows={unidades || []}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel && setSortModel(model)}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel && setFilterModel(model)}
        pageSizeOptions={[5, 10, 20, 50]}
        components={{ Toolbar: CustomToolbar }}
        onRowSelectionModelChange={(newSelection) => {
          const selectedIDs = new Set(newSelection);
          const selectedRowData = unidades.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
        }}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
        }}
      />
    </div>
  );
}

// ✅ Validación de props
GridUnidad.propTypes = {
  unidades: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  filterModel: PropTypes.object.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
