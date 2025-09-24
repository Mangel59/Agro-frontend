// src/components/Bloque/GridBloque.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function GridBloque({
  // Datos
  bloques = [],

  // Selección
  selectedRow = null,
  setSelectedRow,

  // Paginación server-side (opcional)
  paginationModel,        // { page, pageSize } o { page, size }
  setPaginationModel,     // (model) => void
  rowCount,               // total en servidor
  loading = false,
}) {
  const columns = useMemo(() => ([
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombre", headerName: "Nombre", width: 200 },

    {
      field: "tipoBloqueNombre",
      headerName: "Tipo Bloque",
      width: 200,
      valueGetter: (p) =>
        p?.row?.tipoBloqueNombre ??
        p?.row?.tipoBloque?.nombre ??
        p?.row?.tipoBloque?.name ??
        String(p?.row?.tipoBloqueId ?? ""),
    },
    {
      field: "sedeNombre",
      headerName: "Sede",
      width: 200,
      valueGetter: (p) =>
        p?.row?.sedeNombre ??
        p?.row?.sede?.nombre ??
        p?.row?.sede?.name ??
        String(p?.row?.sedeId ?? ""),
    },

    { field: "numeroPisos", headerName: "Pisos", width: 110, type: "number" },
    { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 220 },
    { field: "direccion", headerName: "Dirección", width: 220 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 180 },
    { field: "coordenadas", headerName: "Coordenadas", width: 180 },
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

  const serverPagination = Boolean(
    paginationModel && setPaginationModel && typeof rowCount === "number"
  );

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={Array.isArray(bloques) ? bloques : []}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}

        // Selección controlada por clic
        onRowClick={(params) => setSelectedRow?.(params.row)}
        rowSelectionModel={selectedRow?.id ? [selectedRow.id] : []}
        disableRowSelectionOnClick
        autoHeight

        // Paginación: server si vienen props, si no cliente
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
              pageSizeOptions: [5, 10, 20, 50],
              initialState: {
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              },
            })}
      />
    </div>
  );
}

GridBloque.propTypes = {
  bloques: PropTypes.array,
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
