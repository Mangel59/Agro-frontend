/**
 * @file GridPais.jsx
 * @module GridPais
 * @description Componente de grilla para mostrar la lista de países. Utiliza Material UI DataGrid para mostrar y seleccionar datos.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Columnas para la tabla de países.
 * @constant
 * @type {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'name', headerName: 'Nombre', width: 250, type: 'string' },
];

/**
 * Componente GridPais.
 *
 * Muestra una tabla con los datos de países.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<{id: number, name: string}>} props.pais - Lista de países a mostrar.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element} Componente de tabla con datos de países.
 */
export default function GridPais({ pais, setSelectedRow }) {
  return (
    <DataGrid
      rows={pais}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = pais.find((row) => selectedIDs.has(row.id));
        setSelectedRow(selectedRowData || null);
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
      autoHeight
    />
  );
}

GridPais.propTypes = {
  pais: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
