import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridIngredientePresentacionP({ rows = [], selectedRow = {}, setSelectedRow = () => {} }) {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', width: 120 },
    { field: 'descripcion', headerName: 'Descripcion', width: 120 },
    { field: 'ingredienteId', headerName: 'Ingrediente', width: 150 },
    { field: 'presentacionProductoId', headerName: 'Presentación de producto', width: 150 },
    {
      field: 'estadoId',
      headerName: 'Estado',
      width: 100,
      valueGetter: (params) => (params.row.estadoId === 1 ? 'Activo' : 'Inactivo'),
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
        disableSelectionOnClick
        autoHeight
      />
    </Box>
  );
}

GridIngredientePresentacionP.propTypes = {
  rows: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
