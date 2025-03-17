/**
 * GridEmpresa componente principal.
 * @module GridEmpresa
 * @component
 * @returns {JSX.Element}
 */

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} EmpresaRow
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} estado
 * @property {string} celular
 * @property {string} correo
 * @property {string} contacto
 * @property {number} tipoIdentificacionId
 * @property {number} personaId
 * @property {string} identificacion
 * @property {string} logo // ✅ nuevo campo
 */

/**
 * @typedef {Object} GridEmpresaProps
 * @property {EmpresaRow} selectedRow - La fila seleccionada actualmente.
 * @property {function} setSelectedRow - Función para establecer la fila seleccionada.
 * @property {EmpresaRow[]} empresas - Lista de empresas disponibles.
 */

/**
 * Componente GridEmpresa para mostrar la tabla de empresas.
 * @param {GridEmpresaProps} props
 * @returns {JSX.Element}
 */
export default function GridEmpresa(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 5,
    page: 0,
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, type: 'number' },
    { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
    { field: 'descripcion', headerName: 'Descripción', width: 250, type: 'string' },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      type: 'string',
      valueGetter: (params) => params.row.estado === 1 ? "Activo" : "Inactivo"
    },
    { field: 'celular', headerName: 'Celular', width: 100, type: 'string' },
    { field: 'correo', headerName: 'Correo', width: 150, type: 'string' },
    { field: 'contacto', headerName: 'Contacto', width: 150, type: 'string' },
    { field: 'tipoIdentificacionId', headerName: 'Tipo de Identificación', width: 150, type: 'number' },
    { field: 'personaId', headerName: 'Persona', width: 100, type: 'number' },
    { field: 'identificacion', headerName: 'No. de Identificación', width: 150, type: 'string' },

    // ✅ NUEVO: columna para el logo
    {
      field: 'logo',
      headerName: 'Logo',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="logo"
            style={{ maxHeight: 40, maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          "Sin logo"
        ),
    }
  ];

  const fetchData = async (page, pageSize, sortModel, filterModel) => {
    setLoading(true);
    try {
      const baseURL = `${SiteProps.urlbasev1}/empresas`;

      const filterParams = filterModel.items.length > 0 ? {
        [filterModel.items[0]?.columnField]: filterModel.items[0]?.value
      } : {};

      const response = await axios.get(baseURL, {
        params: {
          page: page + 1,
          size: pageSize,
          sortBy: sortModel[0]?.field || '',
          sortDirection: sortModel[0]?.sort || 'asc',
          ...filterParams
        },
      });

      setData(response.data?.data || []);
      setRowCount(response.data?.header?.totalElements || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel);
  }, [paginationModel, sortModel, filterModel]);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    fetchData(model.page, model.pageSize, sortModel, filterModel);
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        sortingMode="server"
        onSortModelChange={(model) => setSortModel(model)}
        filterMode="server"
        onFilterModelChange={(model) => setFilterModel(model)}
        pageSizeOptions={[5, 10, 20, 50]}
        onRowSelectionModelChange={(id) => {
          const selectedIDs = new Set(id);
          const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
          props.setSelectedRow(selectedRowData[0]);
        }}
      />
    </div>
  );
}
