import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";

export default function Producto() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [productos, setProductos] = useState([]);

  // --- estados de paginación que devuelve el backend ---
  const [page, setPage] = useState(0);          // number (0-based)
  const [size, setSize] = useState(10);         // page size
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = useCallback(async (pageArg = page, sizeArg = size) => {
    try {
      setLoading(true);

      const [resProductos, resCategorias, resUnidades, resIngredientes] = await Promise.all([
        axios.get("/v1/producto", { params: { page: pageArg, size: sizeArg } }),
        axios.get("/v1/producto_categoria"),
        axios.get("/v1/unidad"),
        axios.get("/v1/ingrediente-presentacion-producto"), // << corregido: faltaba la barra
      ]);

      const dataProd = resProductos?.data ?? {};
      const lista = Array.isArray(dataProd.content) ? dataProd.content : [];

      const mapCategorias = Object.fromEntries((resCategorias.data ?? []).map(cat => [cat.id, cat.nombre]));
      const mapUnidades  = Object.fromEntries((resUnidades.data ?? []).map(u => [u.id, u.nombre]));
      const mapIngredientes = Object.fromEntries((resIngredientes.data ?? []).map(i => [i.id, i.nombre]));
      const mapEstados = { 1: "Activo", 2: "Inactivo" };

      const productosConNombres = lista.map(p => ({
        ...p,
        productoCategoriaNombre: mapCategorias[p.productoCategoriaId] || "(sin categoría)",
        unidadMinimaNombre: mapUnidades[p.unidadMinimaId] || "(sin unidad)",
        estadoNombre: mapEstados[p.estadoId] || "(desconocido)",
        ingredientePresentacionNombre:
          mapIngredientes[p.ingredientePresentacionProductoId] || "(sin ingrediente)",
      }));

      setProductos(productosConNombres);

      // actualizar metadatos de paginación
      if (dataProd.page) {
        setPage(dataProd.page.number ?? 0);
        setSize(dataProd.page.size ?? sizeArg);
        setTotalElements(dataProd.page.totalElements ?? 0);
        setTotalPages(dataProd.page.totalPages ?? 0);
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar productos" });
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    reloadData(0, size); // carga inicial en página 0
  }, [reloadData, size]);

  // Handlers de paginación (si tu GridProducto los usa)
  const handleChangePage = (nextPage) => {
    // nextPage debe ser 0-based
    setPage(nextPage);
    reloadData(nextPage, size);
  };

  const handleChangeRowsPerPage = (nextSize) => {
    setSize(nextSize);
    setPage(0);
    reloadData(0, nextSize);
  };

  return (
    <div>
      <h1>Gestión de Productos</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormProducto
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, size)}
      />

      <GridProducto
        loading={loading}
        productos={productos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        // props opcionales de paginación para tu tabla
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
