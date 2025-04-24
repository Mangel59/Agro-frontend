import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

const GridSede = ({ sedes, setSelectedRow }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "grupoId", headerName: "Grupo ID", width: 150 },
    { field: "tipoSedeId", headerName: "Tipo de Sede ID", width: 180 },
    { field: "empresaId", headerName: "Empresa ID", width: 150 },
    { field: "municipioId", headerName: "Municipio ID", width: 150 },
    { field: "comuna", headerName: "Comuna", width: 150 },
    { field: "area", headerName: "Área (m²)", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estadoId === 1 ? "Activo" : "Inactivo"),
    },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 180 },
    { field: "coordenadas", headerName: "Coordenadas", width: 180 },
    { field: "direccion", headerName: "Dirección", width: 180 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={sedes || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </div>
  );
};

GridSede.propTypes = {
  sedes: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};

export default GridSede;
