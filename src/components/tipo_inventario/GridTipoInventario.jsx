import * as React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 250 },
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

export default function GridTipoInventario({
  tipos,
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
        rows={tipos || []}
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
        pageSizeOptions={[5, 10, 20]}
        components={{ Toolbar: CustomToolbar }}
        onRowSelectionModelChange={(newSelection) => {
          const selectedIDs = new Set(newSelection);
          const selectedRowData = tipos.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
        }}
        autoHeight
        sx={{ minWidth: "600px" }}
      />
    </Box>
  );
}

GridTipoInventario.propTypes = {
  tipos: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
