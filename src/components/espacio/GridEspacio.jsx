import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'sedeId', headerName: 'Sede', width: 150, type: 'number' },
  { field: 'geolocalizacion', headerName: 'Geolocalización', width: 300, type: 'string',
    valueGetter: (params) => JSON.stringify(params.row.geolocalizacion) || '' },
  { field: 'latitud', headerName: 'Latitud', width: 150, type: 'number',
    valueGetter: (params) => params.row.geolocalizacion?.coordinates[1] || '' },
  { field: 'longitud', headerName: 'Longitud', width: 150, type: 'number',
    valueGetter: (params) => params.row.geolocalizacion?.coordinates[0] || '' },
  { field: 'estado', headerName: 'Estado', width: 120, type: 'number' },
];

export default function GridEspacio(props) {
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = props.espacios.find((row) => row.id === selectionModel[0]);
      props.setSelectedRow(selectedRow); // Actualiza la fila seleccionada en el componente padre
    } else {
      props.setSelectedRow(null); // Si no se selecciona ninguna fila
    }
  };

  return (
    <DataGrid
      rows={props.espacios || []}  // Si `props.espacios` es undefined, pasa un array vacío
      getRowId={(row) => row.id} 
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
