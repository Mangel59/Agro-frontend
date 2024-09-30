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
  { field: 'alm_id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'alm_nombre', headerName: 'Nombre', width: 250, type: 'string' },
  { field: 'alm_descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  { field: 'alm_sede_id', headerName: 'Sede', width: 150, type: 'number' },
  { field: 'alm_geolocalizacion', headerName: 'Geolocalización', width: 300, type: 'string',
    valueGetter: (params) => JSON.stringify(params.row.alm_geolocalizacion) || '' },
  { field: 'latitud', headerName: 'Latitud', width: 150, type: 'number',
    valueGetter: (params) => params.row.alm_geolocalizacion?.coordinates[1] || '' },
  { field: 'longitud', headerName: 'Longitud', width: 150, type: 'number',
    valueGetter: (params) => params.row.alm_geolocalizacion?.coordinates[0] || '' },
  { field: 'alm_estado', headerName: 'Estado', width: 120, type: 'number' },
];

export default function GridAlmacen(props) {
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = props.almacenes.find((row) => row.alm_id === selectionModel[0]);
      props.setSelectedRow(selectedRow); // Actualiza la fila seleccionada
    } else {
      props.setSelectedRow(null); // Si no hay filas seleccionadas
    }
  };

  return (
    <DataGrid
      rows={props.almacenes}
      getRowId={(row) => row.alm_id} // Usa alm_id como el identificador único
      onRowSelectionModelChange={handleRowSelection} // Maneja la selección de filas
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
