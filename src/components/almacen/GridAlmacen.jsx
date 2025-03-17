/**
 * Muestra una grilla de almacenes con paginación y selección de filas.
 * @module GridAlmacen
 * @component
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.almacenes - Lista de almacenes a mostrar.
 * @param {Function} props.setSelectedRow - Función que actualiza el almacén seleccionado.
 * @returns {JSX.Element} Componente GridAlmacen.
 */

import * as React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 200 },
  {
    field: "sede",
    headerName: "ID de Sede",
    width: 100,
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * GridAlmacen componente principal.
 * @component
 * @returns {JSX.Element}
 */
export default function GridAlmacen({ almacenes, setSelectedRow }) {
  return (
    <DataGrid
      rows={almacenes}
      columns={columns}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = almacenes.filter((row) =>
          selectedIDs.has(row.id)
        );
        setSelectedRow(selectedRowData[0] || null);
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );
}

GridAlmacen.propTypes = {
  almacenes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      sede: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      estado: PropTypes.number,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
