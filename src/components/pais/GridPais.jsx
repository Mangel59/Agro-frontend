import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nombre del País", width: 300 }, // corregido aquí
  ];
  
export default function GridPais({ paises, selectedRow, setSelectedRow }) {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={paises || []} // 🟢 Esto evita el error cuando paises es undefined
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={(params) => {
          setSelectedRow(params.row);
        }}
        getRowId={(row) => row.id} // 🟢 Asegúrate que cada fila tenga ID
      />
    </Box>
  );
}

GridPais.propTypes = {
  paises: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
