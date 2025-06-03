import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridEspacio({ espacios, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    const selected = espacios.find(e => e.id === selection[0]);
    setSelectedRow(selected || null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "tipoEspacioId", headerName: "Tipo Espacio", width: 160 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
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
        rows={espacios}
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

GridEspacio.propTypes = {
  espacios: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
