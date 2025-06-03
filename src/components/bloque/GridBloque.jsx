// GridBloque.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridBloque({ bloques, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selected = bloques.find((b) => b.id === selection[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "tipoBloqueId", headerName: "Tipo Bloque", width: 120 },
    { field: "numeroPisos", headerName: "Pisos", width: 100 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 160 },
    { field: "coordenadas", headerName: "Coordenadas", width: 160 },
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
        rows={bloques}
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

GridBloque.propTypes = {
  bloques: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
