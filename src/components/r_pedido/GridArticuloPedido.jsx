// src/components/Pedido/GridArticuloPedido.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridArticuloPedido({
  // Datos
  items = [],
  presentaciones = [],

  // Selección (simple + múltiple)
  selectedRow = null,
  setSelectedRow = () => {},
  rowSelectionModel,                 // controlado (ids)
  onRowSelectionModelChange,         // controlado
  setSelectedRows = () => {},        // no controlado

  // Paginación server-side (opcional)
  loading = false,
  rowCount,
  paginationModel,                   // { page, pageSize } o { page, size }
  onPaginationModelChange,
}) {
  /* -------- Lookup presentaciones por id (O(1)) -------- */
  const presById = useMemo(() => {
    const m = {};
    for (const p of presentaciones ?? []) {
      m[String(p?.id)] = p?.nombre ?? p?.name ?? `Presentación ${p?.id ?? ""}`;
    }
    return m;
  }, [presentaciones]);

  /* -------- Columnas -------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90, type: "number" },
    { field: "cantidad", headerName: "Cantidad", width: 120, type: "number" },
    { field: "pedidoId", headerName: "Pedido", width: 140, type: "number" },
    {
      field: "presentacionProductoId",
      headerName: "Presentación de producto",
      width: 240,
      valueGetter: (p) =>
        p?.row?.presentacionProducto?.nombre ??
        p?.row?.presentacionProducto?.name ??
        presById[String(p?.row?.presentacionProductoId)] ??
        String(p?.row?.presentacionProductoId ?? ""),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 130,
      valueGetter: (p) =>
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), [presById]);

  /* -------- ¿Server o cliente? -------- */
  const serverPaging = Boolean(
    typeof rowCount === "number" &&
    paginationModel &&
    (typeof paginationModel.page === "number") &&
    (typeof (paginationModel.pageSize ?? paginationModel.size) === "number") &&
    typeof onPaginationModelChange === "function"
  );

  /* -------- Selección no controlada (fallback) -------- */
  const handleLocalSelection = (ids) => {
    const idSet = new Set(ids);
    const selectedMany = (items ?? []).filter(r => idSet.has(r.id));
    setSelectedRows(selectedMany);
    setSelectedRow(selectedMany[0] ?? null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(items) ? items : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight

        // Selección controlada / no controlada
        rowSelectionModel={rowSelectionModel ?? undefined}
        onRowSelectionModelChange={onRowSelectionModelChange ?? handleLocalSelection}
        onRowClick={(params) => setSelectedRow?.(params.row)}

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
                };
                // normaliza a {page, size} si tu padre lo usa así
                onPaginationModelChange?.({
                  page: next.page,
                  size: next.pageSize,
                  pageSize: next.pageSize,
                });
              },
            }
          : {
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: { pagination: { paginationModel: { page: 0, pageSize: 10 } } },
            })}
      />
    </Box>
  );
}

GridArticuloPedido.propTypes = {
  items: PropTypes.array,
  presentaciones: PropTypes.array,

  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  rowSelectionModel: PropTypes.array,
  onRowSelectionModelChange: PropTypes.func,
  setSelectedRows: PropTypes.func,

  loading: PropTypes.bool,
  rowCount: PropTypes.number,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  onPaginationModelChange: PropTypes.func,
};
