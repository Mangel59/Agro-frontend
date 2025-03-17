
/**
 * GridProveedor componente principal.
 * @component
 * @returns {JSX.Element}
 */
// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";

// const columns = [
//   { field: "id", headerName: "ID", width: 90 },
//   { field: "nombre", headerName: "Nombre", width: 150 },
//   { field: "descripcion", headerName: "Descripción", width: 250 },
//   {
//     field: "estado",
//     headerName: "Estado",
//     width: 120,
//     valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
//   },
//   { field: "empresa", headerName: "Empresa", width: 150 },
// ];

/**
 * Componente GridProveedor.
 * @module GridProveedor.jsx
 * @component
 * @returns {JSX.Element}
 */
// export default function GridProveedor(props) {
//   return (
//     <div style={{ height: 400, width: "100%" }}>
//       <DataGrid
//         rows={props.proveedores}
//         columns={columns}
//         paginationModel={props.paginationModel}
//         onPaginationModelChange={props.setPaginationModel}
//         getRowId={(row) => row.id}
//       />
//     </div>
//   );
// }

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "pro_id", headerName: "ID", width: 90 },
  { field: "pro_empresa_id", headerName: "Empresa ID", width: 150 },
  { field: "pro_fecha_creacion", headerName: "Fecha Creación", width: 200 },
  {
    field: "pro_estado",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.pro_estado === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridProveedor({ proveedores, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={proveedores}
        columns={columns}
        getRowId={(row) => row.pro_id}
        onRowClick={(rowData) => onEdit(rowData.row)} // Seleccionar fila
      />
    </div>
  );
}


