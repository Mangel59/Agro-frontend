import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'estado', headerName: 'Estado', width: 100, type: 'number',
    valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo' },
];

/**
 * El componente GridPersona muestra una tabla con los datos de las Presentacion.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @param {array} props.Presentacion - Lista de Presentacion a mostrar en la tabla.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @returns {JSX.Element} La tabla de datos de Presentacion.
 */

export default function GridPresentacion(props) {
  return (
    <DataGrid
      rows={props.Presentacion}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.Presentacion.filter((row) =>
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