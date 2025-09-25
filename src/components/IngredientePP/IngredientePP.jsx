// IngredientePP.jsx (padre)
import React, { useState, useEffect, useMemo } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormIngredientePresentacionP from "./FormIngredientePresentacionP.jsx";
import GridIngredientePresentacionP from "./GridIngredientePresentacionP.jsx";

export default function IngredientePresentacionProducto() {
  const [selectedRow, setSelectedRow] = useState({});
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [datos, setDatos] = useState([]); // filas crudas con IDs
  const [formOpen, setFormOpen] = useState(false);

  // catálogos como mapas id->name
  const [ingredientesMap, setIngredientesMap] = useState({});
  const [presentacionesMap, setPresentacionesMap] = useState({});

  const toMap = (arr = []) => {
    const m = {};
    (Array.isArray(arr) ? arr : []).forEach(it => {
      m[String(it.id)] = it.name ?? it.nombre ?? `ID ${it.id}`;
    });
    return m;
  };

  const reloadData = () => {
    axios.get("v1/ingrediente-presentacion-producto")
      .then(res => setDatos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage({ open: true, severity: "error", text: "Error al cargar datos" }));
  };

  const loadCatalogs = async () => {
    try {
      const [ings, pres] = await Promise.all([
        axios.get("/v1/items/ingrediente/0"),
        axios.get("/v1/items/producto_presentacion/0"),
      ]);
      setIngredientesMap(toMap(ings.data));
      setPresentacionesMap(toMap(pres.data));
    } catch {
      setIngredientesMap({});
      setPresentacionesMap({});
    }
  };

  useEffect(() => {
    reloadData();
    loadCatalogs();
  }, []);

  // ← AQUI creamos rowsConJoin
  const rowsConJoin = useMemo(() => {
    return (datos || []).map(r => ({
      ...r,
      ingredienteNombre: ingredientesMap[String(r.ingredienteId)] ?? String(r.ingredienteId ?? ""),
      presentacionNombre: presentacionesMap[String(r.presentacionProductoId)] ?? String(r.presentacionProductoId ?? ""),
    }));
  }, [datos, ingredientesMap, presentacionesMap]);

  return (
    <div>
      <h1>Ingrediente Producto Presentacion</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormIngredientePresentacionP
        open={formOpen}
        setOpen={setFormOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />

      <GridIngredientePresentacionP
        rows={rowsConJoin}                      
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}
