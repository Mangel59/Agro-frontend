// import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";

// const columns = [
//   { field: "id", headerName: "ID", width: 90 },
//   { field: "nombre", headerName: "Nombre", width: 150 },
//   { field: "descripcion", headerName: "Descripción", width: 200 },
//   { field: "sedeId", headerName: "ID de Sede", width: 100 },
//   { field: "estado", headerName: "Estado", width: 100,
//     valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo") },
// ];

// export default function GridAlmacen(props) {
//   return (
//     <DataGrid
//       rows={props.almacenes}
//       onRowSelectionModelChange={(id) => {
//         const selectedIDs = new Set(id);
//         const selectedRowData = props.alamacenes.filter((row) =>
//           selectedIDs.has(row.id)
//         );
//         props.setSelectedRow(selectedRowData[0]);
//         console.log(props.selectedRow);
//       }}
//       columns={columns}
//       initialState={{
//         pagination: {
//           paginationModel: {
//             pageSize: 5,
//           },
//         },
//       }}
//       pageSizeOptions={[5, 10, 20, 50]}
//     />
//   );
// }

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
    valueGetter: (params) => params.row.geolocalizacion?.coordinates[1] || ''},
  { field: 'longitud', headerName: 'Longitud', width: 150, type: 'number',
    valueGetter: (params) => params.row.geolocalizacion?.coordinates[0] || '' },
  { field: 'estado', headerName: 'Estado', width: 120, type: 'number' },
];

export default function GridAlmacen(props) {
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = props.almacenes.find((row) => row.id === selectionModel[0]);
      props.setSelectedRow(selectedRow); // Update the selected row in the parent component
    } else {
      props.setSelectedRow(null); // If no row is selected
    }
  };

  return (
    <DataGrid
      rows={props.almacenes}
      getRowId={(row) => row.id} // Ensure each row has a unique ID
      onRowSelectionModelChange={handleRowSelection} // Handle row selection
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
