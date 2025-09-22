// src/components/Marca/GridMarca.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * GridMarca
 * - Si recibes { paginationModel, setPaginationModel, rowCount, loading } => usa paginación "server"
 * - Si NO, usa paginación en cliente con pageSize=10 por defecto
 */
export default function GridMarca({
  // Datos
  rows = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación controlada (server-side)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,        // spinner
}) {
  /* ---------- Columnas ---------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90, type: "number" },
    { field: "nombre", headerName: "Nombre", width: 200, type: "string" },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 240, type: "string" },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      type: "number",
      valueGetter: (params) =>
        params?.row?.estado?.name ??
        params?.row?.estado?.nombre ??
        (String(params?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  /* ---------- Toolbar (filtros) ---------- */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  /* ---------- ¿Server o Cliente? ---------- */
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        rows={Array.isArray(rows) ? rows : []}
        columns={columns}
        getRowId={(row) => row.id}

        // Selección
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

        // Toolbar
        slots={{ toolbar: CustomToolbar }}

        // Paginación
        paginationMode={serverPagination ? "server" : "client"}
        loading={loading}
        {...(serverPagination
          ? {
              // ----- Server controlled -----
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize: paginationModel.pageSize ?? paginationModel.size ?? 10,
              },
              onPaginationModelChange: (model) => {
                const next = {
                  page: model.page ?? 0,
                  size: model.pageSize ?? model.size ?? 10,
                };
                setPaginationModel?.(next); // <- el padre hace el fetch con estos valores
              },
              rowCount,
            }
          : {
              // ----- Client fallback -----
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 10 } },
              },
            })}
        autoHeight
      />
    </Box>
  );
}

GridMarca.propTypes = {
  rows: PropTypes.array,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
