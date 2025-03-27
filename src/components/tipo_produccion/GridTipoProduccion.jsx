/**
 * @file GridTipoProduccion.jsx
 * @module GridTipoProduccion
 * @description Componente de grilla para mostrar los tipos de producción con paginación, filtrado y ordenamiento desde el servidor. La grilla se ajusta automáticamente a la altura del contenido usando `autoHeight`.
 */

import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton
} from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoProduccionRow
 * @property {number} id - ID del tipo de producción
 * @property {string} nombre - Nombre del tipo de producción
 * @property {string} descripcion - Descripción
 * @property {number} estado - Estado (1: Activo, 0: Inactivo)
 * @property {number} empresa - ID de la empresa asociada
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el snackbar está visible
 * @property {string} severity - Nivel de severidad del mensaje
 * @property {string} text - Contenido del mensaje
 */

/**
 * @typedef {Object} GridTipoProduccionProps
 * @property {function} setSelectedRow - Función para establecer la fila seleccionada
 * @property {Object} innerRef - Referencia imperativa para recargar datos desde el componente padre
 * @property {function} setMessage - Función para mostrar mensajes tipo snackbar
 */

/**
 * Columnas de la grilla.
 */
const columns = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "nombre", headerName: "Nombre", width: 150, type: "string" },
  { field: "descripcion", headerName: "Descripción", width: 250, type: "string" },
  { field: "empresa", headerName: "Empresa", width: 120, type: "number" },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    type: "number",
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente que muestra la grilla de tipos de producción.
 * @param {GridTipoProduccionProps} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
export default function GridTipoProduccion(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  /**
   * Obtiene los datos del backend.
   */
  const fetchData = async (page, pageSize, sortModel, filterModel) => {
    setLoading(true);
    try {
      const url = `${SiteProps.urlbasev1}/tipo_produccion`;
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

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado");

      const response = await axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response.data;
      setData(responseData?.data || responseData || []);
      setRowCount(responseData?.header?.totalElements || responseData.length || 0);
    } catch (error) {
      console.error("Error al cargar los datos del backend:", error);
      if (typeof props.setMessage === "function") {
        props.setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar los datos del backend",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Recargar cuando cambien los filtros, paginación u orden
  React.useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel);
  }, [paginationModel, sortModel, filterModel]);

  // Exponer método recarga con ref
  React.useImperativeHandle(props.innerRef, () => ({
    reloadData: () => fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel),
  }));

  /**
   * Componente personalizado de toolbar
   * @returns {JSX.Element}
   */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ width: "100%", backgroundColor: "white" }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 20]}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        onSortModelChange={setSortModel}
        filterMode="server"
        onFilterModelChange={setFilterModel}
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(ids) => {
          const selectedID = ids[0];
          const selectedRow = data.find((row) => row.id === selectedID);
          props.setSelectedRow(selectedRow || { id: 0 });
        }}
        components={{ Toolbar: CustomToolbar }}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
        }}
      />
    </div>
  );
}
