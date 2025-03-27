/**
 * @file GridAlmacen.jsx
 * @module GridAlmacen
 * @description Componente de grilla para visualizar almacenes con paginación y selección de fila.
 * Muestra campos clave como nombre, geolocalización, sede y estado. Utiliza DataGrid de Material-UI.
 * Permite seleccionar un almacén para editarlo o eliminarlo desde el formulario superior.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

/**
 * @typedef {Object} AlmacenRow
 * @property {number} id - ID del almacén
 * @property {string} nombre - Nombre del almacén
 * @property {string} geolocalizacion - Coordenada de ubicación (numérica)
 * @property {string} coordenadas - Coordenadas de ubicación (texto)
 * @property {string} descripcion - Descripción del almacén
 * @property {string|number|Object} sede - Nombre o ID de la sede asociada, o un objeto con propiedad `nombre`
 * @property {number} estado - Estado del almacén (1: Activo, 0: Inactivo)
 */

/**
 * @typedef {Object} GridAlmacenProps
 * @property {AlmacenRow[]} almacenes - Lista de almacenes a mostrar
 * @property {Function} setSelectedRow - Función para establecer el almacén seleccionado
 */

/**
 * Columnas para el DataGrid de almacenes.
 * Incluye renderizado personalizado para `sede` y `estado`.
 */
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "geolocalizacion", headerName: "Geolocalización", width: 200 },
  { field: "coordenadas", headerName: "Coordenadas", width: 200 },
  { field: "descripcion", headerName: "Descripción", width: 200 },
  {
    field: "sede",
    headerName: "Sede",
    width: 180,
    valueGetter: (params) =>
      typeof params.row.sede === "object"
        ? params.row.sede?.nombre
        : params.row.sede,
  },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) =>
      params.row.estado === 1 ? "Activo" : "Inactivo",
  },
];

/**
 * Componente GridAlmacen.
 * Renderiza una tabla interactiva con la lista de almacenes.
 *
 * @param {GridAlmacenProps} props
 * @returns {JSX.Element} Tabla de almacenes con selección de filas.
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
      getRowId={(row) => row.id}
    />
  );
}

GridAlmacen.propTypes = {
  almacenes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      geolocalizacion: PropTypes.string,
      coordenadas: PropTypes.string,
      descripcion: PropTypes.string,
      sede: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({ nombre: PropTypes.string }),
      ]),
      estado: PropTypes.number,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
