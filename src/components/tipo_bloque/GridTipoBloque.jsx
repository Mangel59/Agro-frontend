import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Columnas de la tabla que define la estructura de datos en el DataGrid.
 */
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 300 },
  { 
    field: "estado", 
    headerName: "Estado", 
    width: 100, 
    valueFormatter: ({ value }) => (value === 1 ? "Activo" : "Inactivo") 
  },
];

/**
 * Muestra una tabla con los tipos de bloque utilizando `DataGrid` de MUI.
 * 
 * @component
 * @module GridTipoBloque
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.bloques - Lista de objetos que representan los tipos de bloque.
 * @param {Function} props.setSelectedRow - Función para actualizar la fila seleccionada.
 * @returns {JSX.Element} Componente que muestra una tabla con los datos.
 */
export default function GridTipoBloque({ bloques, setSelectedRow }) {
  /**
   * Maneja la selección de una fila en la tabla y actualiza el estado del componente padre.
   * @param {Array<number>} selectionModel - ID(s) de la(s) fila(s) seleccionada(s).
   */
  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = bloques.find((row) => row.id === selectionModel[0]);
      setSelectedRow(selectedRow);
    } else {
      setSelectedRow(null);
    }
  };

  return (
    <DataGrid
      rows={bloques || []}
      getRowId={(row) => row.id}
      onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
      columns={columns}
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

GridTipoBloque.propTypes = {
  /**
   * Lista de objetos tipo bloque a mostrar en la tabla.
   */
  bloques: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,

  /**
   * Función para actualizar la fila seleccionada.
   */
  setSelectedRow: PropTypes.func.isRequired,
};
