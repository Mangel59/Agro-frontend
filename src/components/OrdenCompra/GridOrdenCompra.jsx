// GridOrdenCompra.jsx (completo)
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function GridOrdenCompra({
  ordenes,
  rowCount,
  loading,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  setFilterModel,
  setSelectedRow,
  proveedoresMap = {},
}) {
  const columns = useMemo(() => {
    const proveedorValueGetter = ({ row }) => {
      // id del proveedor puede venir con nombres distintos
      const provId =
        row.proveedorId ??
        row.proveedor_id ??
        row.proveedorIdFk ??
        row.proveedor?.id ??
        null;

      // nombre del proveedor puede venir ya resuelto
      const provName =
        row.proveedorName ??
        row.proveedor_name ??
        row.proveedor?.name ??
        (provId != null ? proveedoresMap[Number(provId)] : undefined);

      // Si quieres ver el ID cuando no hay nombre, usa:
      // return provName ?? String(provId ?? "");
      return provName ?? "";
    };

    return [
      { field: "id", headerName: "ID", width: 90, type: "number" },
      { field: "fechaHora", headerName: "Fecha y Hora", width: 200 },
      { field: "pedidoId", headerName: "Pedido", width: 110, type: "number" },
      {
        field: "proveedor",
        headerName: "Proveedor",
        width: 220,
        valueGetter: proveedorValueGetter,
      },
      { field: "descripcion", headerName: "Descripción", width: 260 },
      {
        field: "estadoId",
        headerName: "Estado",
        width: 120,
        valueGetter: ({ row }) => (row.estadoId === 1 ? "Activo" : "Inactivo"),
      },
    ];
  }, [proveedoresMap]);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
        rows={ordenes || []}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterMode="server"
        onFilterModelChange={setFilterModel}
        pageSizeOptions={[5, 10, 20, 50]}
        // v5:
        components={{ Toolbar: CustomToolbar }}
        // v6 (si estás en v6, cambia a):
        // slots={{ toolbar: CustomToolbar }}
        onRowSelectionModelChange={(sel) => {
          const ids = new Set(sel);
          const found = (ordenes || []).find((r) => ids.has(r.id));
          setSelectedRow(found || {});
        }}
        autoHeight
        sx={{ minWidth: 600 }}
      />
    </Box>
  );
}

GridOrdenCompra.propTypes = {
  ordenes: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  proveedoresMap: PropTypes.object,
};
