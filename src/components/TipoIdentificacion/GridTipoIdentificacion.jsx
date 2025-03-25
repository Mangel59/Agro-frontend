/**
 * @file GridTipoIdentificacion.jsx
 * @module GridTipoIdentificacion
 * @description Componente de grilla para mostrar los tipos de identificación. Utiliza DataGrid de MUI y permite seleccionar filas para editar.
 * @author Karla
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";

/**
 * Columnas utilizadas en el DataGrid para mostrar los tipos de identificación.
 * @constant {Array<Object>}
 */
const columns = [
  { field: "tii_id", headerName: "ID", width: 90 },
  { field: "tii_nombre", headerName: "Nombre", width: 200 },
  { field: "tii_descripcion", headerName: "Descripción", width: 300 },
  {
    field: "tii_estado",
    headerName: "Estado",
    width: 150,
    valueGetter: (params) => (params.row.tii_estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente que renderiza una tabla de tipos de identificación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.tiposIdentificacion - Lista de tipos de identificación.
 * @param {function(Object): void} props.onEdit - Función que se llama al hacer clic en una fila, recibe el objeto de tipo seleccionado.
 * @returns {JSX.Element} Tabla renderizada con los datos proporcionados.
 */
export default function GridTipoIdentificacion({ tiposIdentificacion, onEdit }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tiposIdentificacion}
        columns={columns}
        getRowId={(row) => row.tii_id}
        onRowClick={(rowData) => onEdit(rowData.row)}
      />
    </div>
  );
}
