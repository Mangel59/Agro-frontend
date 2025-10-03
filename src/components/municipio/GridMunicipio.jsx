/**
 * @file GridMunicipio.jsx
 * @module GridMunicipio
 * @description Componente de tabla para visualizar municipios.
 *
 * Este componente muestra los municipios en una tabla interactiva
 * utilizando MUI DataGrid y permite seleccionar una fila.
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

/**
 * @typedef {Object} GridMunicipioProps
 * @property {Array<Object>} municipios - Lista de municipios a mostrar
 * @property {Function} setSelectedRow - Función para establecer la fila seleccionada
 */

/**
 * Tabla de visualización de municipios.
 *
 * @param {GridMunicipioProps} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de municipios
 */
export default function GridMunicipio({ municipios, setSelectedRow }) {
  /**
   * Maneja el cambio de selección en la tabla.
   * @param {Array<number>} selection - Lista de IDs seleccionados
   */
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
    { field: "nombre", headerName: "Municipio", width: 200 },
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

GridMunicipio.propTypes = {
  municipios: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
