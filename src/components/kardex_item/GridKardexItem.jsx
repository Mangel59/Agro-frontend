import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'kai_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'kai_kardex_id', headerName: 'Kardex', width: 150, type: 'number' },
  { field: 'kai_producto_presentacion_id', headerName: 'Producto Presentación', width: 150, type: 'number' },
  { field: 'kai_cantidad', headerName: 'Cantidad', width: 150, type: 'number' },
  { field: 'kai_precio', headerName: 'Precio', width: 150, type: 'number' },
  { field: 'kai_estado', headerName: 'Estado', width: 120, type: 'number' }
];

export default function GridKardexItem(props) {
  return (
    <DataGrid
      rows={props.kardexItems}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.kardexItems.filter((row) =>
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