// src/components/Presentacionproducto/GridPresentacionproducto.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

function Toolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function GridPresentacionproducto({
  // nombres nuevos (preferidos)
  rows,
  onPaginationModelChange,

  // compat con nombres antiguos
  Presentacionproductoes,
  setPaginationModel,

  // selección
  selectedRow,
  setSelectedRow,

  // estado de carga
  loading = false,

  // control opcional (server-side)
  paginationModel,            // { page, pageSize } o { page, size }
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  rowCount = 0,
}) {
  /* ---------- Datos/handlers seguros ---------- */
  const safeRows = Array.isArray(rows) ? rows : Array.isArray(Presentacionproductoes) ? Presentacionproductoes : [];
  const handlePaginationChange =
    onPaginationModelChange ??
    (setPaginationModel
      ? (model) => {
          const next = { page: model.page ?? 0, size: model.pageSize ?? model.size ?? 10 };
          setPaginationModel(next);
        }
      : undefined);

  /* ---------- ¿Server o cliente? ---------- */
  const serverPagination = Boolean(paginationModel && handlePaginationChange && typeof rowCount === "number");

  /* ---------- Columnas ---------- */
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90, type: "number" },
      {
        field: "productoNombre",
        headerName: "Producto",
        flex: 1,
        minWidth: 160,
        valueGetter: (p) =>
          p?.row?.productoNombre ??
          p?.row?.producto?.nombre ??
          p?.row?.producto?.name ??
          String(p?.row?.productoId ?? ""),
      },
      {
        field: "nombre",
        headerName: "Nombre de la Presentación",
        flex: 1.2,
        minWidth: 200,
      },
      {
        field: "unidadNombre",
        headerName: "Unidad",
        flex: 1,
        minWidth: 120,
        valueGetter: (p) =>
          p?.row?.unidadNombre ??
          p?.row?.unidad?.nombre ??
          p?.row?.unidad?.name ??
          String(p?.row?.unidadId ?? ""),
      },
      { field: "descripcion", headerName: "Descripción", flex: 1.4, minWidth: 220 },
      { field: "cantidad", headerName: "Cantidad", type: "number", width: 120 },
      {
        field: "marcaNombre",
        headerName: "Marca",
        flex: 1,
        minWidth: 140,
        valueGetter: (p) =>
          p?.row?.marcaNombre ??
          p?.row?.marca?.nombre ??
          p?.row?.marca?.name ??
          String(p?.row?.marcaId ?? ""),
      },
      {
        field: "presentacionNombre",
        headerName: "Tipo de Presentación",
        flex: 1.1,
        minWidth: 180,
        valueGetter: (p) =>
          p?.row?.presentacionNombre ??
          p?.row?.presentacion?.nombre ??
          p?.row?.presentacion?.name ??
          String(p?.row?.presentacionId ?? ""),
      },
      {
        field: "estadoId",
        headerName: "Estado",
        width: 140,
        renderCell: (p) => {
          const activo =
            p?.row?.estado?.nombre === "Activo" ||
            p?.row?.estado?.name === "Activo" ||
            String(p?.row?.estadoId) === "1";
          return <Chip size="small" label={activo ? "Activo" : "Inactivo"} color={activo ? "success" : "default"} />;
        },
        sortComparator: (v1, v2, cellParams1, cellParams2) =>
          Number(String(cellParams1?.row?.estadoId) === "1") - Number(String(cellParams2?.row?.estadoId) === "1"),
      },
    ],
    []
  );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={safeRows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}

        // Selección controlada
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick

        // Toolbar (v5/v6)
        components={{ Toolbar }}
        slots={{ toolbar: Toolbar }}

        // Paginación
        paginationMode={serverPagination ? "server" : "client"}
        {...(serverPagination
          ? {
              rowCount,
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize: paginationModel.pageSize ?? paginationModel.size ?? 10,
              },
              onPaginationModelChange: handlePaginationChange,
            }
          : {
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: { pagination: { paginationModel: { page: 0, pageSize: 5 } } },
            })}

        // Sorting / Filtering: server si hay setters, si no, client
        sortingMode={setSortModel ? "server" : "client"}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterMode={setFilterModel ? "server" : "client"}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        autoHeight
      />
    </Box>
  );
}

GridPresentacionproducto.propTypes = {
  // nuevos
  rows: PropTypes.array,
  onPaginationModelChange: PropTypes.func,

  // compat antiguos
  Presentacionproductoes: PropTypes.array,
  setPaginationModel: PropTypes.func,

  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  loading: PropTypes.bool,
  paginationModel: PropTypes.shape({ page: PropTypes.number, pageSize: PropTypes.number, size: PropTypes.number }),
  sortModel: PropTypes.array,
  setSortModel: PropTypes.func,
  filterModel: PropTypes.object,
  setFilterModel: PropTypes.func,
  rowCount: PropTypes.number,
};
