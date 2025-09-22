// src/components/bloque/Bloque.jsx
import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormBloque from "./FormBloque";
import GridBloque from "./GridBloque";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Bloque() {
  // -------------------- Filtros (vía modal) --------------------
  // Para Bloque: País → Depto → Municipio → Sede
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // -------------------- Catálogos “items” (única fuente de nombres) --------------------
  const [tiposBloqueItems, setTiposBloqueItems] = useState([]); // [{id, name}]
  const [sedesItems, setSedesItems] = useState([]);             // [{id, name}]

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const tiposBloqueForm = tiposBloqueItems.map(t => ({ id: t.id, nombre: t.name }));
  const sedesForm       = sedesItems.map(s => ({ id: s.id, nombre: s.name }));

  // -------------------- Datos --------------------
  const [bloques, setBloques] = useState([]);

  // -------------------- UI CRUD --------------------
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  // -------------------- Auth / helpers --------------------
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // ---- Loaders del modal (usan /v1)
  const { getPaises, getDepartamentos, getMunicipios, getSedes } = makeLoaders(headers);

  // ---- Campos del modal SOLO para Bloque
  const fieldsBloque = [
    { name: "paisId", label: "País", getOptions: getPaises, clearChildren: ["deptoId", "municipioId", "sedeId"] },
    { name: "deptoId", label: "Departamento", getOptions: getDepartamentos, dependsOn: ["paisId"], disabled: (v) => !v.paisId, clearChildren: ["municipioId", "sedeId"] },
    { name: "municipioId", label: "Municipio", getOptions: getMunicipios, dependsOn: ["deptoId"], disabled: (v) => !v.deptoId, clearChildren: ["sedeId"] },
    { name: "sedeId", label: "Sede", getOptions: getSedes, dependsOn: ["municipioId"], disabled: (v) => !v.municipioId },
  ];

  // -------------------- Cargar “items” --------------------
// -------------------- Cargar “items” --------------------
useEffect(() => {
  // Tipos de bloque (sí existe /v1/items/tipo_bloque/0)
  axios
    .get("/v1/items/tipo_bloque/0")
    .then((res) => setTiposBloqueItems(Array.isArray(res.data) ? res.data : []))
    .catch(() => setTiposBloqueItems([]));

  // Sedes: intentar /v1/items/sede/0 y si falla, caer a /v1/sede
  (async () => {
    try {
      const r = await axios.get("/v1/items/sede/0");
      const arr = Array.isArray(r.data) ? r.data : [];
      if (arr.length) {
        setSedesItems(arr); // [{id,name}]
        return;
      }
      throw new Error("empty");
    } catch {
      try {
        const { data } = await axios.get("/v1/sede", {
          ...headers,
          params: { page: 0, size: 2000 },
        });
        // normaliza a shape "items"
        const list = (Array.isArray(data) ? data : data?.content ?? []).map((s) => ({
          id: s.id,
          name: s.nombre, // <-- importante
        }));
        setSedesItems(list);
      } catch {
        setSedesItems([]);
      }
    }
  })();
}, []);


  // -------------------- Cargar bloques (CRUD) --------------------
  const reloadData = () => {
    const { sedeId } = filters;

    const req = sedeId
      ? axios.get("/v1/bloque", { ...headers, params: { sedeId: Number(sedeId), page: 0, size: 2000 } })
      : axios.get("/v1/bloque", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos “items”
        const normalizadas = lista.map((b) => {
          const tipoId = b.tipoBloqueId ?? b.tipo_bloque_id ?? b.tipoBloque?.id ?? "";
          const sedeIdNum = b.sedeId ?? b.sede?.id ?? b.sede_id ?? "";

          const tipo = tiposBloqueItems.find((t) => Number(t.id) === Number(tipoId));
          const sede = sedesItems.find((s) => Number(s.id) === Number(sedeIdNum));

          return {
            ...b,
            tipoBloqueId: Number(tipoId) || "",
            tipoBloqueNombre: tipo?.name ?? "",
            sedeId: Number(sedeIdNum) || "",
            sedeNombre: sede?.name ?? "",
          };
        });

        const final = sedeId
          ? normalizadas.filter((b) => Number(b.sedeId) === Number(sedeId))
          : normalizadas;

        setBloques(final);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar bloques." })
      );
  };

  // cargar bloques al montar, cuando cambie sede en filtros o lleguen items
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.sedeId]); // al aplicar filtro de sede
  useEffect(() => {
    if (tiposBloqueItems.length || sedesItems.length) reloadData();
  }, [tiposBloqueItems, sedesItems]);

  // -------------------- Acciones --------------------
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar el bloque "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/bloque/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Bloque eliminado correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar bloque." });
    }
  };

  // Handlers modal
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "", sedeId: "" });

  const handleFiltersApply = () => {
    setOpenFilters(false);
    reloadData();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">Gestión de Bloque</Typography>

        {/* Botón que abre el modal de filtros */}
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId || filters.sedeId) && (
            <Button onClick={handleFiltersClear}>
              Limpiar filtros
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Botones acción CRUD (separados) */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Tooltip title="Crear">
          <Button
            variant="contained"
            onClick={() => { setFormMode("create"); setSelectedRow(null); setFormOpen(true); }}
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </Tooltip>

        <Tooltip title="Editar">
          <Button
            variant="outlined"
            onClick={() => { setFormMode("edit"); setFormOpen(true); }}
            disabled={!selectedRow}
            startIcon={<EditIcon />}
          >
            Actualizar
          </Button>
        </Tooltip>

        <Tooltip title="Eliminar">
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={!selectedRow}
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </Tooltip>
      </Box>

      <GridBloque bloques={bloques} setSelectedRow={setSelectedRow} />

      <FormBloque
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        sedeId={filters.sedeId || ""}   // si hay filtro se precarga; si no, el form muestra select de sede
        tiposBloque={tiposBloqueForm}   // items → [{id,nombre}]
        sedes={sedesForm}               // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* MODAL genérico de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Bloque"
        fields={fieldsBloque}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
