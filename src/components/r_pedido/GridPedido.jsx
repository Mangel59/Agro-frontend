// import React from 'react';

// export default function GridPedido({ data }) {
//   if (!Array.isArray(data) || data.length === 0) {
//     return <p>No hay datos para mostrar.</p>;
//   }

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Producto</th>
//           <th>Cantidad</th>
//           <th>Unidad</th>
//           <th>Almacén</th>
//           <th>Sede</th>
//           <th>Empresa</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <tr key={index}>
//             <td>{item.item_producto}</td>
//             <td>{item.item_cantidad}</td>
//             <td>{item.item_unidad}</td>
//             <td>{item.header_almacen_nombre}</td>
//             <td>{item.header_sede}</td>
//             <td>{item.header_empresa}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }


// PARTE 2
// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Button } from '@mui/material';

// export default function GridPedido({ pedidos, onDeletePedido }) {
//   const columns = [
//     { field: 'id', headerName: 'ID', width: 100 },
//     { field: 'fechaHora', headerName: 'Fecha y Hora', width: 200 },
//     { field: 'almacen', headerName: 'Almacén', width: 150 },
//     { field: 'descripcion', headerName: 'Descripción', width: 300 },
//     { field: 'estado', headerName: 'Estado', width: 100 },
//     {
//       field: 'acciones',
//       headerName: 'Acciones',
//       width: 150,
//       renderCell: (params) => (
//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={() => onDeletePedido(params.row.id)}
//         >
//           Eliminar
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid rows={pedidos} columns={columns} getRowId={(row) => row.id} />
//     </div>
//   );
// }


// //PARTE 2
// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Box, Button } from "@mui/material";

// export default function GridPedido({ pedidos, onGenerateReport, onSelectPedido }) {
//   const columns = [
//     { field: "id", headerName: "ID", width: 100 },
//     { field: "fechaHora", headerName: "Fecha y Hora", width: 200 },
//     { field: "almacen", headerName: "Almacén", width: 150 },
//     { field: "produccion", headerName: "Producción", width: 200 },
//     { field: "descripcion", headerName: "Descripción", width: 300 },
//     { field: "estado", headerName: "Estado", width: 100 },
//   ];

//   return (
//     <Box>
//       <div style={{ height: 400, width: "100%" }}>
//         <DataGrid
//           rows={pedidos}
//           columns={columns}
//           getRowId={(row) => row.id}
//           onRowClick={(params) => onSelectPedido(params.row)}
//         />
//       </div>
//       <Box mt={2}>
//         <Button variant="contained" color="success" onClick={onGenerateReport}>
//           GENERAR REPORTE
//         </Button>
//       </Box>
//     </Box>
//   );
// }

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

export default function GridPedido({ pedidos, onGenerateReport, onSelectPedido }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fechaHora", headerName: "Fecha y Hora", width: 200 },
    { field: "almacen", headerName: "Almacén", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "estado", headerName: "Estado", width: 100 },
  ];

  return (
    <Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={pedidos}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => onSelectPedido(params.row)}
        />
      </div>
      <Box mt={2}>
        <Button variant="contained" color="success" onClick={onGenerateReport}>
          GENERAR REPORTE
        </Button>
      </Box>
    </Box>
  );
}


