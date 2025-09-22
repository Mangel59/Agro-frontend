import React, { useEffect, useState } from "react";
import axios from "../axiosConfig.js";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormSeccion from "./FromSeccion.jsx";
import GridSeccion from "./GridSeccion.jsx";
import {
  Box, Typography, Button, Tooltip, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Seccion() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Sección: País → Depto → Municipio → Sede → Bloque → Espacio
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [espaciosItems, setEspaciosItems] = useState([]); // [{id, name}]

  // Datos principales
  const [secciones, setSecciones] = useState([]);

  // UI CRUD
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  // ===========================
  // CONFIGURACIÓN Y HELPERS
  // ===========================
  
  // Auth / headers
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Loaders del modal (usan /v1)
  const { getPaises, getDepartamentos, getMunicipios, getSedes, getBloques, getEspacios } = makeLoaders(headers);

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const espaciosForm = espaciosItems.map(e => ({ id: e.id, nombre: e.name }));

  // Campos del modal para Sección
  const fieldsSeccion = [
    { name: "paisId", label: "País", getOptions: getPaises, clearChildren: ["deptoId", "municipioId", "sedeId", "bloqueId", "espacioId"] },
    { name: "deptoId", label: "Departamento", getOptions: getDepartamentos, dependsOn: ["paisId"], disabled: (v) => !v.paisId, clearChildren: ["municipioId", "sedeId", "bloqueId", "espacioId"] },
    { name: "municipioId", label: "Municipio", getOptions: getMunicipios, dependsOn: ["deptoId"], disabled: (v) => !v.deptoId, clearChildren: ["sedeId", "bloqueId", "espacioId"] },
    { name: "sedeId", label: "Sede", getOptions: getSedes, dependsOn: ["municipioId"], disabled: (v) => !v.municipioId, clearChildren: ["bloqueId", "espacioId"] },
    { name: "bloqueId", label: "Bloque", getOptions: getBloques, dependsOn: ["sedeId"], disabled: (v) => !v.sedeId, clearChildren: ["espacioId"] },
    { name: "espacioId", label: "Espacio", getOptions: getEspacios, dependsOn: ["bloqueId"], disabled: (v) => !v.bloqueId },
  ];

  // ===========================
  // EFECTOS - CARGA DE DATOS
  // ===========================
  
  // Cargar catálogos (items)
  useEffect(() => {
    // Espacios: intentar /v1/items/espacio/0 y si falla, caer a /v1/espacio
    (async () => {
      try {
        const r = await axios.get("/v1/items/espacio/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setEspaciosItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/espacio", {
            ...headers,
            params: { page: 0, size: 2000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((e) => ({
            id: e.id,
            name: e.nombre, // <-- importante
          }));
          setEspaciosItems(list);
        } catch {
          setEspaciosItems([]);
        }
      }
    })();
  }, []);

  // Efectos para recargar secciones
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.espacioId]); // al aplicar filtro de espacio
  useEffect(() => {
    if (espaciosItems.length) reloadData();
  }, [espaciosItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar secciones (CRUD)
  const reloadData = () => {
    const { espacioId } = filters;

    const req = espacioId
      ? axios.get("/v1/seccion", { ...headers, params: { espacioId: Number(espacioId), page: 0, size: 2000 } })
      : axios.get("/v1/seccion", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos "items"
        const normalizadas = lista.map((s) => {
          const espacioIdNum = s.espacioId ?? s.espacio?.id ?? s.espacio_id ?? "";

          const espacio = espaciosItems.find((e) => Number(e.id) === Number(espacioIdNum));

          return {
            ...s,
            espacioId: Number(espacioIdNum) || "",
            espacioNombre: espacio?.name ?? "",
          };
        });

        const final = espacioId
          ? normalizadas.filter((s) => Number(s.espacioId) === Number(espacioId))
          : normalizadas;

        setSecciones(final);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar secciones." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================

  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar la sección "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/seccion/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Sección eliminada correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar sección." });
    }
  };

  // Handlers del modal de filtros
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: "" });

  const handleFiltersApply = () => {
    setOpenFilters(false);
    reloadData();
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Box sx={{ p: 2 }}>
      {/* Header con título y filtros */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">Gestión de Secciones</Typography>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId || filters.sedeId || filters.bloqueId || filters.espacioId) && (
            <Button onClick={handleFiltersClear}>
              Limpiar filtros
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Botones de acción CRUD */}
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

      {/* Grid de secciones */}
      <GridSeccion secciones={secciones} setSelectedRow={setSelectedRow} />

      {/* Formulario modal */}
      <FormSeccion
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        espacioId={filters.espacioId || ""}   // si hay filtro se precarga; si no, el form muestra select de espacio
        espacios={espaciosForm}               // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Sección"
        fields={fieldsSeccion}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
