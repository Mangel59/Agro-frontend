import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "cantidad", headerName: "Cantidad", width: 120 },
  { field: "pedidoId", headerName: "Pedido", width: 120 },
  { field: "productoPresentacionId", headerName: "Presentación", width: 180 },
  {
    field: "estadoId",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

export default function GridArticuloPedido({
  articulos,
  selectedRow,
  setSelectedRow,
}) {
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DataGrid
  rows={articulos || []}
  columns={columns}
  pagination
  initialState={{
    pagination: {
      paginationModel: { pageSize: 5, page: 0 },
    },
  }}
  pageSizeOptions={[5, 10, 20]}
  onRowSelectionModelChange={(newSelection) => {
    const selectedIDs = new Set(newSelection);
    const selectedRowData = articulos.find((row) => selectedIDs.has(row.id));
    setSelectedRow(selectedRowData || {});
  }}
  components={{ Toolbar: CustomToolbar }}
  autoHeight
  sx={{ minWidth: "600px" }}
/>

    </Box>
  );
}

GridArticuloPedido.propTypes = {
  articulos: PropTypes.array.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
};