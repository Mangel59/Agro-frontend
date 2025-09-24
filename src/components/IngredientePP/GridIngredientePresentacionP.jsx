// src/components/IngredientePresentacionProducto/GridIngredientePresentacionP.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridIngredientePresentacionP({
  // Datos
  rows = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 220 },

    // Ingrediente (nombre si viene anidado; fallback al ID)
    {
      field: "ingredienteId",
      headerName: "Ingrediente",
      width: 220,
      valueGetter: (p) =>
        p?.row?.ingrediente?.nombre ??
        p?.row?.ingrediente?.name ??
        String(p?.row?.ingredienteId ?? ""),
    },

    // Presentación de producto (nombre si viene anidado; fallback al ID)
    {
      field: "presentacionProductoId",
      headerName: "Presentación de producto",
      width: 260,
      valueGetter: (p) =>
        p?.row?.presentacionProducto?.nombre ??
        p?.row?.presentacionProducto?.name ??
        String(p?.row?.presentacionProductoId ?? ""),
    },

    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) =>
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  // ¿Server o Cliente?
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        rows={Array.isArray(rows) ? rows : []}
        columns={columns}
        getRowId={(row) => row.id}

        // Selección controlada
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

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
                setPaginationModel?.(next); // el padre hace el fetch con estos valores
              },
              rowCount,
            }
          : {
              // ----- Client fallback -----
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            })}
        autoHeight
      />
    </Box>
  );
}

GridIngredientePresentacionP.propTypes = {
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
