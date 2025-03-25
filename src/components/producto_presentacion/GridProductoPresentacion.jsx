/**
 * @file GridProductoPresentacion.jsx
 * @module GridProductoPresentacion
 * @description Componente de grilla para visualizar la lista de productos presentación. Soporta paginación, ordenamiento y filtros desde el servidor. Utiliza Material UI DataGrid con barra de herramientas personalizada. Selecciona filas para edición externa usando setSelectedRow.
 * @author Karla
 */

import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';

/**
 * Columnas definidas para la grilla de productos presentación.
 * @constant
 * @type {Array<Object>}
 */
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
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.presentaciones - Lista de presentaciones a mostrar
 * @param {number} props.rowCount - Total de filas (para paginación server-side)
 * @param {Object} props.paginationModel - Modelo de paginación actual
 * @param {function(Object): void} props.setPaginationModel - Setter del modelo de paginación
 * @param {function(Object): void} props.setSortModel - Setter del modelo de ordenamiento
 * @param {function(Object): void} props.setFilterModel - Setter del modelo de filtros
 * @param {function(Object): void} props.setSelectedRow - Setter del elemento seleccionado
 * @returns {JSX.Element} Grilla de producto presentación con toolbar y selección de filas
 */
export default function GridProductoPresentacion(props) {
  /**
   * Barra de herramientas personalizada con botón de filtro.
   * @returns {JSX.Element}
   */
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
        const selectedRowData = props.presentaciones.find((row) =>
          selectedIDs.has(row.id)
        );
        props.setSelectedRow(selectedRowData || {});
      }}
    />
  );
}
