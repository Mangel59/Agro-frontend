
/**
 * GridProductoPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'producto', headerName: 'Producto', width: 150, type: 'number' },
  { field: 'unidad', headerName: 'Unidad', width: 90, type: 'number' },
  { field: 'cantidad', headerName: 'Cantidad', width: 100, type: 'number' },
  { field: 'marca', headerName: 'Marca', width: 100, type: 'number' },
  { field: 'presentacion', headerName: 'Presentación', width: 100, type: 'number' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 100,
    type: 'number',
    valueGetter: (params) => (params.row.estado === 1 ? 'Activo' : 'Inactivo'),
  },
];

/**
 * Componente GridProductoPresentacion.
 * @module GridProductoPresentacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridProductoPresentacion(props) {
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <DataGrid
      rows={props.presentaciones || []}
      columns={columns}
      rowCount={props.rowCount}
      paginationMode="server"
      paginationModel={props.paginationModel}
      onPaginationModelChange={props.setPaginationModel}
      sortingMode="server"
      onSortModelChange={(model) => props.setSortModel(model)}
      filterMode="server"
      onFilterModelChange={(model) => props.setFilterModel(model)}
      pageSizeOptions={[5, 10, 20, 50]}
      components={{
        Toolbar: CustomToolbar,
      }}
      onRowSelectionModelChange={(newSelection) => {
        const selectedIDs = new Set(newSelection);
        const selectedRowData = props.presentaciones.find((row) => selectedIDs.has(row.id));
        props.setSelectedRow(selectedRowData || {});
      }}
    />
  );
}
