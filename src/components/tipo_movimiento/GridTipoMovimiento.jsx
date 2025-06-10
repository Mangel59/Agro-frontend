import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridTipoMovimiento({
  rows = [],
  selectedRow = {},
  setSelectedRow = () => {},
}) {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
    { field: "empresaId", headerName: "Empresa ID", width: 130 },
    { field: "movimientoNombre", headerName: "Movimiento", width: 180 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
        disableSelectionOnClick
        autoHeight
      />
    </Box>
  );
}

GridTipoMovimiento.propTypes = {
  rows: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
