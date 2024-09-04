import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'estado', headerName: 'Estado', width: 100, type: 'string',
    valueGetter: (params) => params.row.estado === 1 ? "Activo" : "Inactivo"
  },
  { field: 'celular', headerName: 'Celular', width: 100, type: 'string' },
  { field: 'correo', headerName: 'Correo', width: 150, type: 'string' },
  { field: 'contacto', headerName: 'Contacto', width: 150, type: 'string' },
  { field: 'tipoIdentificacionId', headerName: 'Tipo de Identificación', width: 150, type: 'number' },
  { field: 'personaId', headerName: 'Persona', width: 100, type: 'number' },
  { field: 'identificacion', headerName: 'No. de Identificación', width: 150, type: 'string' }
];

export default function GridEmpresa(props) {
  return (
    <DataGrid
      rows={props.empresas}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.empresas.filter((row) =>
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
