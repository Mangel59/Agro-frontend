
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'prp_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'prp_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'prp_producto_id', headerName: 'Producto', width: 150, type: 'number' },
  { field: 'prp_unidad_id', headerName: 'Unidad', width: 150, type: 'number' },
  { field: 'prp_descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'prp_estado', headerName: 'Estado', width: 120, type: 'number' },
  { field: 'prp_cantidad', headerName: 'Cantidad', width: 120, type: 'number' },
  { field: 'prp_marca_id', headerName: 'Marca', width: 150, type: 'number' },
  { field: 'prp_presentacion_id', headerName: 'Presentación', width: 150, type: 'number' }
];

export default function GridProductoPresentacion(props) {
  return (
    <DataGrid
      rows={props.productoPresentacion}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.productoPresentacion.filter((row) =>
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