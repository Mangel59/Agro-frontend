
/**
 * GridProductocategoria componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'estado', headerName: 'Estado', width: 100, type: 'number',
    valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo' },
];

/**
 * Componente GridProductocategoria.
 * @module GridProductoCategoria.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridProductocategoria(props) {
  return (
    <DataGrid
      rows={props.productocategorias}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.productocategorias.filter((row) =>
          selectedIDs.has(row.id)
        );
        props.setSelectedRow(selectedRowData[0]);
        console.log(props.selectedRow);
      }}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );
}