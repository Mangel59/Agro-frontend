/**
 * @file GridProducto.jsx
 * @module GridProducto
 * @description Componente de grilla para mostrar la lista de productos. Utiliza DataGrid de MUI para paginación, selección y visualización de datos como nombre, categoría, descripción y estado (activo/inactivo).
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Definición de las columnas para la grilla de productos.
 * @constant
 * @type {Array<Object>}
 */
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
 *
 * Renderiza una grilla de productos con paginación y selección.
 *
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.producto - Lista de productos a mostrar.
 * @param {Function} props.setSelectedRow - Función para establecer el producto seleccionado.
 * @param {Object} [props.selectedRow] - Producto actualmente seleccionado.
 * @returns {JSX.Element} Grilla de productos.
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

// Validación de props con PropTypes
GridProducto.propTypes = {
  producto: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};
