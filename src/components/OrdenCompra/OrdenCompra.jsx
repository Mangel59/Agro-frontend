/**
 * @file OrdenCompra.jsx
 * @module OrdenCompra
 * @description Componente principal para gestionar órdenes de compra. Incluye formulario, grilla, paginación, ordenamiento y filtros conectados al backend.
 */

import React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";

/**
 * Componente principal `OrdenCompra`.
 * Administra el CRUD de órdenes de compra y la vista de tabla.
 *
 * @returns {JSX.Element} Componente completo con formulario y tabla.
 */
export default function OrdenCompra() {
  const row = {
    id: 0,
    fechaHora: "",
    pedidoId: "",
    proveedorId: "",
    descripcion: "",
    estadoId: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });
  const [ordenes, setOrdenes] = React.useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [rowCount, setRowCount] = React.useState(0);
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });

  const reloadData = () => {
    axios
      .get("/v1/orden_compra", {
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sort: sortModel[0]?.field,
          order: sortModel[0]?.sort,
        },
      })
      .then((response) => {
        const data = Array.isArray(response.data.data) ? response.data.data : response.data;

        const ordenesConNombre = data.map((orden) => ({
          ...orden,
          proveedorNombre: orden.proveedor?.nombre || ` ${orden.proveedorId}`,
        }));

        setOrdenes(ordenesConNombre);
        setRowCount(response.data.totalCount || ordenesConNombre.length);
      })
      .catch((error) => {
        console.error("Error al cargar órdenes:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al cargar órdenes de compra",
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel, sortModel]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Orden de Compra</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormOrdenCompra
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />

      <GridOrdenCompra
        ordenes={ordenes}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        rowCount={rowCount}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
      />
    </div>
  );
}
