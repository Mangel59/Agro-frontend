/**
 * @file GridPersona.jsx
 * @module GridPersona
 * @description Componente de grilla para mostrar la lista de personas con paginación y filtro. Utiliza MUI DataGrid.
 * @author Karla
 */

import * as React from "react";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";

/**
 * Columnas definidas para mostrar los datos de personas en la tabla.
 * @type {Array<Object>}
 */
const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "tipoIdentificacion", headerName: "Tipo ID", width: 130 },
  { field: "identificacion", headerName: "Identificación", width: 150 },
  { field: "nombre", headerName: "Nombre", width: 130 },
  { field: "apellido", headerName: "Apellido", width: 130 },
  { field: "genero", headerName: "Género", width: 100 },
  { field: "fechaNacimiento", headerName: "Fecha Nac.", width: 130 },
  { field: "estrato", headerName: "Estrato", width: 90 },
  { field: "direccion", headerName: "Dirección", width: 180 },
  { field: "email", headerName: "Email", width: 180 },
  { field: "celular", headerName: "Celular", width: 130 },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente de barra de herramientas personalizada con filtro.
 * @returns {JSX.Element} Toolbar personalizada.
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

/**
 * Componente GridPersona.
 *
 * Muestra una tabla de personas con paginación, filtros y selección de fila.
 *
 * @component
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.personas - Lista de personas para mostrar en la tabla.
 * @param {Object} props.selectedRow - Persona seleccionada actualmente.
 * @param {Function} props.setSelectedRow - Función para actualizar la persona seleccionada.
 * @param {Object} props.pagination - Objeto de paginación con `page`, `pageSize` y `total`.
 * @param {Function} props.onPageChange - Función para manejar el cambio de página.
 * @returns {JSX.Element} Tabla de personas con paginación y selección.
 */
export default function GridPersona({
  personas,
  selectedRow,
  setSelectedRow,
  pagination,
  onPageChange,
}) {
  const handlePageChange = (newPage, newPageSize) => {
    onPageChange(newPage, newPageSize);
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={personas}
        columns={columns}
        paginationMode="server"
        rowCount={pagination.total}
        paginationModel={{
          page: pagination.page,
          pageSize: pagination.pageSize,
        }}
        onPaginationModelChange={(model) => {
          handlePageChange(model.page, model.pageSize);
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        components={{ Toolbar: CustomToolbar }}
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRowData = personas.find((row) => selectedIDs.has(row.id));
          setSelectedRow(selectedRowData || {});
        }}
      />
    </div>
  );
}

GridPersona.propTypes = {
  personas: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRow: PropTypes.object,
  setSelectedRow: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
};
