// src/components/Espacio/GridEspacio.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridEspacio({
  // Datos
  espacios = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (opcional: server-side)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  /* ---------- Columnas ---------- */
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80, type: "number" },
    { field: "nombre", headerName: "Nombre", width: 200 },

    {
      field: "tipoEspacioNombre",
      headerName: "Tipo Espacio",
      width: 200,
      valueGetter: (p) =>
        p?.row?.tipoEspacioNombre ??
        p?.row?.tipoEspacio?.nombre ??
        p?.row?.tipoEspacio?.name ??
        String(p?.row?.tipoEspacioId ?? ""),
    },
    {
      field: "bloqueNombre",
      headerName: "Bloque",
      width: 200,
      valueGetter: (p) =>
        p?.row?.bloqueNombre ??
        p?.row?.bloque?.nombre ??
        p?.row?.bloque?.name ??
        String(p?.row?.bloqueId ?? ""),
    },

    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 260 },

    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) =>
        p?.row?.estado?.nombre ??
        p?.row?.estado?.name ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  /* ---------- ¿Server o Cliente? ---------- */
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(espacios) ? espacios : []}
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
              // ----- Client fallback -----
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

GridEspacio.propTypes = {
  espacios: PropTypes.array,
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
