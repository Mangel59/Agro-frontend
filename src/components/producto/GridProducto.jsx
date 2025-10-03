// src/components/Producto/GridProducto.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function GridProducto({
  // Datos
  productos = [],
  loading = false,

  // Selección
  selectedRow = null,
  setSelectedRow,

  // --- Server-side estilo A (MUI v6) ---
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total

  // --- Server-side estilo B (legacy) ---
  page,
  rowsPerPage,
  totalElements,
  onPageChange,           // (event, nextPage) => void
  onRowsPerPageChange,    // (nextSize) => void
}) {
  /* ---------- Columnas con lookups seguros ---------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    {
      field: "productoCategoriaNombre",
      headerName: "Categoría",
      width: 200,
      valueGetter: (p) =>
        p?.row?.productoCategoriaNombre ??
        p?.row?.categoria?.nombre ??
        p?.row?.categoria?.name ??
        String(p?.row?.productoCategoriaId ?? ""),
    },
    {
      field: "unidadMinimaNombre",
      headerName: "Unidad mínima",
      width: 180,
      valueGetter: (p) =>
        p?.row?.unidadMinimaNombre ??
        p?.row?.unidadMinima?.nombre ??
        p?.row?.unidadMinima?.name ??
        String(p?.row?.unidadMinimaId ?? ""),
    },
    {
      field: "ingredientePresentacionNombre",
      headerName: "Ingrediente presentación",
      width: 240,
      valueGetter: (p) =>
        p?.row?.ingredientePresentacionNombre ??
        p?.row?.ingredientePresentacion?.nombre ??
        p?.row?.ingredientePresentacion?.name ??
        String(p?.row?.ingredientePresentacionId ?? ""),
    },
    {
      field: "estadoNombre",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) =>
        p?.row?.estadoNombre ??
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 220 },
  ]), []);

  /* ---------- ¿Server estilo A o B? ---------- */
  const hasStyleA = Boolean(paginationModel && setPaginationModel && typeof rowCount === "number");
  const hasStyleB = typeof totalElements === "number" && (onPageChange || onRowsPerPageChange);

  return (
    <Box sx={{ height: 560, width: "100%" }}>
      <DataGrid
        rows={Array.isArray(productos) ? productos : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}

        // Selección controlada
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

        // Loading overlay (v5/v6)
        components={{ LoadingOverlay: LinearProgress }}
        slots={{ loadingOverlay: LinearProgress }}

        // -------- Server-side estilo A (MUI v6) --------
        {...(hasStyleA
          ? {
              paginationMode: "server",
              rowCount,
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize: paginationModel.pageSize ?? paginationModel.size ?? 10,
              },
              onPaginationModelChange: (model) => {
                const next = {
                  page: model.page ?? 0,
                  size: model.pageSize ?? model.size ?? 10,
                };
                setPaginationModel?.(next);
              },
            }
          : {})}

        // -------- Server-side estilo B (legacy) --------
        {...(!hasStyleA && hasStyleB
          ? {
              paginationMode: "server",
              rowCount: totalElements ?? 0,
              paginationModel: { page: page ?? 0, pageSize: rowsPerPage ?? 10 },
              onPaginationModelChange: (model) => {
                const nextPage = model?.page ?? 0;
                const nextSize = model?.pageSize ?? rowsPerPage ?? 10;
                if (nextSize !== rowsPerPage) {
                  onRowsPerPageChange?.(nextSize);
                } else if (nextPage !== page) {
                  onPageChange?.(null, nextPage);
                }
              },
            }
          : {})}

        // -------- Fallback cliente --------
        {...(!hasStyleA && !hasStyleB
          ? {
              paginationMode: "client",
              pageSizeOptions: [5, 10, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            }
          : {})}
      />
    </Box>
  );
}

GridProducto.propTypes = {
  productos: PropTypes.array,
  loading: PropTypes.bool,

  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,

  // Estilo A (MUI v6)
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,

  // Estilo B (legacy)
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalElements: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};
