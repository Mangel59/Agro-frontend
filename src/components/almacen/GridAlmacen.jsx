import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

/**
 * GridAlmacen componente principal.
 *
 * Este componente renderiza una tabla con los almacenes usando el componente `DataGrid` de MUI.
 * Permite seleccionar una fila para su posterior edición o manejo externo.
 *
 * @module GridAlmacen
 * @component
 * @returns {JSX.Element} Tabla de almacenes con funcionalidad de selección.
 */
export default function GridAlmacen({ almacenes, setSelectedRow }) {
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
      field: "espacioNombre", 
      headerName: "Espacio", 
      width: 150 
    },
    { 
      field: "descripcion", 
      headerName: "Descripción", 
      width: 200 
    },
    { 
      field: "direccion", 
      headerName: "Dirección", 
      width: 200 
    },
    { 
      field: "geolocalizacion", 
      headerName: "Geolocalización", 
      width: 160 
    },
    { 
      field: "coordenadas", 
      headerName: "Coordenadas", 
      width: 160 
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
    if (selection.length > 0) {
      const selected = almacenes.find((a) => a.id === selection[0]);
      setSelectedRow(selected);
    } else {
      setSelectedRow(null);
    }
  };

  // ===========================
  // CONFIGURACIÓN DEL GRID
  // ===========================
  const gridConfig = {
    rows: almacenes,
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

GridAlmacen.propTypes = {
  almacenes: PropTypes.array.isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
