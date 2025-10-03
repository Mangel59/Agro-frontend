// src/components/Produccion/GridProduccion.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridProduccion({
  // Datos
  producciones = [],
  loading = false,

  // Selección
  selectedRow = null,
  setSelectedRow,

  // --- Server-side (estilo A: MUI) ---
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total

  // --- Server-side (estilo B: tu implementación previa) ---
  page = 0,
  rowsPerPage = 10,
  totalElements = 0,
  onPageChange,           // (event, nextPage) => void
  onRowsPerPageChange,    // (nextSize) => void
}) {
  /* ---------- Helpers ---------- */
  const safeDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime())
      ? String(v).substring(0, 10)
      : d.toISOString().substring(0, 10);
  };

  /* ---------- Columnas ---------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 180 },
    { field: "descripcion", headerName: "Descripción", flex: 1.4, minWidth: 220 },
    {
      field: "fechaInicio",
      headerName: "Fecha Inicio",
      flex: 1,
      minWidth: 150,
      valueGetter: (p) => safeDate(p?.row?.fechaInicio),
    },
    {
      field: "fechaFinal",
      headerName: "Fecha Final",
      flex: 1,
      minWidth: 150,
      valueGetter: (p) => safeDate(p?.row?.fechaFinal),
    },

    // Nombres (no IDs) con fallbacks a objetos anidados o Ids
    {
      field: "tipoProduccionNombre",
      headerName: "Tipo Producción",
      flex: 1,
      minWidth: 170,
      valueGetter: (p) =>
        p?.row?.tipoProduccionNombre ??
        p?.row?.tipoProduccion?.nombre ??
        p?.row?.tipoProduccion?.name ??
        String(p?.row?.tipoProduccionId ?? ""),
    },
    {
      field: "espacioNombre",
      headerName: "Espacio",
      flex: 1,
      minWidth: 150,
      valueGetter: (p) =>
        p?.row?.espacioNombre ??
        p?.row?.espacio?.nombre ??
        p?.row?.espacio?.name ??
        String(p?.row?.espacioId ?? ""),
    },
    {
      field: "subSeccionNombre",
      headerName: "Subsección",
      flex: 1,
      minWidth: 170,
      valueGetter: (p) =>
        p?.row?.subSeccionNombre ??
        p?.row?.subseccionNombre ??
        p?.row?.subSeccion?.nombre ??
        p?.row?.subSeccion?.name ??
        String(p?.row?.subSeccionId ?? p?.row?.subseccionId ?? ""),
    },
    {
      field: "estadoNombre",
      headerName: "Estado",
      flex: 0.8,
      minWidth: 120,
      valueGetter: (p) =>
        p?.row?.estadoNombre ??
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  /* ---------- ¿Server con estilo A o B? ---------- */
  const hasStyleA = Boolean(paginationModel && setPaginationModel && typeof rowCount === "number");
  const hasStyleB = Boolean(typeof totalElements === "number" && (onPageChange || onRowsPerPageChange));

  return (
    <div style={{ width: "100%", height: 500 }}>
      <DataGrid
        rows={Array.isArray(producciones) ? producciones : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        disableColumnMenu

        // Selección controlada (click y por modelo)
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

        // ---- Server-side estilo A (MUI): paginationModel/rowCount ----
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

        // ---- Server-side estilo B (legacy): page/rowsPerPage/totalElements ----
        {...(!hasStyleA && hasStyleB
          ? {
              paginationMode: "server",
              rowCount: totalElements ?? 0,
              paginationModel: { page, pageSize: rowsPerPage },
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

        // ---- Fallback cliente si no hay control server ----
        {...(!hasStyleA && !hasStyleB
          ? {
              paginationMode: "client",
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            }
          : {})}
      />
    </div>
  );
}

GridProduccion.propTypes = {
  producciones: PropTypes.array,
  loading: PropTypes.bool,

  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,

  // Estilo A (MUI)
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
