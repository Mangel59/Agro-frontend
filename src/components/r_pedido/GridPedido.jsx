import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridPedido({
  pedidos,
  setSelectedRow,
  producciones = [],
  almacenes = [],
  estados = [],              // 👈 NUEVO: lista del catálogo de estados
  loading = false,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  selectedRow = null,
}) {
  const handleRowSelection = (selection) => {
    const id = Array.isArray(selection) ? selection[0] : selection;
    setSelectedRow(id != null ? (pedidos.find(a => String(a.id) === String(id)) || null) : null);
  };

  // Mapas id -> name
  const prodById = useMemo(() => {
    const m = {};
    for (const p of producciones) m[String(p.id)] = p.name ?? p.nombre ?? `Producción ${p.id}`;
    return m;
  }, [producciones]);

  const almById = useMemo(() => {
    const m = {};
    for (const a of almacenes) m[String(a.id)] = a.name ?? a.nombre ?? `Almacén ${a.id}`;
    return m;
  }, [almacenes]);

  const estById = useMemo(() => {                // 👈 NUEVO
    const m = {};
    for (const e of estados) m[String(e.id)] = e.name ?? e.nombre ?? `Estado ${e.id}`;
    return m;
  }, [estados]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "descripcion", headerName: "Descripción", width: 220 },
    { field: "fechaHora", headerName: "Fecha y Hora", width: 180 },
    {
      field: "produccionId",
      headerName: "Producción",
      width: 200,
      valueGetter: (params) => prodById[String(params.row.produccionId)] ?? params.row.produccionId,
    },
    {
      field: "almacenId",
      headerName: "Almacén",
      width: 200,
      valueGetter: (params) => almById[String(params.row.almacenId)] ?? params.row.almacenId,
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 200,
      valueGetter: (params) => {
        const id = params.row.estado?.id ?? params.row.estadoId;
        return (
          params.row.estado?.name ??
          params.row.estado?.nombre ??
          estById[String(id)] ??
          String(id ?? "")
        );
      },
    },
  ];

  const isServerPaging =
    typeof rowCount === "number" &&
    paginationModel &&
    typeof paginationModel.page === "number" &&
    typeof paginationModel.pageSize === "number" &&
    typeof onPaginationModelChange === "function";

  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={pedidos}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRow ? [selectedRow.id] : []}
        pagination
        paginationMode={isServerPaging ? "server" : "client"}
        rowCount={isServerPaging ? rowCount : undefined}
        paginationModel={isServerPaging ? paginationModel : undefined}
        onPaginationModelChange={isServerPaging ? onPaginationModelChange : undefined}
        initialState={
          isServerPaging ? undefined : { pagination: { paginationModel: { pageSize: 5, page: 0 } } }
        }
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}

GridPedido.propTypes = {
  pedidos: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  producciones: PropTypes.array,
  almacenes: PropTypes.array,
  estados: PropTypes.array,          
  loading: PropTypes.bool,
  rowCount: PropTypes.number,
  paginationModel: PropTypes.shape({ page: PropTypes.number, pageSize: PropTypes.number }),
  onPaginationModelChange: PropTypes.func,
  selectedRow: PropTypes.object,
};
