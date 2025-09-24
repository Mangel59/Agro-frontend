// src/components/Kardex/GridKardex.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridKardex({
  // Datos
  kardexes = [],
  almacenes = [],
  producciones = [],
  tiposMovimiento = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,        // spinner
}) {
  /* ---------- Mapas de lookup ---------- */
  const almById = useMemo(() => {
    const m = {};
    for (const a of almacenes ?? []) {
      m[String(a?.id)] = a?.name ?? a?.nombre ?? `Almacén ${a?.id ?? ""}`;
    }
    return m;
  }, [almacenes]);

  const prodById = useMemo(() => {
    const m = {};
    for (const p of producciones ?? []) {
      m[String(p?.id)] = p?.name ?? p?.nombre ?? `Producción ${p?.id ?? ""}`;
    }
    return m;
  }, [producciones]);

  const tmovById = useMemo(() => {
    const m = {};
    for (const t of tiposMovimiento ?? []) {
      m[String(t?.id)] = t?.name ?? t?.nombre ?? `Tipo ${t?.id ?? ""}`;
    }
    return m;
  }, [tiposMovimiento]);

  const safeDateTime = (val) => (val ? new Date(val).toLocaleString() : "");

  /* ---------- Columnas ---------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fechaHora",
      headerName: "Fecha/Hora",
      width: 180,
      valueGetter: (p) => safeDateTime(p?.row?.fechaHora),
    },
    {
      field: "almacenId",
      headerName: "Almacén",
      width: 200,
      valueGetter: (p) =>
        p?.row?.almacen?.name ??
        p?.row?.almacen?.nombre ??
        almById[String(p?.row?.almacenId)] ??
        String(p?.row?.almacenId ?? ""),
    },
    {
      field: "produccionId",
      headerName: "Producción",
      width: 200,
      valueGetter: (p) =>
        p?.row?.produccion?.name ??
        p?.row?.produccion?.nombre ??
        prodById[String(p?.row?.produccionId)] ??
        String(p?.row?.produccionId ?? ""),
    },
    {
      field: "tipoMovimientoId",
      headerName: "Tipo Movimiento",
      width: 220,
      valueGetter: (p) =>
        p?.row?.tipoMovimiento?.name ??
        p?.row?.tipoMovimiento?.nombre ??
        tmovById[String(p?.row?.tipoMovimientoId)] ??
        String(p?.row?.tipoMovimientoId ?? ""),
    },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 260 },
    { field: "empresaId", headerName: "Empresa", width: 120 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) => {
        const state =
          p?.row?.estado?.name ??
          p?.row?.estado?.nombre ??
          p?.row?.estadoId;
        if (state === 1 || state === "1") return "Activo";
        if ([0, "0", 2, "2"].includes(state)) return "Inactivo";
        return String(state ?? "");
      },
    },
  ]), [almById, prodById, tmovById]);

  /* ---------- ¿Server o Cliente? ---------- */
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(kardexes) ? kardexes : []}
        columns={columns}
        getRowId={(row) => row.id}

        // Selección
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

GridKardex.propTypes = {
  kardexes: PropTypes.array,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  almacenes: PropTypes.array,
  producciones: PropTypes.array,
  tiposMovimiento: PropTypes.array,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
