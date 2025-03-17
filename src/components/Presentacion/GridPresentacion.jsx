import * as React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
  {
    field: 'estado',
    headerName: 'Estado',
    width: 100,
    type: 'number',
    valueGetter: (params) => (params.row.estado === 1 ? 'Activo' : 'Inactivo'),
  },
];

/**
 * El componente GridPresentacion muestra una tabla con los datos de las Presentaciones.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @param {array} props.Presentacion - Lista de presentaciones a mostrar en la tabla.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {object} props.selectedRow - Fila actualmente seleccionada.
 * @returns {JSX.Element} La tabla de datos de Presentacion.
 */
/**
 * Componente GridPresentacion.
 * @module GridPresentacion.jsx
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
/**
 * GridPresentacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
export default function GridPresentacion(props) {
  const { Presentacion, setSelectedRow } = props;

  return (
    <DataGrid
      rows={Presentacion}
      onRowSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRowData = Presentacion.find((row) => selectedIDs.has(row.id));
        setSelectedRow(selectedRowData || null);
      }}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
      getRowId={(row) => row.id}
      autoHeight
    />
  );
}

// ✅ Validación de Props con PropTypes
GridPresentacion.propTypes = {
  Presentacion: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      estado: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedRow: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};
