// src/components/Proceso.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
// OJO: si tu archivo se llama FormProceso.jsx, cambia esta ruta a "./FormProceso"
import FormProceso from "./FromProceso";
import GridProceso from "./GridProceso";

/* ------------------------ Helpers robustos ------------------------ */
const toList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content; // Page<>
  if (Array.isArray(payload?.data)) return payload.data;       // { data: [...] }
  if (typeof payload === "string") { try { return JSON.parse(payload); } catch { return []; } }
  return [];
};

const toMap = (payload, key = "id", label = "name") => {
  const list = toList(payload);
  const map = {};
  for (const it of list) {
    const k = it?.[key];
    if (k != null) map[String(k)] = it?.[label];
  }
  return map;
};
/* ----------------------------------------------------------------- */

export default function Proceso() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  const [procesosRaw, setProcesosRaw] = useState([]);
  const [tipoProduccionMap, setTipoProduccionMap] = useState({}); // id -> name

  // Cargar catálogo: tipo_produccion (id, name)
  const loadTipoProduccion = async () => {
    try {
      const res = await axios.get("/v1/items/tipo_produccion/0"); // ← usa 'name'
      setTipoProduccionMap(toMap(res.data, "id", "name"));
    } catch (e) {
      console.error("No se pudo cargar tipo_produccion:", e);
      setTipoProduccionMap({});
      setMessage({
        open: true,
        severity: "error",
        text: "No se pudo cargar el catálogo de Tipo de Producción.",
      });
    }
  };

  // Cargar procesos
  const loadProcesos = async () => {
    try {
      const res = await axios.get("/v1/proceso");
      setProcesosRaw(toList(res.data));
    } catch (err) {
      console.error("Error al cargar procesos:", err);
      setMessage({ open: true, severity: "error", text: "Error al cargar procesos." });
    }
  };

  // Public: volver a cargar datos (útil para formularios)
  const reloadData = async () => {
    // Primero catálogos (para mapear nombres), luego procesos
    await loadTipoProduccion();
    await loadProcesos();
    setMessage({ open: true, severity: "success", text: "Datos actualizados." });
  };

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enriquecer procesos con el nombre del tipo de producción
  const procesos = useMemo(() => {
    return (procesosRaw ?? []).map((p) => {
      // Prioriza si viene anidado { tipoProduccion: { name } }, si no, usa el mapa por id
      const nameDirecto = p?.tipoProduccion?.name;
      const namePorMapa = tipoProduccionMap[String(p?.tipoProduccionId)];
      return {
        ...p,
        id: p?.id, // asegura id para DataGrid
        tipoProduccionNombre: nameDirecto ?? namePorMapa ?? "",
      };
    });
  }, [procesosRaw, tipoProduccionMap]);

  return (
    <div>
      <h1>Procesos</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormProceso
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridProceso
        procesos={procesos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
