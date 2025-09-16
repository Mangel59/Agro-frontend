import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormMarca from "./FormMarca";
import GridMarca from "./GridMarca";

export default function Marca() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [marcas, setMarcas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  // 👇 estados de paginación para DataGrid (0-based)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = useCallback(async (p = page, s = pageSize) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/v1/marca", { params: { page: p, size: s } });

      const list = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
      const filas = list.map(m => ({
        ...m,
        estadoId: m.estado?.id ?? m.estadoId ?? null,
      }));
      setMarcas(filas);

      // info de paginación del backend
      if (!Array.isArray(data) && data.page) {
        setRowCount(Number(data.page.totalElements ?? filas.length));
        setPage(Number(data.page.number ?? p));
        setPageSize(Number(data.page.size ?? s));
      } else {
        setRowCount(filas.length);
      }
    } catch (err) {
      console.error("❌ Error al cargar marcas:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar marcas" });
      setMarcas([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { reloadData(0, pageSize); }, [reloadData, pageSize]);

  return (
    <div>
      <h1>Marcas</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormMarca
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, pageSize)}
      />

      <GridMarca
        rows={marcas}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}

        /* Props típicos de MUI DataGrid en modo server */
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={(newPage) => reloadData(newPage, pageSize)}
        onPageSizeChange={(newSize) => reloadData(0, newSize)}
      />
    </div>
  );
}
