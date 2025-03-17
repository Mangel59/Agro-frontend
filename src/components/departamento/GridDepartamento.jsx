/**
 * GridDepartamento componente principal.
 *
 * Este componente renderiza una tabla con los departamentos usando el componente `DataGrid` de MUI.
 * Permite seleccionar una fila para su posterior edición o manejo externo.
 *
 * @module GridDepartamento
 * @component
 * @returns {JSX.Element} Tabla de departamentos con funcionalidad de selección.
 */

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

// ✅ Definición de columnas para la tabla
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'name', headerName: 'Nombre', width: 250, type: 'string' },
];

export default function GridDepartamento(props) {
  /**
   * Maneja la selección de filas del `DataGrid`.
   * @param {Array} selection - Lista de IDs seleccionados.
   */
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selectedRowData = props.departamentos.find((row) => row.id === selection[0]);
      props.setSelectedRow(selectedRowData);
      console.log('Fila seleccionada:', selectedRowData);
    } else {
      props.setSelectedRow(null);
    }
  };

  return (
    <DataGrid
      rows={props.departamentos}
      columns={columns}
      getRowId={(row) => row.id || row.uniqueID}  // Asegura un ID único para cada fila
      onRowSelectionModelChange={(selection) => handleRowSelection(selection)}
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

// ✅ Validación de props con PropTypes
GridDepartamento.propTypes = {
  /** Lista de departamentos a mostrar */
  departamentos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Función para actualizar la fila seleccionada */
  setSelectedRow: PropTypes.func.isRequired,
};
