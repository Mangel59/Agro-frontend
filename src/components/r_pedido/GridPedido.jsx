// src/components/Pedido/GridPedido.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridPedido({
  // Datos
  pedidos = [],
  producciones = [],
  almacenes = [],
  estados = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación server-side (opcional)
  loading = false,
  rowCount,
  paginationModel,               // { page, pageSize } o { page, size }
  onPaginationModelChange,       // (next) => void
}) {
  /* -------- Lookups id->nombre -------- */
  const prodById = useMemo(() => {
    const m = {};
    for (const p of producciones ?? []) m[String(p?.id)] = p?.name ?? p?.nombre ?? `Producción ${p?.id ?? ""}`;
    return m;
  }, [producciones]);

  const almById = useMemo(() => {
    const m = {};
    for (const a of almacenes ?? []) m[String(a?.id)] = a?.name ?? a?.nombre ?? `Almacén ${a?.id ?? ""}`;
    return m;
  }, [almacenes]);

  const estById = useMemo(() => {
    const m = {};
    for (const e of estados ?? []) m[String(e?.id)] = e?.name ?? e?.nombre ?? `Estado ${e?.id ?? ""}`;
    return m;
  }, [estados]);

  const safeDateTime = (v) => (v ? new Date(v).toLocaleString() : "");

  /* -------- Columnas -------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80, type: "number" },
    { field: "descripcion", headerName: "Descripción", flex: 1.2, minWidth: 220 },
    {
      field: "fechaHora",
      headerName: "Fecha y Hora",
      width: 200,
      valueGetter: (p) => safeDateTime(p?.row?.fechaHora),
    },
    {
      field: "produccionId",
      headerName: "Producción",
      width: 220,
      valueGetter: (p) =>
        p?.row?.produccion?.nombre ??
        p?.row?.produccion?.name ??
        prodById[String(p?.row?.produccionId)] ??
        String(p?.row?.produccionId ?? ""),
    },
    {
      field: "almacenId",
      headerName: "Almacén",
      width: 220,
      valueGetter: (p) =>
        p?.row?.almacen?.nombre ??
        p?.row?.almacen?.name ??
        almById[String(p?.row?.almacenId)] ??
        String(p?.row?.almacenId ?? ""),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 180,
      valueGetter: (p) => {
        const id = p?.row?.estado?.id ?? p?.row?.estadoId;
        return (
          p?.row?.estado?.nombre ??
          p?.row?.estado?.name ??
          estById[String(id)] ??
          String(id ?? "")
        );
      },
    },
  ]), [prodById, almById, estById]);

  /* -------- ¿Server o cliente? -------- */
  const serverPaging = Boolean(
    typeof rowCount === "number" &&
    paginationModel &&
    (typeof paginationModel.page === "number") &&
    (typeof (paginationModel.pageSize ?? paginationModel.size) === "number") &&
    typeof onPaginationModelChange === "function"
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(pedidos) ? pedidos : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}

        // Selección controlada por clic (simple)
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick
        autoHeight

        // Paginación
        paginationMode={serverPaging ? "server" : "client"}
        {...(serverPaging
          ? {
              rowCount,
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize: paginationModel.pageSize ?? paginationModel.size ?? 10,
              },
              onPaginationModelChange: (model) => {
                const next = {
                  page: model.page ?? 0,
                  pageSize: model.pageSize ?? model.size ?? 10,
                  size: model.pageSize ?? model.size ?? 10, // compat si el padre usa {page,size}
                };
                onPaginationModelChange?.(next);
              },
            }
          : {
              pageSizeOptions: [5, 10, 20, 50],
              initialState: { pagination: { paginationModel: { page: 0, pageSize: 5 } } },
            })}
      />
    </div>
  );
}

GridPedido.propTypes = {
  pedidos: PropTypes.array,
  setSelectedRow: PropTypes.func.isRequired,
  producciones: PropTypes.array,
  almacenes: PropTypes.array,
  estados: PropTypes.array,
  loading: PropTypes.bool,
  rowCount: PropTypes.number,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  onPaginationModelChange: PropTypes.func,
  selectedRow: PropTypes.object,
};
