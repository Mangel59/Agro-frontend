import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormSede from "./FormSede";
import GridSede from "./GridSede";
import {
  Box, Typography, Button, Tooltip, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// importa el modal y los loaders genéricos
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders } from "../common/filtersLoaders";

export default function Sede() {
  // -------------------- Estado de filtros (vía modal) --------------------
  // Para este CRUD solo necesitamos País → Depto → Municipio
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // -------------------- Catálogos “items” (única fuente de nombres) --------------------
  const [municipiosItems, setMunicipiosItems] = useState([]); // [{id,name}]
  const [gruposItems, setGruposItems] = useState([]);         // [{id,name}]
  const [tiposSedeItems, setTiposSedeItems] = useState([]);   // [{id,name}]
  const gruposForm   = gruposItems.map(g => ({ id: g.id, nombre: g.name }));
  const tiposSedeForm= tiposSedeItems.map(t => ({ id: t.id, nombre: t.name }));

  // -------------------- Datos --------------------
  const [sedes, setSedes] = useState([]);

  // -------------------- UI CRUD --------------------
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });

  // -------------------- Auth / helpers --------------------
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const unwrapPage = (data) => (Array.isArray(data) ? data : data?.content ?? []);

  // Instancia de loaders del modal (usa endpoints /v1 para filtros)
  const { getPaises, getDepartamentos, getMunicipios } = makeLoaders(headers);

  // Config de campos del modal SOLO para Sede
  const fieldsSede = [
    {
      name: "paisId",
      label: "País",
      getOptions: getPaises,
      clearChildren: ["deptoId", "municipioId"],
    },
    {
      name: "deptoId",
      label: "Departamento",
      getOptions: getDepartamentos,
      dependsOn: ["paisId"],
      disabled: (v) => !v.paisId,
      clearChildren: ["municipioId"],
    },
    {
      name: "municipioId",
      label: "Municipio",
      getOptions: getMunicipios,
      dependsOn: ["deptoId"],
      disabled: (v) => !v.deptoId,
    },
  ];

  // -------------------- Cargar catálogos “items” --------------------
  useEffect(() => {
    axios.get("/v1/items/municipio/0")
      .then(res => setMunicipiosItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMunicipiosItems([]));

    axios.get("/v1/items/grupo/0")
      .then(res => setGruposItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setGruposItems([]));

    axios.get("/v1/items/tipo_sede/0")
      .then(res => setTiposSedeItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTiposSedeItems([]));
  }, []);

  // -------------------- Sedes (CRUD) --------------------
  const reloadData = () => {
    const { municipioId } = filters;

    const req = municipioId
      ? axios.get("/v1/sede", { ...headers, params: { municipioId: Number(municipioId), page: 0, size: 2000 } })
      : axios.get("/v1/sede", { ...headers, params: { page: 0, size: 2000 } });

    req.then((res) => {
      const lista = unwrapPage(res.data);

      // Mapea IDs → nombres usando ÚNICAMENTE los catálogos “items”
      const normalizadas = lista.map((s) => {
        const muniId = s.municipioId ?? s.municipio?.id ?? "";
        const grpId  = s.grupoId ?? s.grupo?.id ?? s.grupo_id ?? "";
        const tipId  = s.tipoSedeId ?? s.tipoSede?.id ?? s.tipo_sede_id ?? "";

        const muni = municipiosItems.find((m) => Number(m.id) === Number(muniId));
        const grp  = gruposItems.find((g) => Number(g.id) === Number(grpId));
        const tip  = tiposSedeItems.find((t) => Number(t.id) === Number(tipId));

        return {
          ...s,
          municipioId: muniId,
          grupoId: grpId,
          tipoSedeId: tipId,
          municipioNombre: muni?.name ?? "",
          grupoNombre: grp?.name ?? "",
          tipoSedeNombre: tip?.name ?? "",
        };
      });

      const final = municipioId
        ? normalizadas.filter((s) => Number(s.municipioId) === Number(municipioId))
        : normalizadas;

      setSedes(final);
    }).catch(() =>
      setMessage({ open: true, severity: "error", text: "Error al cargar sedes." })
    );
  };

  // cargar sedes al montar y cuando cambie filtro o lleguen catálogos items
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.municipioId]); // aplica al cambiar filtro
  useEffect(() => {
    if (municipiosItems.length || gruposItems.length || tiposSedeItems.length) reloadData();
  }, [municipiosItems, gruposItems, tiposSedeItems]);

  // -------------------- Acciones --------------------
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar la sede "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/sede/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Sede eliminada correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar sede." });
    }
  };

  // Handlers modal
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "" });

  const handleFiltersApply = () => {
    setOpenFilters(false);
    reloadData();
  };

  // -------------------- UI --------------------
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">Gestión de Sede</Typography>

        {/* Botón que abre el modal de filtros */}
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId) && (
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

      <GridSede sedes={sedes} setSelectedRow={setSelectedRow} />

      <FormSede
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        municipioId={filters.municipioId || ""}  // el modal fija el municipio si está filtrado
        grupos={gruposForm}
        tiposSede={tiposSedeForm}
        authHeaders={headers}
      />

      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* MODAL genérico de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Sede"
        fields={fieldsSede}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
