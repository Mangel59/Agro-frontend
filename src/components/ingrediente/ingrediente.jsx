import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormIngrediente from "./FormIngrediente";
import GridIngrediente from "./GridIngrediente";

export default function Ingrediente() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 estado correcto para el Dialog
  const [formOpen, setFormOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const reloadData = useCallback(async (p = page, s = pageSize) => {
    try {
      setLoading(true);
      const res = await axios.get("/v1/ingrediente", { params: { page: p, size: s } });
      const data = res?.data ?? {};
      const list = Array.isArray(data) ? data : (data.content ?? []);
      const filas = list.map(it => ({ ...it, estadoId: it.estado?.id ?? it.estadoId ?? null }));
      setIngredientes(filas);

      if (!Array.isArray(data)) {
        setRowCount(Number(data.page?.totalElements ?? filas.length));
        setPage(Number(data.page?.number ?? p));
        setPageSize(Number(data.page?.size ?? s));
      } else {
        setRowCount(filas.length);
      }
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al cargar ingredientes" });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { reloadData(0, pageSize); }, [reloadData, pageSize]);

  return (
    <div>
      <h1>Ingredientes</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormIngrediente
        open={formOpen}                
        setOpen={setFormOpen}           
        selectedRow={selectedRow || {}}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, pageSize)}
      />

      <GridIngrediente
        rows={ingredientes}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={(newPage) => { setPage(newPage); reloadData(newPage, pageSize); }}
        onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); reloadData(0, newSize); }}
      />
    </div>
  );
}
