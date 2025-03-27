/**
 * @file GridProductoPresentacion.jsx
 * @module GridProductoPresentacion
 * @description Componente de grilla para visualizar productos presentación con paginación, ordenamiento y filtros.
 * Utiliza el componente DataGrid de Material-UI y permite seleccionar una fila para edición o eliminación.
 * Incluye toolbar personalizada con botón de filtros. Soporta configuración server-side.
 * @author Karla
 */

import * as React from "react";
import PropTypes from "prop-types";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

/**
 * @typedef {Object} ProductoPresentacionRow
 * @property {number} id - ID del producto presentación
 * @property {string} nombre - Nombre de la presentación
 * @property {number|string} producto - ID o nombre del producto asociado
 * @property {number|string} unidad - Unidad de medida
 * @property {number} cantidad - Cantidad en esa presentación
 * @property {number|string} marca - Marca asociada
 * @property {number|string} presentacion - Presentación específica (tipo)
 * @property {string} descripcion - Descripción de la presentación
 * @property {number} estado - Estado de la presentación (1: Activo, 0: Inactivo)
 */

/**
 * @typedef {Object} GridProductoPresentacionProps
 * @property {ProductoPresentacionRow[]} presentaciones - Lista de presentaciones para mostrar
 * @property {number} rowCount - Total de filas para paginación server-side
 * @property {Object} paginationModel - Modelo de paginación actual
 * @property {Function} setPaginationModel - Función para actualizar el modelo de paginación
 * @property {Function} setSortModel - Función para actualizar el ordenamiento
 * @property {Function} setFilterModel - Función para actualizar el modelo de filtros
 * @property {Function} setSelectedRow - Función para establecer la fila seleccionada
 */

/**
 * Columnas para el DataGrid de productos presentación.
 */
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "producto", headerName: "Producto", width: 150 },
  { field: "unidad", headerName: "Unidad", width: 100 },
  { field: "cantidad", headerName: "Cantidad", width: 100 },
  { field: "marca", headerName: "Marca", width: 120 },
  { field: "presentacion", headerName: "Presentación", width: 130 },
  { field: "descripcion", headerName: "Descripción", width: 250 },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Barra de herramientas personalizada que incluye botón de filtros.
 * @returns {JSX.Element} Toolbar personalizada con filtros
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

/**
 * Componente GridProductoPresentacion.
 * Renderiza una tabla de productos presentación con paginación, filtros y ordenamiento desde servidor.
 *
 * @param {GridProductoPresentacionProps} props
 * @returns {JSX.Element} Tabla de productos presentación
 */
export default function GridProductoPresentacion({
  presentaciones,
  rowCount,
  paginationModel,
  setPaginationModel,
  setSortModel,
  setFilterModel,
  setSelectedRow,
}) {
  return (
    <div style={{ width: "100%", background: "#fff", padding: 16, borderRadius: 8 }}>
      <DataGrid
        rows={presentaciones || []}
        columns={columns}
        getRowId={(row) => row.id}
        rowCount={rowCount}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
        onRowSelectionModelChange={(ids) => {
          const selectedId = ids[0];
          const row = presentaciones.find((r) => r.id === selectedId);
          setSelectedRow(row || null);
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        components={{ Toolbar: CustomToolbar }}
        autoHeight
      />
    </div>
  );
}

GridProductoPresentacion.propTypes = {
  presentaciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      producto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      unidad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cantidad: PropTypes.number,
      marca: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      presentacion: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      descripcion: PropTypes.string,
      estado: PropTypes.number,
    })
  ).isRequired,
  rowCount: PropTypes.number.isRequired,
  paginationModel: PropTypes.object.isRequired,
  setPaginationModel: PropTypes.func.isRequired,
  setSortModel: PropTypes.func.isRequired,
  setFilterModel: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
