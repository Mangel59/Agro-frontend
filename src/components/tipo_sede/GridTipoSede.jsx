/**
 * Componente GridTipoSede.
 * @module GridTipoSede
 * @component
 */
import React from "react";
import PropTypes from 'prop-types'; // ✅ Importación necesaria
import { DataGrid } from "@mui/x-data-grid";

const GridTipoSedes = ({ tipoSedes, setSelectedRow }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tipoSedes || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </div>
  );
};

GridTipoSedes.propTypes = {
  tipoSedes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};

export default GridTipoSedes;
