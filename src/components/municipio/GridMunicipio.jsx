import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'mun_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'mun_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'mun_departamento_id', headerName: 'Departamento', width: 150, type: 'number' },
  { field: 'mun_codigo', headerName: 'Codigo', width: 150, type: 'number' },
  { field: 'mun_acronimo', headerName: 'Acronimo', width: 150, type: 'string' }
];

export default function GridMunicipio(props) {
  return (
    <DataGrid
      rows={props.municipios}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.municipios.filter((row) =>
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