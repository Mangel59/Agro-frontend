import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormCategoriaEstado from "./FormCategoriaEstado.jsx";
import GridCategoriaEstado from "./GridCategoriaEstado.jsx";

export default function CategoriaEstado() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const reloadData = useCallback(async () => {
    try {
      const res = await axios.get("/v1/categoria-estado");
      const data = res?.data ?? [];
      const list = Array.isArray(data) ? data : (data.content ?? []);
      setRows(list);
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al cargar categorías" });
    }
  }, []);

  useEffect(() => { reloadData(); }, [reloadData]);

  return (
    <div>
      <h1>Categoría Estado</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormCategoriaEstado
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow || {}}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridCategoriaEstado
        rows={rows}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
