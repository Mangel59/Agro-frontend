import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormAlmacen from "./FormAlmacen";
import GridAlmacen from "./GridAlmacen";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Almacen() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Almacén: País → Depto → Municipio → Sede → Bloque → Espacio
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [espaciosItems, setEspaciosItems] = useState([]); // [{id, name}] - para normalización

  // Datos principales
  const [almacenes, setAlmacenes] = useState([]);

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
  const empresaId = localStorage.getItem("empresaId"); // opcional si filtras sedes por empresa
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Loaders del modal (usan /v1) con empresaId
  const { getPaises, getDepartamentos, getMunicipios, getSedes, getBloques, getEspacios } = makeLoaders(headers, { empresaId });

  // Campos del modal para Almacén (cadena completa)
  const fieldsAlmacen = [
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
    // Cargar espacios para normalización de nombres
    axios
      .get("/v1/espacio", { ...headers, params: { page: 0, size: 2000 } })
      .then((res) => {
        const lista = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
        const espaciosNormalizados = lista.map(e => ({ id: e.id, name: e.nombre }));
        setEspaciosItems(espaciosNormalizados);
      })
      .catch(() => setEspaciosItems([]));
  }, []);

  // Efectos para recargar almacenes
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.espacioId]); // al aplicar filtro de espacio
  useEffect(() => {
    if (espaciosItems.length) reloadData();
  }, [espaciosItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar almacenes (CRUD)
  const reloadData = () => {
    const { espacioId } = filters;

    const req = espacioId
      ? axios.get("/v1/almacen", { ...headers, params: { espacioId: Number(espacioId), page: 0, size: 2000 } })
      : axios.get("/v1/almacen", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando catálogos "items" y respuesta directa del API
        const normalizadas = lista.map((a) => {
          // Para espacio, usar el catálogo cargado o el objeto anidado
          const espacioId = a.espacioId ?? a.espacio?.id ?? "";
          const espacio = espaciosItems.find(e => Number(e.id) === Number(espacioId));
          const espacioNombre = a.espacio?.nombre || espacio?.name || "";

          return {
            ...a,
            espacioNombre,
          };
        });

        const final = espacioId
          ? normalizadas.filter((a) => Number(a.espacioId) === Number(espacioId))
          : normalizadas;

        setAlmacenes(final);
        setSelectedRow(null);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar almacenes." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  
  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar el almacén "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/almacen/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Almacén eliminado correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar almacén." });
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
        <Typography variant="h5">Gestión de Almacenes</Typography>

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

      {/* Grid de almacenes */}
      <GridAlmacen almacenes={almacenes} setSelectedRow={setSelectedRow} />

      {/* Formulario modal */}
      <FormAlmacen
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        espacioId={filters.espacioId || ""}     // si hay filtro se precarga; si no, el form muestra select de espacio
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Almacén"
        fields={fieldsAlmacen}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
