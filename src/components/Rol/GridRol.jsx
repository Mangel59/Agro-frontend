// src/components/Rol/GridRol.jsx
/**
 * @file GridRol.jsx
 * @module GridRol
 * @description Grilla de Roles con paginación server/cliente, selección controlada y mapeo robusto de estado.
 * @author Karla
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridRol({
  // Datos
  roles = [],

  // Selección
  selectedRow = null,
  onEdit,                // (row) => void  (click en fila)
  setSelectedRow,        // opcional: si quieres mantener selección destacada

  // Paginación (server-side opcional)
  loading = false,
  paginationModel,       // { page, pageSize } o { page, size }
  setPaginationModel,    // (model) => void
  rowCount,              // total en servidor
}) {
  const columns = useMemo(() => ([
    { field: "rol_id", headerName: "ID", width: 100, type: "number" },
    { field: "rol_nombre", headerName: "Nombre", width: 220 },
    { field: "rol_descripcion", headerName: "Descripción", flex: 1, minWidth: 280 },
    {
      field: "rol_estado",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) => {
        const v =
          p?.row?.estado?.nombre ??
          p?.row?.estado?.name ??
          p?.row?.rol_estado;
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
        rows={Array.isArray(roles) ? roles : []}
        columns={columns}
        getRowId={(row) => row.rol_id}
        loading={loading}

        // Selección/edición
        onRowClick={(params) => {
          setSelectedRow?.(params.row);
          onEdit?.(params.row);
        }}
        rowSelectionModel={selectedRow?.rol_id ? [selectedRow.rol_id] : []}
        disableRowSelectionOnClick
        autoHeight

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
      />
    </div>
  );
}

// Validación de PropTypes
GridRol.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      rol_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      rol_nombre: PropTypes.string.isRequired,
      rol_descripcion: PropTypes.string.isRequired,
      rol_estado: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      estado: PropTypes.shape({
        nombre: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ),
  onEdit: PropTypes.func,           // click en fila
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func,

  // Server-side pagination (opcional)
  paginationModel: PropTypes.shape({
    page: PropTypes.number,
    pageSize: PropTypes.number,
    size: PropTypes.number,
  }),
  setPaginationModel: PropTypes.func,
  rowCount: PropTypes.number,
  loading: PropTypes.bool,
};
