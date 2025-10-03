import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 220 },
  { field: "tipoActividadNombre", headerName: "Tipo Actividad", width: 220 },
  { field: "evaluacionId", headerName: "Evaluación", width: 150 },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 120,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridOcupacion({ ocupaciones = [], selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={ocupaciones}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </Box>
  );
}
