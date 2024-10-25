import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'kar_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'kar_fecha_hora', headerName: 'Fecha y Hora', width: 200, type: 'dateTime',
    valueGetter: (params) => new Date(params.row.kar_fecha_hora).toLocaleString() },
  { field: 'kar_almacen_id', headerName: 'Almacén', width: 150, type: 'number' },
  { field: 'kar_produccion_id', headerName: 'Producción', width: 150, type: 'number' },
  { field: 'kar_tipo_movimiento_id', headerName: 'Tipo Movimiento', width: 150, type: 'number' },
  { field: 'kar_descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'kar_estado', headerName: 'Estado', width: 120, type: 'number' }
];

export default function GridKardex(props) {
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = props.kardex.find((row) => row.kar_id === selectionModel[0]);
      props.setSelectedRow(selectedRow); 
    } else {
      props.setSelectedRow(null); 
    }
  };
  
  return (
    <DataGrid
      rows={props.kardex}
      getRowId={(row) => row.kar_id} 
      onRowSelectionModelChange={handleRowSelection} 
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
