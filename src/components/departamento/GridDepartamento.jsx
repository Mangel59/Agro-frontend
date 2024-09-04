import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

// Definición de las columnas para el DataGrid
const columns = [
  { field: 'dep_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'dep_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'dep_pais_id', headerName: 'Pais', width: 150, type: 'number' },
  { field: 'dep_codigo', headerName: 'Codigo', width: 150, type: 'number' },
  { field: 'dep_acronimo', headerName: 'Acronimo', width: 150, type: 'string' }
];

/**
 * Componente GridDepartamento que muestra una tabla de departamentos utilizando DataGrid.
 * 
 * @param {Object} props - Props del componente.
 * @param {Array} props.departamentos - Lista de departamentos a mostrar en la tabla.
 * @param {Function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element} Componente que contiene el DataGrid con los departamentos.
 */
export default function GridDepartamento(props) {
  return (
    <DataGrid
      rows={props.departamentos}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.departamentos.filter((row) =>
          selectedIDs.has(row.id)
        );
        props.setSelectedRow(selectedRowData[0]);
        console.log(props.selectedRow);
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
  );
}
