import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function GridMunicipio({ municipios, setSelectedRow }) {
  const handleRowSelection = (selection) => {
    if (selection.length > 0) {
      const selected = municipios.find((m) => m.id === selection[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "departamentoId", headerName: "Departamento", width: 200, type: "string" },     
    { field: "codigo", headerName: "Código", width: 120 },
    { field: "acronimo", headerName: "Acrónimo", width: 120 },
    { field: "estadoId", headerName: "Estado", width: 100 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={municipios}
        columns={columns}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(selection) =>
          handleRowSelection(selection)
        }
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

GridMunicipio.propTypes = {
  municipios: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
