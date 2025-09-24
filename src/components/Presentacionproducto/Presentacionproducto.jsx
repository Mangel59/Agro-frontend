import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPresentacionproducto from "./FormPresentacionproducto";
import GridPresentacionproducto from "./GridPresentacionproducto";

const toList = (data) =>
  Array.isArray(data) ? data
  : Array.isArray(data?.content) ? data.content
  : Array.isArray(data?.data) ? data.data
  : [];

export default function Presentacionproducto() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [rows, setRows] = useState([]);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = useCallback(async (p = paginationModel.page, s = paginationModel.pageSize) => {
    try {
      setLoading(true);

      // Carga concurrente del listado y los catálogos
      const [
        resListado,
        resProductos,
        resUnidades,
        resMarcas,
        resPresentaciones
      ] = await Promise.all([
        axios.get("/v1/producto_presentacion", { params: { page: p, size: s } }),
        axios.get("/v1/producto"),
        axios.get("/v1/unidad"),
        axios.get("/v1/marca"),
        axios.get("/v1/presentacion"),
      ]);

      const listPresentacion = toList(resListado.data);
      const listProductos    = toList(resProductos.data);
      const listUnidades     = toList(resUnidades.data);
      const listMarcas       = toList(resMarcas.data);
      const listTipoPres     = toList(resPresentaciones.data);

      // Mapas id -> nombre
      const productoMap     = Object.fromEntries(listProductos.map(p => [p.id, p.nombre]));
      const unidadMap       = Object.fromEntries(listUnidades.map(u => [u.id, u.nombre]));
      const marcaMap        = Object.fromEntries(listMarcas.map(m => [m.id, m.nombre]));
      const tipoPresMap     = Object.fromEntries(listTipoPres.map(t => [t.id, t.nombre]));

      // Filas enriquecidas
      const filas = listPresentacion.map(item => ({
        ...item,
        productoNombre:     productoMap[item.productoId]        ?? "—",
        unidadNombre:       unidadMap[item.unidadId]            ?? "—",
        marcaNombre:        marcaMap[item.marcaId]              ?? "—",
        presentacionNombre: tipoPresMap[item.presentacionId]    ?? "—",
      }));

      setRows(filas);

      // Soporta paginación del backend si viene {page}
      const pageInfo = resListado?.data?.page;
      if (pageInfo) {
        setRowCount(Number(pageInfo.totalElements ?? filas.length));
      } else {
        setRowCount(filas.length);
      }
    } catch (err) {
      console.error("❌ Error al cargar datos:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar Producto–Presentación." });
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  // Carga inicial + cuando cambie la paginación
  useEffect(() => {
    reloadData(paginationModel.page, paginationModel.pageSize);
  }, [reloadData, paginationModel.page, paginationModel.pageSize]);

  const onPageChange = (newModel) => {
    setPaginationModel(newModel);
    // reloadData(newModel.page, newModel.pageSize); // no hace falta, lo dispara el efecto
  };

  return (
    <div>
      <h1>Producto Presentación</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormPresentacionproducto
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(paginationModel.page, paginationModel.pageSize)}
      />

      <GridPresentacionproducto
        rows={rows}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPageChange}
        sortModel={sortModel}
        setSortModel={setSortModel}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
        rowCount={rowCount}
      />
    </div>
  );
}
