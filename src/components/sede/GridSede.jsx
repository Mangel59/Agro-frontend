import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridSede({ sedes, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selected = sedes.find((s) => s.id === selection[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "municipioId", headerName: "Municipio", width: 120 },
    { field: "grupoId", headerName: "Grupo", width: 100 },
    { field: "tipoSedeId", headerName: "Tipo Sede", width: 120 },
    { field: "geolocalizacion", headerName: "Geolocalizacion", width: 120 },
    { field: "coordenadas", headerName: "Coordenadas", width: 120 },
    { field: "area", headerName: "Área", width: 100 },
    { field: "comuna", headerName: "Comuna", width: 100 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
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
        rows={sedes}
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

GridSede.propTypes = {
  sedes: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
