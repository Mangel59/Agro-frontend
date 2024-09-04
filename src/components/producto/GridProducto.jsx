import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'tipoIdentificacionId', headerName: 'Tipo Identificación', width: 150, type: 'number',
    valueGetter: (params) => params.row.tipoIdentificacionId === 1 ? 'Cédula' : 'Pasaporte' },
  { field: 'identificacion', headerName: 'Identificación', width: 150, type: 'string' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'apellido', headerName: 'Apellido', width: 200, type: 'string' },
  { field: 'genero', headerName: 'Género', width: 100, type: 'string',
    valueGetter: (params) => params.row.genero ? 'Femenino' : 'Masculino' },
  { field: 'fechaNacimiento', headerName: 'Fecha de Nacimiento', width: 200, type: 'datetime' },
  { field: 'estrato', headerName: 'Estrato', width: 100, type: 'number' },
  { field: 'direccion', headerName: 'Dirección', width: 250, type: 'string' },
  { field: 'celular', headerName: 'Celular', width: 150, type: 'string' },
  { field: 'estado', headerName: 'Estado', width: 100, type: 'string',
    valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo' },
];

export default function GridPersona(props) {
  return (
    <DataGrid
      rows={props.personas}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.personas.filter((row) =>
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