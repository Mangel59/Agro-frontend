/**
 * @file GridTipoProduccion.jsx
 * @module GridTipoProduccion
 * @description Componente de grilla para mostrar los tipos de producción con paginación, filtrado y ordenamiento desde el servidor.
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
 * Columnas de la grilla
 */
const columns = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "nombre", headerName: "Nombre", width: 150, type: "string" },
  { field: "descripcion", headerName: "Descripción", width: 250, type: "string" },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    type: "number",
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
];

/**
 * Componente para mostrar los tipos de producción en una tabla con paginación, ordenamiento y filtrado.
 * @param {GridTipoProduccionProps} props - Props del componente
 * @returns {JSX.Element} Componente de tabla.
 */
export default function GridTipoProduccion(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  /**
   * Obtiene los datos del backend.
   * @param {number} page - Página actual
   * @param {number} pageSize - Tamaño de la página
   * @param {Array<Object>} sortModel - Modelo de ordenamiento
   * @param {Object} filterModel - Modelo de filtrado
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
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

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

  // Recarga los datos cada vez que cambia la paginación, el orden o el filtro
  React.useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel);
  }, [paginationModel, sortModel, filterModel]);

  // Permite recargar datos desde el componente padre usando ref
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
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 15, 20]}
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
      />
    </div>
  );
}
