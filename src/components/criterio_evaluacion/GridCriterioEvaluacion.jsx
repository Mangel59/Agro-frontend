import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridCriterioEvaluacion({ rows = [], selectedRow = {}, setSelectedRow = () => {} }) {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombre", headerName: "Nombre", width: 220 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    { field: "tipoEvaluacionNombre", headerName: "Tipo de evaluación", width: 220 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 140,
      valueFormatter: ({ value }) => (value === 1 ? "Activo" : "Inactivo"),
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

GridCriterioEvaluacion.propTypes = {
  rows: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
