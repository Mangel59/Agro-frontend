import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridPedido({ pedidos, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selected = pedidos.find((a) => a.id === selection[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    { field: "fechaHora", headerName: "Fecha y Hora", width: 180 },
    { field: "produccionId", headerName: "Producción ID", width: 130 },
    { field: "almacenId", headerName: "Almacén ID", width: 130 },
    { field: "empresaId", headerName: "Empresa ID", width: 130 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 100,
      valueGetter: (params) =>
        params.row.estadoId === 1 ? "Activo" : "Inactivo",
    },
  ];

  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={pedidos}
        columns={columns}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={handleRowSelection}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}

GridPedido.propTypes = {
  pedidos: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
