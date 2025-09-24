// src/components/Grupo/GridGrupo.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

/**
 * GridGrupo
 * - Si pasas { paginationModel, setPaginationModel, rowCount } => usa paginación "server"
 * - Si no, usa paginación en cliente (fallback) con pageSize=10
 */
export default function GridGrupo({
  // Datos
  grupos = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (opcional: server-side)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,        // spinner
}) {
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre del Grupo", width: 220 },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 260 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) => {
        const val =
          p?.row?.estado?.nombre ??
          p?.row?.estado?.name ??
          p?.row?.estadoId;
        if (val === 1 || val === "1") return "Activo";
        if (val === 2 || val === "2" || val === 0 || val === "0") return "Inactivo";
        return String(val ?? "Desconocido");
      },
    },
  ]), []);

  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(grupos) ? grupos : []}
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
                setPaginationModel?.(next);
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

GridGrupo.propTypes = {
  grupos: PropTypes.array,
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
