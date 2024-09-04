import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'pro_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'pro_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'pro_tipo_produccion_id', headerName: 'Tipo Producción', width: 150, type: 'number' },
  { field: 'pro_descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'pro_estado', headerName: 'Estado', width: 120, type: 'number' },
  { 
    field: 'pro_fecha_inicio', 
    headerName: 'Fecha Inicio', 
    width: 200, 
    type: 'dateTime',
    valueGetter: (params) => new Date(params.value) 
  },
  { 
    field: 'pro_fecha_final', 
    headerName: 'Fecha Final', 
    width: 200, 
    type: 'dateTime',
    valueGetter: (params) => new Date(params.value) 
  },
  { field: 'pro_espacio_id', headerName: 'Espacio', width: 150, type: 'number' }
];

export default function GridProduccion(props) {
  return (
    <DataGrid
      rows={props.produccion}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.produccion.filter((row) =>
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
      pageSizeOptions={[5,10,20,50]}
    />
  );
}




