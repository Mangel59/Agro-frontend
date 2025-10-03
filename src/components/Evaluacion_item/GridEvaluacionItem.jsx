// src/components/Evaluacion/GridEvaluacionItem.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridEvaluacionItem({
  // Datos
  items = [],

  // Selección
  selectedRow = null,
  setSelectedRow,        // opcional: si quieres marcar la fila seleccionada

  // Acción
  onEdit,                // (row) => void

  // Paginación (server-side opcional)
  paginationModel,       // { page, pageSize } o { page, size }
  setPaginationModel,    // (model) => void
  rowCount,              // total en servidor
  loading = false,
}) {
  const columns = useMemo(() => ([
    { field: "evi_id", headerName: "ID", width: 90 },
    { field: "evi_evaluacion_id", headerName: "Evaluación ID", width: 150 },
    { field: "evi_valor", headerName: "Valor", width: 120, type: "number" },
    {
      field: "evi_criterio_evaluacion_id",
      headerName: "Criterio Evaluación ID",
      width: 200,
      valueGetter: (p) =>
        p?.row?.evi_criterio_evaluacion_nombre ??
        p?.row?.criterio?.nombre ??
        p?.row?.evi_criterio_evaluacion_id,
    },
    { field: "evi_descripcion", headerName: "Descripción", flex: 1, minWidth: 260 },
    {
      field: "evi_estado",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) => {
        const v =
          p?.row?.estado?.nombre ??
          p?.row?.estado?.name ??
          p?.row?.evi_estado;
        if (v === 1 || v === "1") return "Activo";
        if (v === 0 || v === "0" || v === 2 || v === "2") return "Inactivo";
        return String(v ?? "");
      },
    },
  ]), []);

  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(items) ? items : []}
        columns={columns}
        getRowId={(row) => row.evi_id}

        // Selección + edición
        onRowClick={(params) => {
          setSelectedRow?.(params.row);
          onEdit?.(params.row);
        }}
        rowSelectionModel={selectedRow?.evi_id ? [selectedRow.evi_id] : []}
        disableRowSelectionOnClick

        // Paginación
        paginationMode={serverPagination ? "server" : "client"}
        loading={loading}
        {...(serverPagination
          ? {
              paginationModel: {
                page: paginationModel.page ?? 0,
                pageSize: paginationModel.pageSize ?? paginationModel.size ?? 10,
              },
              onPaginationModelChange: (model) => {
                const next = {
                  page: model.page ?? 0,
                  size: model.pageSize ?? model.size ?? 10,
                };
                setPaginationModel?.(next); // el padre hace el fetch con estos valores
              },
              rowCount,
            }
          : {
              pageSizeOptions: [5, 10, 15, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            })}
        autoHeight
      />
    </div>
  );
}

GridEvaluacionItem.propTypes = {
  items: PropTypes.array,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,
  onEdit: PropTypes.func,
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
