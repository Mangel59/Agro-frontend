/**
 * @file GridProductoCategoria.jsx
 * @module GridProductoCategoria
 * @description Componente de grilla para mostrar la lista de categorías de productos. Utiliza DataGrid de Material UI para paginar, seleccionar y visualizar los datos con estado activo/inactivo.
 * @author Karla
 */

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Definición de columnas para la grilla de categorías de productos.
 * @type {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
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
 * Componente GridProductoCategoria.
 *
 * Muestra una tabla de categorías con paginación y selección.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.productocategorias - Lista de categorías a mostrar
 * @param {function(Object): void} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @returns {JSX.Element} Tabla renderizada con las categorías
 */
export default function GridProductoCategoria(props) {
  return (
    <DataGrid
      rows={props.productocategorias}
      onRowSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRowData = props.productocategorias.find((row) => selectedIDs.has(row.id));
        props.setSelectedRow(selectedRowData || null);
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
      getRowId={(row) => row.id}
    />
  );
}
