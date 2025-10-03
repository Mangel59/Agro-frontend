import React from "react";
import PropTypes from "prop-types";
import { Box, LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 200 },
  { field: "productoCategoriaNombre", headerName: "Categoría", width: 180 },
  { field: "unidadMinimaNombre", headerName: "Unidad mínima", width: 160 },
  { field: "ingredientePresentacionNombre", headerName: "Ingrediente presentación", width: 220 },
  { field: "estadoNombre", headerName: "Estado", width: 120 },
  { field: "descripcion", headerName: "Descripción", flex: 1, minWidth: 220 },
];

export default function GridProducto({
  loading,
  productos,
  selectedRow,
  setSelectedRow,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,           // (event, newPage)
  onRowsPerPageChange,    // (event | number)
}) {
  return (
    <Box sx={{ height: 560, width: "100%" }}>
      <DataGrid
        rows={productos}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        // Paginación controlada por el servidor
        pagination
        paginationMode="server"
        rowCount={totalElements}
        page={page}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
        onPageChange={(newPage) => onPageChange?.(null, newPage)}
        onPageSizeChange={(newPageSize) => onRowsPerPageChange?.(newPageSize)}
        // Selección simple por click
        onRowClick={(params) => setSelectedRow(params.row)}
        selectionModel={selectedRow ? [selectedRow.id] : []}
        components={{
          LoadingOverlay: LinearProgress,
        }}
      />
    </Box>
  );
}

GridProducto.propTypes = {
  loading: PropTypes.bool,
  productos: PropTypes.array.isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalElements: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};
