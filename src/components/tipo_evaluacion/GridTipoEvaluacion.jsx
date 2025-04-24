import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "tie_id", headerName: "ID", width: 90 },
  { field: "tie_nombre", headerName: "Nombre", width: 300 },
  {
    field: "tie_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (parseInt(params.row.tie_estado) === 1 ? "Activo" : "Inactivo"),
  },
];

export default function GridTipoEvaluacion({ tipoEvaluaciones, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tipoEvaluaciones}
        columns={columns}
        getRowId={(row) => row.tie_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}

GridTipoEvaluacion.propTypes = {
  tipoEvaluaciones: PropTypes.arrayOf(
    PropTypes.shape({
      tie_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      tie_nombre: PropTypes.string.isRequired,
      tie_estado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
};
