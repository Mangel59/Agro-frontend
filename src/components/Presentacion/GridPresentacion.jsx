/**
 * @file GridPresentacion.jsx
 * @module GridPresentacion
 * @description Componente de grilla para mostrar la lista de presentaciones. Utiliza Material UI DataGrid para mostrar, seleccionar y paginar datos.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Columnas definidas para el DataGrid.
 * @constant
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
 * Componente GridPresentacion.
 *
 * Muestra una tabla con los datos de presentaciones.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.Presentacion - Lista de presentaciones a mostrar.
 * @param {function(Object): void} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {Object} [props.selectedRow] - La fila actualmente seleccionada (opcional).
 * @returns {JSX.Element} Componente de tabla con datos de presentaciones.
 */
export default function GridPresentacion({ Presentacion, setSelectedRow }) {
  return (
    <DataGrid
      rows={Presentacion}
      columns={columns}
      onRowSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRowData = Presentacion.find((row) => selectedIDs.has(row.id));
        setSelectedRow(selectedRowData || null);
      }}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
      getRowId={(row) => row.id}
      autoHeight
    />
  );
}

GridPresentacion.propTypes = {
  Presentacion: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};
