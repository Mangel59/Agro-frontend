// src/components/Kardex/GridArticuloKardex.jsx
import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridArticuloKardex({
  // Datos
  items = [],
  presentaciones = [],

  // Selección
  selectedRow,
  setSelectedRow,

  // Contexto del Kardex
  kardexId, // <- pásalo desde el padre para filtrar defensivamente

  // Paginación controlada (server-side). Si no vienen, usa modo cliente.
  paginationModel,        // { page, size } o { page, pageSize }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,        // spinner de carga
}) {
  /* ---------- Mapa de presentaciones por id ---------- */
  const presById = useMemo(() => {
    const m = {};
    for (const pr of presentaciones ?? []) {
      // Etiqueta compuesta y segura
      const composed = [pr?.producto?.nombre, pr?.presentacion?.nombre]
        .filter(Boolean)
        .join(" · ");

      const label =
        pr?.name ??
        pr?.nombre ??
        (composed || `Presentación ${pr?.id ?? ""}`);

      if (pr?.id != null) m[String(pr.id)] = label;
    }
    return m;
  }, [presentaciones]);

  /* ---------- Filtro defensivo por kardexId ---------- */
  const filteredRows = useMemo(() => {
    if (!kardexId) return Array.isArray(items) ? items : [];
    const id = String(kardexId);
    const src = Array.isArray(items) ? items : [];
    return src.filter((it) => {
      const k =
        it?.kardexId ??
        it?.kardex_id ??
        it?.karId ??
        it?.kar_id ??
        it?.kdxId ??
        it?.kdx_id;
      return String(k ?? "") === id;
    });
  }, [items, kardexId]);

  /* ---------- Columnas ---------- */
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "cantidad", headerName: "Cantidad", width: 120 },
    { field: "precio", headerName: "Precio", width: 120 },
    {
      field: "fechaVencimiento",
      headerName: "Vence",
      width: 150,
      valueGetter: (params) =>
        (params?.row?.fechaVencimiento || "").toString().substring(0, 10),
    },
    // Puedes ocultar el ID del kardex si no quieres mostrarlo
    { field: "kardexId", headerName: "Kardex ID", width: 120, hide: true },
    {
      field: "presentacionProductoId",
      headerName: "Presentación",
      width: 260,
      valueGetter: (p) =>
        p?.row?.presentacionProducto?.nombre ??
        p?.row?.presentacionProducto?.name ??
        presById[String(p?.row?.presentacionProductoId)] ??
        String(p?.row?.presentacionProductoId ?? ""),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (params) =>
        params?.row?.estado?.name ??
        params?.row?.estado?.nombre ??
        (String(params?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ];

  /* ---------- Modo de paginación ----------
     - Si recibimos props de paginación (server), activamos paginationMode="server"
     - Si NO, usamos cliente con pageSize=10
  ---------------------------------------- */
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        // Selección de fila
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow ? [selectedRow.id] : []}

        // Paginación
        paginationMode={serverPagination ? "server" : "client"}
        loading={loading}

        {...(serverPagination
          ? {
              // ----- Server controlled -----
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize:
                  paginationModel.pageSize ??
                  paginationModel.size ?? // por si tu padre usa {page, size}
                  10,
              },
              onPaginationModelChange: (model) => {
                // Normaliza "size" vs "pageSize"
                const next = {
                  page: model.page ?? 0,
                  size: model.pageSize ?? model.size ?? 10,
                };
                setPaginationModel?.(next);
              },
              rowCount,
            }
          : {
              // ----- Client fallback -----
              pageSizeOptions: [5, 10, 15, 20],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            })}
        autoHeight
      />
    </Box>
  );
}
