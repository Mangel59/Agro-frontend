
/**
 * GridProducto componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import PropTypes from 'prop-types'; // ✅ importar PropTypes
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'productocategoriaid', headerName: 'ID Categoría de producto', width: 90, type: 'number' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 100,
    type: 'number',
    valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo'
  },
];

/**
 * Componente GridProducto.
 * @module GridProducto.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridProducto(props) {
  return (
    <DataGrid
      rows={props.producto}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.producto.filter((row) =>
          selectedIDs.has(row.id)
        );
        props.setSelectedRow(selectedRowData[0]);
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

GridProducto.propTypes = {
  producto: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};
