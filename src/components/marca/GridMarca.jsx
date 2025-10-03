import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";



export default function GridMarca({ rows = [], selectedRow = {}, setSelectedRow = () => {} }) {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  {
    field: 'estadoId',
    headerName: 'Estado',
    width: 100,
    type: 'number',
    valueGetter: (params) => (params.row.estadoId === 1 ? 'Activo' : 'Inactivo'),
  },
];


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

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

  GridMarca.propTypes = {
    rows: PropTypes.array.isRequired,
    selectedRow: PropTypes.object.isRequired,
    setSelectedRow: PropTypes.func.isRequired,
  };