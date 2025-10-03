// src/components/IngredientePresentacionProducto/GridIngredientePresentacionP.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridIngredientePresentacionP({
  // Datos
  rows = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Catálogos opcionales (id -> name)
  ingredientesMap = {},
  presentacionesMap = {},

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  const nombreIngrediente = (row) =>
    row?.ingredienteNombre ??
    row?.ingrediente?.name ??
    row?.ingrediente?.nombre ??
    ingredientesMap?.[String(row?.ingredienteId)] ??
    String(row?.ingredienteId ?? "");

  const nombrePresentacion = (row) =>
    row?.presentacionNombre ??
    row?.presentacionProducto?.name ??
    row?.presentacionProducto?.nombre ??
    presentacionesMap?.[String(row?.presentacionProductoId)] ??
    String(row?.presentacionProductoId ?? "");

  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "ingredienteId",
      headerName: "Ingrediente",
      width: 240,
      valueGetter: (p) => nombreIngrediente(p?.row),
      sortable: false,
    },
    {
      field: "presentacionProductoId",
      headerName: "Presentación de producto",
      width: 280,
      valueGetter: (p) => nombrePresentacion(p?.row),
      sortable: false,
    },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 240 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) =>
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), [ingredientesMap, presentacionesMap]);

  // ¿Server o Cliente?
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        autoHeight
        rows={Array.isArray(rows) ? rows : []}
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
              // ----- Server controlled -----
              paginationModel: {
                page: paginationModel?.page ?? 0,
                pageSize: paginationModel?.pageSize ?? paginationModel?.size ?? 10,
              },
              onPaginationModelChange: (model) => {
                const next = {
                  page: model?.page ?? 0,
                  size: model?.pageSize ?? model?.size ?? 10,
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
      />
    </Box>
  );
}

GridIngredientePresentacionP.propTypes = {
  rows: PropTypes.array,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  ingredientesMap: PropTypes.object,       // opcional
  presentacionesMap: PropTypes.object,     // opcional
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
