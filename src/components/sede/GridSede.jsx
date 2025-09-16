import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridSede({ sedes, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selected = sedes.find((s) => s.id === selection[0]);
      setSelectedRow(selected || null);
    } else {
      setSelectedRow(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 220 },

    // 👇 Mostrar NOMBRES (con fallback al id por si faltan)
    {
      field: "municipioNombre",
      headerName: "Municipio",
      width: 180,
      valueGetter: (params) =>
        params.row.municipioNombre ?? params.row.municipio?.name ?? params.row.municipioId ?? "",
    },
    {
      field: "grupoNombre",
      headerName: "Grupo",
      width: 180,
      valueGetter: (params) =>
        params.row.grupoNombre ?? params.row.grupo?.name ?? params.row.grupoId ?? "",
    },
    {
      field: "tipoSedeNombre",
      headerName: "Tipo Sede",
      width: 200,
      valueGetter: (params) =>
        params.row.tipoSedeNombre ?? params.row.tipoSede?.name ?? params.row.tipoSedeId ?? "",
    },

    { field: "geolocalizacion", headerName: "Geolocalización", width: 200 },
    { field: "coordenadas", headerName: "Coordenadas", width: 200 },
    { field: "area", headerName: "Área", width: 110 },
    { field: "comuna", headerName: "Comuna", width: 140 },
    { field: "descripcion", headerName: "Descripción", width: 280 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) =>
        Number(params.row.estadoId) === 1 ? "Activo" : "Inactivo",
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
          pagination: { paginationModel: { pageSize: 5 } },
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
