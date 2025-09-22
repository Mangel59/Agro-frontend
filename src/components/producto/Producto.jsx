import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProducto from "./FormProducto";
import GridProducto from "./GridProducto";

// Helpers robustos
const toList = (payload) => {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content; // Spring Page<>
  if (Array.isArray(payload?.data)) return payload.data;       // { data: [...] }
  if (typeof payload === "string") {
    try { return toList(JSON.parse(payload)); } catch { return []; }
  }
  return [];
};

const toMap = (payload, key = "id", label = "nombre") => {
  const arr = toList(payload);
  return Object.fromEntries(arr.map((e) => [e?.[key], e?.[label]]));
};

export default function Producto() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [productos, setProductos] = useState([]);

  // --- paginación (0-based como MUI DataGrid) ---
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = useCallback(
    async (pageArg = page, sizeArg = size) => {
      try {
        setLoading(true);

        // Sanea argumentos (0-based, enteros, límites)
        const pageQ = Math.max(0, Number.isFinite(+pageArg) ? +pageArg : 0);
        const sizeQ = Math.max(1, Number.isFinite(+sizeArg) ? +sizeArg : 10);

        const [resProductos, resCategorias, resUnidades, resIngredientes] = await Promise.all([
          // ✅ Productos paginados (Spring Page)
          axios.get("/v1/producto", { params: { page: pageQ, size: sizeQ } }),
          // ✅ Catálogos completos (no paginados)
          axios.get("/v1/items/producto_categoria/0"),
          axios.get("/v1/items/unidad/0"),
          axios.get("/v1/items/producto_presentacion_ingrediente/0"),
        ]);

        // productos (Spring Page<>)
        const dataProd = resProductos?.data ?? {};
        const lista = Array.isArray(dataProd?.content) ? dataProd.content : [];

        // catálogos
        const mapCategorias   = toMap(resCategorias?.data);
        const mapUnidades     = toMap(resUnidades?.data);
        const mapIngredientes = toMap(resIngredientes?.data);
        const mapEstados = { 1: "Activo", 2: "Inactivo" };

        const productosConNombres = lista.map((p) => ({
          ...p,
          productoCategoriaNombre: mapCategorias[p.productoCategoriaId] || "(sin categoría)",
          unidadMinimaNombre: mapUnidades[p.unidadMinimaId] || "(sin unidad)",
          estadoNombre: mapEstados[p.estadoId] || "(desconocido)",
          ingredientePresentacionNombre:
            mapIngredientes[p.ingredientePresentacionProductoId] || "(sin ingrediente)",
        }));

        setProductos(productosConNombres);

        // metadatos de Page<> (con fallback si no vienen)
        const pageServer  = Number.isFinite(dataProd?.number) ? dataProd.number : pageQ;
        const sizeServer  = Number.isFinite(dataProd?.size) ? dataProd.size : sizeQ;
        const totalElems  = Number.isFinite(dataProd?.totalElements) ? dataProd.totalElements : lista.length;
        const totalPgs    = Number.isFinite(dataProd?.totalPages)
          ? dataProd.totalPages
          : Math.ceil(totalElems / sizeServer);

        setPage(pageServer);
        setSize(sizeServer);
        setTotalElements(totalElems);
        setTotalPages(totalPgs);
      } catch (err) {
        const status = err?.response?.status;
        const body   = err?.response?.data;
        try {
          console.error("Error /v1/producto", status, JSON.stringify(body));
        } catch {
          console.error("Error /v1/producto", status, body);
        }
        setMessage({
          open: true,
          severity: "error",
          text: `Error al cargar productos${status ? ` (HTTP ${status})` : ""}`,
        });
        setProductos([]);
      } finally {
        setLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    // carga inicial (página 0)
    reloadData(0, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // Handlers (DataGrid server-side)
  const handleChangePage = (_evt, nextPage) => {
    setPage(nextPage);
    reloadData(nextPage, size);
  };

  const handleChangeRowsPerPage = (evt) => {
    const nextSize = parseInt(evt?.target?.value ?? evt, 10) || 10;
    setSize(nextSize);
    setPage(0);
    reloadData(0, nextSize);
  };

  return (
    <div>
      <h1>Productos</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormProducto
        selectedRow={selectedRow}               // opcional
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, size)}
      />

      <GridProducto
        loading={loading}
        productos={productos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        // Paginación (server-side)
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={handleChangePage}               // (event, newPage)
        onRowsPerPageChange={handleChangeRowsPerPage} // (event | number)
      />
    </div>
  );
}
