
/**
 * CustomToolbar componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

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
 * Componente GridMarca.
 * @module GridMarca.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridMarca({
  marcas,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  sortModel, // ✅ recibido como prop
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
      sortModel={sortModel} // ✅ agregado aquí
      onSortModelChange={(model) => setSortModel(model)} // ✅ agregado aquí
      filterMode="server"
      onFilterModelChange={(model) => setFilterModel(model)}
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
  sortModel: PropTypes.array.isRequired, // ✅ validación agregada
  setSortModel: PropTypes.func.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
