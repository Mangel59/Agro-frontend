import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridArticuloKardex({
  items = [],
  selectedRow,
  setSelectedRow,
  presentaciones = [],
}) {
  const presById = useMemo(() => {
    const m = {};
    for (const pr of presentaciones) {
      const composed = [pr.producto?.nombre, pr.presentacion?.nombre]
        .filter(Boolean)
        .join(" · ");

      const label =
        (pr.name ?? pr.nombre ?? composed) || `Presentación ${pr.id}`; // ✅ agrupado

      m[String(pr.id)] = label;
    }
    return m;
  }, [presentaciones]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "cantidad", headerName: "Cantidad", width: 120 },
    { field: "precio", headerName: "Precio", width: 120 },
    {
      field: "fechaVencimiento",
      headerName: "Vence",
      width: 150,
      valueGetter: (params) =>
        (params.row.fechaVencimiento || "").toString().substring(0, 10),
    },
    { field: "kardexId", headerName: "Kardex ID", width: 120 },
    {
      field: "presentacionProductoId",
      headerName: "Presentación",
      width: 240,
      valueGetter: (p) =>
        p.row.presentacionProducto?.nombre ??
        p.row.presentacionProducto?.name ??
        presById[String(p.row.presentacionProductoId)] ??
        String(p.row.presentacionProductoId ?? ""),
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) =>
        params.row.estado?.name ??
        params.row.estado?.nombre ??
        (params.row.estadoId === 1 || params.row.estadoId === "1"
          ? "Activo"
          : "Inactivo"),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={Array.isArray(items) ? items : []}
        columns={columns}
        pageSizeOptions={[5, 10, 15]}
        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow ? [selectedRow.id] : []}
      />
    </Box>
  );
}
