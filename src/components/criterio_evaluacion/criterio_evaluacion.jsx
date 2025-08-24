import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormCriterioEvaluacion from "./FormCriterioEvaluacion.jsx";
import GridCriterioEvaluacion from "./GridCriterioEvaluacion.jsx";

export default function CriterioEvaluacion() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const reloadData = useCallback(async (p = page, s = pageSize) => {
    try {
      setLoading(true);
      const res = await axios.get("/v1/criterio_evaluacion", { params: { page: p, size: s } });
      const data = res?.data ?? {};
      const list = Array.isArray(data) ? data : (data.content ?? []);

      const filas = list.map(it => ({
        ...it,
        estadoId: it.estado?.id ?? it.estadoId ?? null,
        tipoEvaluacionId: it.tipoEvaluacion?.id ?? it.tipoEvaluacionId ?? null,
        tipoEvaluacionNombre: it.tipoEvaluacion?.nombre ?? it.tipoEvaluacionNombre ?? "",
      }));

      setRows(filas);

      if (!Array.isArray(data)) {
        setRowCount(Number(data.page?.totalElements ?? filas.length));
        setPage(Number(data.page?.number ?? p));
        setPageSize(Number(data.page?.size ?? s));
      } else {
        setRowCount(filas.length);
      }
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al cargar criterios" });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { reloadData(0, pageSize); }, [reloadData, pageSize]);

  return (
    <div>
      <h1>Criterios de Evaluación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormCriterioEvaluacion
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || {}}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, pageSize)}
      />

      <GridCriterioEvaluacion
        rows={rows}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
