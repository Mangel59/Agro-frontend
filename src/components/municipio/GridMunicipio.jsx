/**
 * @file GridMunicipio.jsx
 * @module GridMunicipio
 * @description Componente de grilla para mostrar la lista de municipios utilizando DataGrid de Material UI.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Columnas de la tabla.
 * @type {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'name', headerName: 'Nombre', width: 250, type: 'string' },
];

/**
 * Componente GridMunicipio.
 *
 * Muestra una tabla con los datos de municipios.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.municipios - Lista de municipios.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element} Componente de tabla con los municipios.
 */
export default function GridMunicipio({ municipios, setSelectedRow }) {
  return (
    <DataGrid
      rows={municipios}
      columns={columns}
      onRowSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRowData = municipios.find((row) => selectedIDs.has(row.id));
        setSelectedRow(selectedRowData || null);
      }}
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

// Validación de props
GridMunicipio.propTypes = {
  municipios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
