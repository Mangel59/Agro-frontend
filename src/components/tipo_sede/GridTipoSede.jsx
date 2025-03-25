/**
 * @file GridTipoSede.jsx
 * @module GridTipoSede
 * @description Componente para mostrar la lista de Tipos de Sede en una grilla con paginación. Permite seleccionar una fila y mostrar sus datos en un formulario asociado.
 */

import React from "react";
import PropTypes from 'prop-types';
import { DataGrid } from "@mui/x-data-grid";

/**
 * @typedef {Object} TipoSedeRow
 * @property {number} id - ID único del tipo de sede
 * @property {string} nombre - Nombre del tipo de sede
 * @property {string} descripcion - Descripción del tipo de sede
 * @property {number} estado - Estado (1 = Activo, 0 = Inactivo)
 */

/**
 * Componente de tabla para visualizar los tipos de sede.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {TipoSedeRow[]} props.tipoSedes - Lista de tipos de sede a mostrar
 * @param {function(TipoSedeRow): void} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @returns {JSX.Element} Tabla con los datos y opción para seleccionar fila
 */
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
