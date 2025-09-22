import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

/**
 * GridEspacio componente principal.
 *
 * Este componente renderiza una tabla con los espacios usando el componente `DataGrid` de MUI.
 * Permite seleccionar una fila para su posterior edición o manejo externo.
 *
 * @module GridEspacio
 * @component
 * @returns {JSX.Element} Tabla de espacios con funcionalidad de selección.
 */
export default function GridEspacio({ espacios, setSelectedRow }) {
  // ===========================
  // CONFIGURACIÓN DE COLUMNAS
  // ===========================
  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 70 
    },
    { 
      field: "nombre", 
      headerName: "Nombre", 
      width: 180 
    },
    { 
      field: "tipoEspacioNombre", 
      headerName: "Tipo Espacio", 
      width: 140 
    },
    { 
      field: "bloqueNombre", 
      headerName: "Bloque", 
      width: 150 
    },
    { 
      field: "descripcion", 
      headerName: "Descripción", 
      width: 200 
    },
    {
      field: "estadoId",
      headerName: "Estado",
      width: 100,
      valueGetter: (params) =>
        params.row.estadoId === 1 ? "Activo" : "Inactivo",
    },
  ];

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  /**
   * Maneja la selección de filas del `DataGrid`.
   * @param {Array} selection - Lista de IDs seleccionados.
   */
  const handleRowSelection = (selection) => {
    const selected = espacios.find(e => e.id === selection[0]);
    setSelectedRow(selected || null);
  };

  // ===========================
  // CONFIGURACIÓN DEL GRID
  // ===========================
  const gridConfig = {
    rows: espacios,
    columns: columns,
    getRowId: (row) => row.id,
    onRowSelectionModelChange: handleRowSelection,
    initialState: {
      pagination: {
        paginationModel: { pageSize: 5 },
      },
    },
    pageSizeOptions: [5, 10, 20],
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid {...gridConfig} />
    </div>
  );
}

GridEspacio.propTypes = {
  espacios: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
