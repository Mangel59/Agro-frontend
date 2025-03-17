
/**
 * GridTipoMovimiento componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from "react";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

const columns = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "nombre", headerName: "Nombre", width: 150, type: "string" },
  { field: "descripcion", headerName: "Descripción", width: 250, type: "string" },
  { field: "estado", headerName: "Estado", width: 100, type: "string",
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
  { field: "empresa", headerName: "Empresa", width: 150, type: "number" },
];

/**
 * Componente GridTipoMovimiento.
 * @module GridTipoMovimiento.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridTipoMovimiento(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const fetchData = async (page, pageSize, sortModel, filterModel) => {
    setLoading(true);
    try {
      const url = `${SiteProps.urlbasev1}/tipo_movimiento`;
      const params = {
        page: page + 1,
        size: pageSize,
        sortBy: sortModel[0]?.field || "",
        sortDirection: sortModel[0]?.sort || "asc",
        ...filterModel.items.reduce((acc, filter) => {
          acc[filter.columnField] = filter.value;
          return acc;
        }, {}),
      };

      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(response.data?.data || response.data || []);
      setRowCount(response.data?.header?.totalElements || response.data?.length || 0);
    } catch (error) {
      console.error("Error al cargar los datos del backend:", error);
      props.setMessage({
        open: true,
        severity: "error",
        text: `Error al cargar los datos del backend: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel);
  }, [paginationModel, sortModel, filterModel]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 15, 20]}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        sortingMode="server"
        onSortModelChange={(model) => setSortModel(model)}
        filterMode="server"
        onFilterModelChange={(model) => setFilterModel(model)}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(ids) => {
          const selectedID = ids[0];
          const selectedRow = data.find((row) => row.id === selectedID);
          props.setSelectedRow(selectedRow || { id: 0 });
        }}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
