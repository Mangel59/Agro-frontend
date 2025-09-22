import React, { useEffect, useState } from "react";
import axios from "../axiosConfig.js";
import MessageSnackBar from "../MessageSnackBar.jsx";
import FormSubseccion from "./FormSubseccion.jsx";
import GridSubseccion from "./GridSubseccion.jsx";
import {
  Box, Typography, Button, Tooltip, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Subseccion() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Subsección: País → Depto → Municipio → Sede → Bloque → Espacio → Sección
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: "", seccionId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [seccionesItems, setSeccionesItems] = useState([]); // [{id, name}]

  // Datos principales
  const [subsecciones, setSubsecciones] = useState([]);

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
  const { getPaises, getDepartamentos, getMunicipios, getSedes, getBloques, getEspacios, getSecciones } = makeLoaders(headers);

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const seccionesForm = seccionesItems.map(s => ({ id: s.id, nombre: s.name }));

  // Campos del modal para Subsección
  const fieldsSubseccion = [
    { name: "paisId", label: "País", getOptions: getPaises, clearChildren: ["deptoId", "municipioId", "sedeId", "bloqueId", "espacioId", "seccionId"] },
    { name: "deptoId", label: "Departamento", getOptions: getDepartamentos, dependsOn: ["paisId"], disabled: (v) => !v.paisId, clearChildren: ["municipioId", "sedeId", "bloqueId", "espacioId", "seccionId"] },
    { name: "municipioId", label: "Municipio", getOptions: getMunicipios, dependsOn: ["deptoId"], disabled: (v) => !v.deptoId, clearChildren: ["sedeId", "bloqueId", "espacioId", "seccionId"] },
    { name: "sedeId", label: "Sede", getOptions: getSedes, dependsOn: ["municipioId"], disabled: (v) => !v.municipioId, clearChildren: ["bloqueId", "espacioId", "seccionId"] },
    { name: "bloqueId", label: "Bloque", getOptions: getBloques, dependsOn: ["sedeId"], disabled: (v) => !v.sedeId, clearChildren: ["espacioId", "seccionId"] },
    { name: "espacioId", label: "Espacio", getOptions: getEspacios, dependsOn: ["bloqueId"], disabled: (v) => !v.bloqueId, clearChildren: ["seccionId"] },
    { name: "seccionId", label: "Sección", getOptions: getSecciones, dependsOn: ["espacioId"], disabled: (v) => !v.espacioId },
  ];

  // ===========================
  // EFECTOS - CARGA DE DATOS
  // ===========================
  
  // Cargar catálogos (items)
  useEffect(() => {
    // Secciones: intentar /v1/items/seccion/0 y si falla, caer a /v1/seccion
    (async () => {
      try {
        const r = await axios.get("/v1/items/seccion/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setSeccionesItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/seccion", {
            ...headers,
            params: { page: 0, size: 2000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((s) => ({
            id: s.id,
            name: s.nombre, // <-- importante
          }));
          setSeccionesItems(list);
        } catch {
          setSeccionesItems([]);
        }
      }
    })();
  }, []);

  // Efectos para recargar subsecciones
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.seccionId]); // al aplicar filtro de sección
  useEffect(() => {
    if (seccionesItems.length) reloadData();
  }, [seccionesItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar subsecciones (CRUD)
  const reloadData = () => {
    const { seccionId } = filters;

    const req = seccionId
      ? axios.get("/v1/subseccion", { ...headers, params: { seccionId: Number(seccionId), page: 0, size: 2000 } })
      : axios.get("/v1/subseccion", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos "items"
        const normalizadas = lista.map((s) => {
          const seccionIdNum = s.seccionId ?? s.seccion?.id ?? s.seccion_id ?? "";

          const seccion = seccionesItems.find((sec) => Number(sec.id) === Number(seccionIdNum));

          return {
            ...s,
            seccionId: Number(seccionIdNum) || "",
            seccionNombre: seccion?.name ?? "",
          };
        });

        const final = seccionId
          ? normalizadas.filter((s) => Number(s.seccionId) === Number(seccionId))
          : normalizadas;

        setSubsecciones(final);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar subsecciones." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================

  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar la subsección "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/subseccion/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Subsección eliminada correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar subsección." });
    }
  };

  // Handlers del modal de filtros
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: "", seccionId: "" });

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
        <Typography variant="h5">Gestión de Subsecciones</Typography>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId || filters.sedeId || filters.bloqueId || filters.espacioId || filters.seccionId) && (
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

      {/* Grid de subsecciones */}
      <GridSubseccion subsecciones={subsecciones} setSelectedRow={setSelectedRow} />

      {/* Formulario modal */}
      <FormSubseccion
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        seccionId={filters.seccionId || ""}   // si hay filtro se precarga; si no, el form muestra select de sección
        secciones={seccionesForm}             // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Subsección"
        fields={fieldsSubseccion}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
