import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: "id", headerName: "ID", width: 70, type: "number" },
  { field: "nombre", headerName: "Nombre", width: 150, type: "string" },
  { field: "descripcion", headerName: "Descripción", width: 300, type: "string" },
  { field: "estado", headerName: "Estado", width: 100, type: "string",
    valueFormatter: ({ value }) => (value === 1 ? "Activo" : "Inactivo") },
];

const GridTipoSedes = React.forwardRef(({ setSelectedRow }, ref) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const fetchData = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get("http://172.16.79.156:8080/api/v1/tipo_sede", {
        params: { page, size: pageSize }
      });
      setData(response.data?.content || []);
      setRowCount(response.data?.page?.totalElements || 0);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Exponer `fetchData` como referencia
  React.useImperativeHandle(ref, () => fetchData);

  React.useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    fetchData(model.page, model.pageSize);
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[5, 10, 15]}
        components={{
          Toolbar: GridToolbarContainer,
        }}
        onRowClick={(params) => setSelectedRow(params.row)}
      />
    </div>
  );
});

export default GridTipoSedes;
