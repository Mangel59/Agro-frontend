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
    { field: "descripcion", headerName: "Descripción", flex: 1.2, minWidth: 200 },
    { field: "fechaInicio", headerName: "Fecha Inicio", flex: 1, minWidth: 160 },
    { field: "fechaFinal", headerName: "Fecha Final", flex: 1, minWidth: 160 },

    // Mostrar NOMBRES (no IDs):
    { field: "tipoProduccionNombre", headerName: "Tipo Producción", flex: 1, minWidth: 170 },
    { field: "espacioNombre", headerName: "Espacio", flex: 1, minWidth: 150 },
    { field: "subSeccionNombre", headerName: "Subsección", flex: 1, minWidth: 170 },
    { field: "estadoNombre", headerName: "Estado", flex: 0.8, minWidth: 120 },
  ]), []);

  // Adaptador para el DataGrid (server-side)
  const paginationModel = { page, pageSize: rowsPerPage };

  const handlePaginationModelChange = (model) => {
    const nextPage = model?.page ?? 0;
    const nextSize = model?.pageSize ?? 10;

    // Si cambia solo el pageSize, reiniciamos a página 0
    if (nextSize !== rowsPerPage) {
      onRowsPerPageChange(nextSize);
    } else if (nextPage !== page) {
      onPageChange(null, nextPage);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={producciones}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        loading={loading}
        disableColumnMenu
        paginationMode="server"
        rowCount={totalElements}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        onRowClick={(params) => setSelectedRow?.(params.row)}
        // Selección visual
        rowSelectionModel={selectedRow ? [selectedRow.id] : []}
      />
    </div>
  );
}
