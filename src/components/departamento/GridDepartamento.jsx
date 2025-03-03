import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

// Definición de las columnas para el DataGrid
const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'name', headerName: 'Nombre', width: 250, type: 'string' },
];

/**
 * Componente GridDepartamento que muestra una tabla de departamentos utilizando DataGrid.
 */
export default function GridDepartamento(props) {
  // Manejo de selección de fila
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
      getRowId={(row) => row.id || row.uniqueID}  // Asegúrate de que cada fila tenga un ID único
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

// Definición de PropTypes
GridDepartamento.propTypes = {
  departamentos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
