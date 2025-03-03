import * as React from 'react';
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

export default function GridUnidad(props) {
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <DataGrid
      rows={props.unidades || []}
      columns={columns}
      rowCount={props.rowCount} // Añadir rowCount aquí para paginación
      loading={props.loading}
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
        const selectedRowData = props.unidades.find((row) => selectedIDs.has(row.id));
        props.setSelectedRow(selectedRowData || {});
      }}
    />
  );
}