/**
 * @file GridTipoBloque.jsx
 * @module GridTipoBloque
 * @description Componente de grilla para visualizar los tipos de bloque. Permite seleccionar una fila para edición o eliminación. Utiliza `DataGrid` de MUI y comunica la fila seleccionada al componente padre.
 * @author Karla
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * @typedef {Object} TipoBloqueRow
 * @property {number} id - ID del tipo de bloque
 * @property {string} nombre - Nombre del tipo de bloque
 * @property {string} descripcion - Descripción del tipo de bloque
 * @property {number} estado - Estado del tipo de bloque (1: activo, 0: inactivo)
 */

/**
 * @typedef {Object} GridTipoBloqueProps
 * @property {TipoBloqueRow[]} bloques - Lista de tipos de bloque
 * @property {Function} setSelectedRow - Función para actualizar la fila seleccionada
 */

/**
 * Columnas definidas para el DataGrid.
 * @type {Object[]}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'descripcion', headerName: 'Descripción', width: 400 },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 120,
    valueFormatter: ({ value }) => (value === 1 ? 'Activo' : 'Inactivo'),
  },
];

/**
 * Componente GridTipoBloque.
 *
 * Muestra una tabla con los tipos de bloque disponibles, permitiendo la selección de una fila.
 *
 * @param {GridTipoBloqueProps} props
 * @returns {JSX.Element} Tabla de tipos de bloque
 */
export default function GridTipoBloque({ bloques, setSelectedRow }) {
  /**
   * Maneja la selección de una fila en la tabla.
   * @param {Array<number>} selectionModel - IDs seleccionados
   */
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selected = bloques.find((row) => row.id === selectionModel[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  return (
    <div style={{ width: '100%', marginTop: 16 }}>
      <DataGrid
        rows={bloques || []}
        getRowId={(row) => row.id}
        columns={columns}
        onRowSelectionModelChange={handleRowSelection}
        autoHeight
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}

GridTipoBloque.propTypes = {
  bloques: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
