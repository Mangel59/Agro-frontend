import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GridPresentacionproducto({
  Presentacionproductoes,
  selectedRow,
  setSelectedRow,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  filterModel,
  setFilterModel,
  rowCount,
}) {
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    { field: "cantidad", headerName: "Cantidad", width: 100 },
    { field: "productoNombre", headerName: "Producto", width: 150 },
    { field: "unidadNombre", headerName: "Unidad", width: 120 },
    { field: "marcaNombre", headerName: "Marca", width: 150 },
    { field: "presentacionNombre", headerName: "Presentación", width: 150 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 100,
      valueFormatter: ({ value }) =>
        value === 1 ? "Activo" : value === 0 ? "Inactivo" : "Otro",
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <DataGrid
        rows={Presentacionproductoes}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedRow(params.row)}
        disableSelectionOnClick
        autoHeight
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        rowCount={rowCount}
      />
    </Box>
  );
}

GridPresentacionproducto.propTypes = {
  Presentacionproductoes: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  sortModel: PropTypes.array.isRequired,
  setSortModel: PropTypes.func.isRequired,
  filterModel: PropTypes.object.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};
