import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridCategoriaEstado({ rows = [], setSelectedRow = () => {} }) {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 250 },
    { field: "descripcion", headerName: "Descripción", width: 400 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        onRowClick={(p) => setSelectedRow(p.row)}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}

GridCategoriaEstado.propTypes = {
  rows: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
