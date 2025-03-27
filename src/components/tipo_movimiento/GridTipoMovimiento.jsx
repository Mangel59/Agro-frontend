/**
 * @file GridTipoMovimiento.jsx
 * @module GridTipoMovimiento
 * @description Componente de grilla para mostrar los Tipos de Movimiento con paginación, filtrado y ordenamiento desde el servidor. Permite recarga desde el componente padre.
 * @author Karla
 */

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} TipoMovimientoRow
 * @property {number} id - ID del tipo de movimiento
 * @property {string} nombre - Nombre del tipo de movimiento
 * @property {string} descripcion - Descripción del tipo de movimiento
 * @property {number} estado - Estado (1: Activo, 0: Inactivo)
 * @property {number} empresa - ID de la empresa relacionada
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el snackbar está visible
 * @property {string} severity - Nivel de severidad del mensaje ("success", "error", etc.)
 * @property {string} text - Contenido del mensaje
 */

/**
 * @typedef {Object} GridTipoMovimientoProps
 * @property {function(TipoMovimientoRow): void} setSelectedRow - Función para establecer la fila seleccionada
 * @property {function(SnackbarMessage): void} setMessage - Función para mostrar mensajes tipo snackbar
 */

const columns = [
  { field: "id", headerName: "ID", width: 90, type: "number" },
  { field: "nombre", headerName: "Nombre", width: 150, type: "string" },
  { field: "descripcion", headerName: "Descripción", width: 250, type: "string" },
  {
    field: "estado",
    headerName: "Estado",
    width: 100,
    type: "string",
    valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
  },
  { field: "empresa", headerName: "Empresa", width: 150, type: "number" },
];

/**
 * Componente de grilla que muestra los Tipos de Movimiento desde el backend con paginación, orden y filtro.
 * Permite recarga desde el componente padre mediante ref.
 *
 * @param {GridTipoMovimientoProps} props - Props del componente
 * @param {React.Ref} ref - Referencia para exponer método reloadData
 * @returns {JSX.Element}
 */
const GridTipoMovimiento = forwardRef(function GridTipoMovimiento(props, ref) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

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

      const responseData = response.data;
      setData(responseData?.data || responseData || []);
      setRowCount(responseData?.header?.totalElements || responseData.length || 0);
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

  useEffect(() => {
    fetchData(
      paginationModel.page,
      paginationModel.pageSize,
      sortModel,
      filterModel
    );
  }, [paginationModel, sortModel, filterModel]);

  useImperativeHandle(ref, () => ({
    reloadData: () => {
      fetchData(
        paginationModel.page,
        paginationModel.pageSize,
        sortModel,
        filterModel
      );
    },
  }));

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
});

export default GridTipoMovimiento;
