import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProductoPresentacion from "./FormProductoPresentacion";
import GridProductoPresentacion from "./GridProductoPresentacion";

export default function ProductoPresentacion() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [productoPresentaciones, setProductoPresentaciones] = useState([]);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [rowCount, setRowCount] = useState(0);

  const reloadData = async () => {
    try {
      const [
        resData,
        resProductos,
        resUnidades,
        resMarcas,
        resPresentaciones,
        resIngredientes
      ] = await Promise.all([
        axios.get("/v1/producto_presentacion"),
        axios.get("/v1/producto"),
        axios.get("/v1/unidad"),
        axios.get("/v1/marca"),
        axios.get("/v1/presentacion"),
        axios.get("/v1/ingrediente"),
      ]);

      const isArray = (data) => Array.isArray(data) ? data : [];

      const productoMap = Object.fromEntries(isArray(resProductos.data).map(p => [p.id, p.nombre]));
      const unidadMap = Object.fromEntries(isArray(resUnidades.data).map(u => [u.id, u.nombre]));
      const marcaMap = Object.fromEntries(isArray(resMarcas.data).map(m => [m.id, m.nombre]));
      const presentacionMap = Object.fromEntries(isArray(resPresentaciones.data).map(p => [p.id, p.nombre]));
      const ingredienteMap = Object.fromEntries(isArray(resIngredientes.data).map(i => [i.id, i.nombre]));

      const datos = isArray(resData.data).map((item) => ({
        ...item,
        productoNombre: productoMap[item.productoId] || "—",
        unidadNombre: unidadMap[item.unidadId] || "—",
        marcaNombre: marcaMap[item.marcaId] || "—",
        presentacionNombre: presentacionMap[item.presentacionId] || "—",
        ingredienteNombre: ingredienteMap[item.ingredienteId] || "—"
      }));

      setProductoPresentaciones(datos);
      setRowCount(datos.length);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar los datos relacionados." });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h1>Producto Presentación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProductoPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridProductoPresentacion
        productoPresentaciones={productoPresentaciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        rowCount={rowCount}
      />
    </div>
  );
}
