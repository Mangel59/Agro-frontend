/**
 * @file GridProductoCategoria.jsx
 * @module GridProductoCategoria
 * @description Componente de grilla para mostrar la lista de categorías de productos. Utiliza DataGrid de Material UI para paginar, seleccionar y visualizar los datos con estado activo/inactivo. Incluye estilo responsive para que no se desborde.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Definición de columnas para la grilla de categorías de productos.
 * Cada columna contiene su campo, título, ancho y tipo.
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
 * Muestra una tabla con categorías de productos, permite seleccionar una fila y admite paginación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.productocategorias - Lista de categorías a mostrar.
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @param {number} props.rowCount - Número total de filas en el backend.
 * @param {Object} props.paginationModel - Modelo de paginación.
 * @param {Function} props.setPaginationModel - Función para actualizar la paginación.
 * @returns {JSX.Element} Tabla renderizada con las categorías.
 */
export default function GridProductoCategoria({
  productocategorias,
  setSelectedRow,
  rowCount,
  paginationModel,
  setPaginationModel
}) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <DataGrid
        autoHeight
        rows={productocategorias}
        columns={columns}
        getRowId={(row) => row.id}
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 20, 50]}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = productocategorias.find((row) =>
            selectedIDs.has(row.id)
          );
          setSelectedRow(selectedRowData || null);
        }}
      />
    </div>
  );
}

GridProductoCategoria.propTypes = {
  productocategorias: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
};
