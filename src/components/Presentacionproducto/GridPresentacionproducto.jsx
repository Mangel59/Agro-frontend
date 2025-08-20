// src/components/Presentacionproducto/GridPresentacionproducto.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";

export default function GridPresentacionproducto({
  // nombres nuevos (preferidos)
  rows,
  onPaginationModelChange,

  // compat con nombres antiguos (por si quedaron en el padre)
  Presentacionproductoes,
  setPaginationModel,

  selectedRow,
  setSelectedRow,
  loading = false,
  paginationModel,
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  rowCount = 0,
}) {
  // Fallbacks seguros
  const safeRows = rows ?? Presentacionproductoes ?? []; 
  const handlePaginationChange =
    onPaginationModelChange ??
    setPaginationModel ??
    (() => {}); // no-op

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "productoNombre", headerName: "Producto", flex: 1, minWidth: 140 },
      { field: "nombre", headerName: "Nombre de la Presentación", flex: 1.2, minWidth: 180 },
      { field: "unidadNombre", headerName: "Unidad", flex: 1, minWidth: 120 },
      { field: "descripcion", headerName: "Descripción", flex: 1.5, minWidth: 200 },
      { field: "cantidad", headerName: "Cantidad", type: "number", width: 120 },
      { field: "marcaNombre", headerName: "Marca", flex: 1, minWidth: 140 },
      { field: "presentacionNombre", headerName: "Tipo de Presentación", flex: 1.2, minWidth: 180 },
      {
      field: "estadoId",
      headerName: "Estado",
      width: 150,
      valueFormatter: ({ value }) => (value === 1 ? "Activo" : "Inactivo"),
    }
    ],
    []
  );

  return (
    <div style={{ width: "100%", height: 520 }}>
      <DataGrid
        rows={safeRows}                            // 👈 nunca undefined
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}  // 👈 acepta ambos
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterMode="client"
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        onRowClick={(params) => setSelectedRow && setSelectedRow(params.row)}
        initialState={{ pagination: { paginationModel } }}
      />
    </div>
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
  paginationModel: PropTypes.shape({ page: PropTypes.number, pageSize: PropTypes.number }).isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  filterModel: PropTypes.object.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  rowCount: PropTypes.number,
};
