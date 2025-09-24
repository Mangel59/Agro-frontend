// src/components/Persona/GridPersona.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridPersona({
  // Datos
  personas = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  const safeDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    // YYYY-MM-DD
    return Number.isNaN(d.getTime()) ? String(v).substring(0, 10) : d.toISOString().substring(0, 10);
  };

  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "tipoIdentificacionNombre",
      headerName: "Tipo ID",
      width: 180,
      valueGetter: (p) =>
        p?.row?.tipoIdentificacionNombre ??
        p?.row?.tipoIdentificacion?.nombre ??
        p?.row?.tipoIdentificacion?.name ??
        String(p?.row?.tipoIdentificacionId ?? ""),
    },
    { field: "identificacion", headerName: "Identificación", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "apellido", headerName: "Apellido", width: 150 },
    { field: "genero", headerName: "Género", width: 100 },
    {
      field: "fechaNacimiento",
      headerName: "Nacimiento",
      width: 140,
      valueGetter: (p) => safeDate(p?.row?.fechaNacimiento),
    },
    { field: "estrato", headerName: "Estrato", width: 100, type: "number" },
    { field: "direccion", headerName: "Dirección", width: 220 },
    { field: "email", headerName: "Email", width: 240 },
    { field: "celular", headerName: "Celular", width: 150 },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      valueGetter: (p) =>
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estado) === "1" || String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(personas) ? personas : []}
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
          : {
              pageSizeOptions: [8, 10, 15, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 8 } },
              },
            })}
        autoHeight
      />
    </Box>
  );
}

GridPersona.propTypes = {
  personas: PropTypes.array,
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
