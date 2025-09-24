// src/components/Sede/GridSede.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridSede({
  // Datos
  sedes = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación (server-side opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,        // spinner
}) {
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombre", headerName: "Nombre", width: 220 },

    // Nombres con fallback a ID
    {
      field: "municipioNombre",
      headerName: "Municipio",
      width: 200,
      valueGetter: (p) =>
        p?.row?.municipioNombre ??
        p?.row?.municipio?.name ??
        p?.row?.municipio?.nombre ??
        String(p?.row?.municipioId ?? ""),
    },
    {
      field: "grupoNombre",
      headerName: "Grupo",
      width: 200,
      valueGetter: (p) =>
        p?.row?.grupoNombre ??
        p?.row?.grupo?.name ??
        p?.row?.grupo?.nombre ??
        String(p?.row?.grupoId ?? ""),
    },
    {
      field: "tipoSedeNombre",
      headerName: "Tipo Sede",
      width: 220,
      valueGetter: (p) =>
        p?.row?.tipoSedeNombre ??
        p?.row?.tipoSede?.name ??
        p?.row?.tipoSede?.nombre ??
        String(p?.row?.tipoSedeId ?? ""),
    },

    { field: "geolocalizacion", headerName: "Geolocalización", width: 200 },
    { field: "coordenadas", headerName: "Coordenadas", width: 200 },
    { field: "area", headerName: "Área", width: 120 },
    { field: "comuna", headerName: "Comuna", width: 140 },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 280 },

    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueGetter: (p) =>
        p?.row?.estado?.name ??
        p?.row?.estado?.nombre ??
        (String(p?.row?.estadoId) === "1" ? "Activo" : "Inactivo"),
    },
  ]), []);

  // ¿Server o Cliente?
  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(sedes) ? sedes : []}
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

GridSede.propTypes = {
  sedes: PropTypes.array,
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
