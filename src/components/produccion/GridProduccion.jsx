import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function GridProduccion({
  loading = false,
  producciones = [],
  selectedRow,
  setSelectedRow,
  page = 0,
  rowsPerPage = 10,
  totalElements = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}) {
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 180 },
    { field: "descripcion", headerName: "Descripción", flex: 1.4, minWidth: 220 },
    { field: "fechaInicio", headerName: "Fecha Inicio", flex: 1, minWidth: 170 },
    { field: "fechaFinal", headerName: "Fecha Final", flex: 1, minWidth: 170 },

    // Nombres (no IDs):
    { field: "tipoProduccionNombre", headerName: "Tipo Producción", flex: 1, minWidth: 170 },
    { field: "espacioNombre", headerName: "Espacio", flex: 1, minWidth: 150 },
    { field: "subSeccionNombre", headerName: "Subsección", flex: 1, minWidth: 170 },
    { field: "estadoNombre", headerName: "Estado", flex: 0.8, minWidth: 120 },
  ]), []);

  const paginationModel = { page, pageSize: rowsPerPage };

  const handlePaginationModelChange = (model) => {
    const nextPage = model?.page ?? 0;
    const nextSize = model?.pageSize ?? 10;
    if (nextSize !== rowsPerPage) {
      onRowsPerPageChange(nextSize);
    } else if (nextPage !== page) {
      onPageChange(null, nextPage);
    }
  };

  return (
    <div style={{ width: "100%", height: 500  }}>
      <DataGrid
        rows={producciones}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        disableColumnMenu
        paginationMode="server"
        rowCount={totalElements}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        // selección controlada
        rowSelectionModel={selectedRow ? [selectedRow.id] : []}
        onRowSelectionModelChange={(selection) => {
          const id = selection?.[0];
          const row = producciones.find((r) => r.id === id) || null;
          setSelectedRow(row);
        }}
        onRowClick={(params) => setSelectedRow?.(params.row)} // también por click en la fila
        sx={{
          fontSize: "0.95rem",
          "& .MuiDataGrid-cell": { outline: "none" },
        }}
      />
    </div>
  );
}
