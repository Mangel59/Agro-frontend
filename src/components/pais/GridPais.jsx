import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'pai_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'pai_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'pai_codigo', headerName: 'Codigo', width: 150, type: 'number' },
  { field: 'pai_acronimo', headerName: 'Acronimo', width: 150, type: 'string' }
];

export default function GridPais(props) {
  return (
    <DataGrid
      rows={props.pais}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.pais.filter((row) =>
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


