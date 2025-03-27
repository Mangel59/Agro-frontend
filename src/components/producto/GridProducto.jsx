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
 * Columnas configuradas para el DataGrid.
 * Cada columna define su campo, encabezado y tipo.
 *
 * @type {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  {
    field: 'productoCategoria', // <- CAMBIO CLAVE
    headerName: 'ID Categoría de producto',
    width: 180,
    type: 'number',
  },  
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
 * Componente GridProducto.
 *
 * Renderiza una grilla de productos con paginación y permite seleccionar filas.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.producto - Lista de productos a mostrar.
 * @param {Function} props.setSelectedRow - Función para establecer el producto seleccionado.
 * @param {Object} [props.selectedRow] - Producto actualmente seleccionado.
 * @returns {JSX.Element} Grilla de productos.
 */
export default function GridProducto({ producto, setSelectedRow }) {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        rows={producto}
        getRowId={(row) => row.id} // Asegura que se use el ID correcto
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = producto.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
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
    </div>
  );
}

GridProducto.propTypes = {
  producto: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};
