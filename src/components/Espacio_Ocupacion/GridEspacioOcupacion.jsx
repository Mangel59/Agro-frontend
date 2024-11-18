import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'espacio', headerName: 'Espacio', width: 150 },
  { field: 'espacioacti', headerName: 'Espacio Actividad', width: 200 },
  { field: 'fechainicio', headerName: 'Fecha Inicio', width: 200 },
  { field: 'fechafin', headerName: 'Fecha Fin', width: 200 },
  { field: 'estado', headerName: 'Estado', width: 100 },
];

export default function GridEspacioOcupacion(props) {
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = props.espacioocu.find((row) => row.id === selectionModel[0]);
      props.setSelectedRow(selectedRow);
    } else {
      props.setSelectedRow(null);
    }
  };

  return (
    <DataGrid
      rows={props.espacioocu || []} // Pasa los datos aquí
      getRowId={(row) => row.id} // Usa "id" como clave única
      columns={columns}
      pageSizeOptions={[5, 10, 15]}
      onRowSelectionModelChange={handleRowSelection}
    />
  );
}
