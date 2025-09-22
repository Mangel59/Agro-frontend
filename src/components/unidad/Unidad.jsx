import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormUnidad from "./FormUnidad";
import GridUnidad from "./GridUnidad";

export default function Unidad() {
  const [selectedRow, setSelectedRow] = useState({ id: 0 });
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  // estados de paginación (server-side)
  const [page, setPage] = useState(0);           // cero-based
  const [pageSize, setPageSize] = useState(10);  // tamaño por página
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async (pageArg = page, sizeArg = pageSize) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/v1/unidad", {
        params: { page: pageArg, size: sizeArg }, // <-- backend espera cero-based
      });

      // Estructura esperada:
      // { content: [...], page: { size, number, totalElements, totalPages } }
      const contenido = Array.isArray(data?.content) ? data.content : [];
      const filas = contenido.map((item) => ({
        ...item,
        estadoId: item?.estado?.id ?? item?.estadoId,
      }));

      setRows(filas);
      const total = data?.page?.totalElements ?? filas.length;
      setRowCount(total);

      // sincroniza si backend devuelve el número vigente
      if (typeof data?.page?.number === "number") setPage(data.page.number);
      if (typeof data?.page?.size === "number") setPageSize(data.page.size);
    } catch (err) {
      setMessage({ open: true, severity: "error", text: "Error al cargar unidades" });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // carga inicial y cada vez que cambien page/pageSize
  useEffect(() => {
    fetchPage(page, pageSize);
  }, [fetchPage, page, pageSize]);

  // para reusar después de crear/editar/eliminar
  const reloadData = () => fetchPage(0, pageSize);

  return (
    <div>
      <h1>Unidades</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormUnidad
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || { id: 0 }}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridUnidad
        rows={rows}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
        onRowClick={(row) => {
          setSelectedRow(row);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
