// src/components/Proveedor/GridProveedor.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridProveedor({
  // Datos
  proveedores = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  const safeDateTime = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? String(v).toString().substring(0, 19) : d.toLocaleString();
  };

  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80, type: "number" },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "identificacion", headerName: "Identificación", width: 160 },
    { field: "contacto", headerName: "Contacto", width: 170 },
    { field: "correo", headerName: "Correo", width: 220 },
    { field: "celular", headerName: "Celular", width: 140 },
    {
      field: "tipoIdentificacionId",
      headerName: "Tipo Identificación",
      width: 200,
      valueGetter: (p) =>
        p?.row?.tipoIdentificacionNombre ??
        p?.row?.tipoIdentificacion?.nombre ??
        p?.row?.tipoIdentificacion?.name ??
        String(p?.row?.tipoIdentificacionId ?? ""),
    },
    {
      field: "fechaCreacion",
      headerName: "Fecha de Creación",
      width: 200,
      valueGetter: (p) => safeDateTime(p?.row?.fechaCreacion),
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
  ]), []);

  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(proveedores) ? proveedores : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}

        // Selección controlada
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

        // Paginación
        paginationMode={serverPagination ? "server" : "client"}
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

GridProveedor.propTypes = {
  proveedores: PropTypes.array,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
