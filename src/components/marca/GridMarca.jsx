/**
 * @file GridMarca.jsx
 * @module GridMarca
 * @description Componente de grilla para mostrar y gestionar las marcas. Soporta paginación, ordenamiento, filtros y selección de filas.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

/**
 * Columnas configuradas para la tabla de marcas.
 * @constant
 * @type {Array<Object>}
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
 * Toolbar personalizada con botón de filtros.
 *
 * @returns {JSX.Element} Contenedor de herramientas con botón de filtro.
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

/**
 * Componente GridMarca.
 *
 * Renderiza una tabla de marcas con soporte para ordenamiento, paginación, filtrado y selección de filas.
 *
 * @function GridMarca
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.marcas - Lista de marcas.
 * @param {number} props.rowCount - Total de filas para paginación.
 * @param {boolean} [props.loading] - Estado de carga.
 * @param {Object} props.paginationModel - Modelo de paginación actual.
 * @param {Function} props.setPaginationModel - Función para actualizar la paginación.
 * @param {Array<Object>} props.sortModel - Modelo de ordenamiento actual.
 * @param {Function} props.setSortModel - Función para actualizar el ordenamiento.
 * @param {Function} props.setFilterModel - Función para actualizar el filtrado.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element} Tabla con los datos de marcas.
 */
export default function GridMarca({
  marcas,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  setFilterModel,
  setSelectedRow,
}) {
  return (
    <DataGrid
      rows={marcas || []}
      columns={columns}
      rowCount={rowCount}
      loading={loading}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={setSortModel}
      filterMode="server"
      onFilterModelChange={setFilterModel}
      pageSizeOptions={[5, 10, 20, 50]}
      components={{
        Toolbar: CustomToolbar,
      }}
      onRowSelectionModelChange={(newSelection) => {
        const selectedIDs = new Set(newSelection);
        const selectedRowData = marcas.find((row) => selectedIDs.has(row.id));
        setSelectedRow(selectedRowData || {});
      }}
    />
  );
}

// ✅ Validación de props
GridMarca.propTypes = {
  marcas: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
