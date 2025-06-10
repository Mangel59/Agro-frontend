import * as React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

// Columnas para mostrar datos de orden de compra
const columns = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  {
    field: "fechaHora",
    headerName: "Fecha y Hora",
    width: 200,
    type: "string",
  },
  {
    field: "pedidoId",
    headerName: "Pedido",
    width: 100,
    type: "number",
  },
  { field: "proveedorNombre", headerName: "Proveedor", width: 200, type: "string" },

  {
    field: "descripcion",
    headerName: "Descripción",
    width: 250,
    type: "string",
  },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 100,
    type: "number",
    valueGetter: (params) =>
      params.row.estadoId === 1 ? "Activo" : "Inactivo",
  },
];

// Toolbar personalizada con botón de filtro
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
}) {
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
        components={{ Toolbar: CustomToolbar }}
        onRowSelectionModelChange={(newSelection) => {
          const selectedIDs = new Set(newSelection);
          const selectedRowData = ordenes.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
        }}
        autoHeight
        sx={{ minWidth: "600px" }}
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
};
