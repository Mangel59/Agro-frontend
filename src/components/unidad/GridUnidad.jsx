
/**
 * CustomToolbar componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

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

// ✅ Toolbar personalizada
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

/**
 * Componente GridUnidad.
 * @module GridUnidad.jsx
 * @component
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
    <DataGrid
      rows={unidades || []}
      columns={columns}
      rowCount={rowCount}
      loading={loading}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={sortModel} // ✅ añadido
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
    />
  );
}

// ✅ Validación de props
GridUnidad.propTypes = {
  unidades: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,         // ✅ Añadido
  setSortModel: PropTypes.func.isRequired,
  filterModel: PropTypes.object.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
