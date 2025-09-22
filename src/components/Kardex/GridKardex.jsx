import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
// (opcional) import PropTypes from "prop-types";

export default function GridKardex({
  kardexes,
  selectedRow,
  setSelectedRow,
  almacenes = [],
  producciones = [],
  tiposMovimiento = [],
}) {
  // Mapas id -> nombre para lookups rápidos
  const almById = useMemo(() => {
    const m = {};
    for (const a of almacenes) m[String(a.id)] = a.name ?? a.nombre ?? `Almacén ${a.id}`;
    return m;
  }, [almacenes]);

  const prodById = useMemo(() => {
    const m = {};
    for (const p of producciones) m[String(p.id)] = p.name ?? p.nombre ?? `Producción ${p.id}`;
    return m;
  }, [producciones]);

  const tmovById = useMemo(() => {
    const m = {};
    for (const t of tiposMovimiento) m[String(t.id)] = t.name ?? t.nombre ?? `Tipo ${t.id}`;
    return m;
  }, [tiposMovimiento]);

  const safeDateTime = (val) => (val ? new Date(val).toLocaleString() : "");

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fechaHora",
      headerName: "Fecha/Hora",
      width: 180,
      valueGetter: (params) => safeDateTime(params.row.fechaHora),
    },
    {
      field: "almacenId",
      headerName: "Almacén",
      width: 180,
      valueGetter: (params) =>
        params.row.almacen?.name ??
        params.row.almacen?.nombre ??
        almById[String(params.row.almacenId)] ??
        String(params.row.almacenId ?? ""),
    },
    {
      field: "produccionId",
      headerName: "Producción",
      width: 180,
      valueGetter: (params) =>
        params.row.produccion?.name ??
        params.row.produccion?.nombre ??
        prodById[String(params.row.produccionId)] ??
        String(params.row.produccionId ?? ""),
    },
    {
      field: "tipoMovimientoId",
      headerName: "Tipo Movimiento",
      width: 200,
      valueGetter: (params) =>
        params.row.tipoMovimiento?.name ??
        params.row.tipoMovimiento?.nombre ??
        tmovById[String(params.row.tipoMovimientoId)] ??
        String(params.row.tipoMovimientoId ?? ""),
    },
    { field: "descripcion", headerName: "Descripción", width: 260 },
    { field: "empresaId", headerName: "Empresa", width: 120 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 130,
      valueGetter: (params) => {
        const state =
          params.row.estado?.name ??
          params.row.estado?.nombre ??
          params.row.estadoId;
        // si tu estado es binario, mantenemos el fallback:
        if (state === 1 || state === "1") return "Activo";
        if (state === 0 || state === "0" || state === 2 || state === "2") return "Inactivo";
        return String(state ?? "");
      },
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={kardexes}
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

/*
// opcional
GridKardex.propTypes = {
  kardexes: PropTypes.array.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  almacenes: PropTypes.array,
  producciones: PropTypes.array,
  tiposMovimiento: PropTypes.array,
};
*/
