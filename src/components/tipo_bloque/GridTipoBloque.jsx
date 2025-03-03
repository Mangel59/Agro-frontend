import * as React from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import { DataGrid } from '@mui/x-data-grid';

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

export default function GridTipoBloque({ bloques, setSelectedRow }) {
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

// Definición de PropTypes para validar los props
GridTipoBloque.propTypes = {
  bloques: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
};
