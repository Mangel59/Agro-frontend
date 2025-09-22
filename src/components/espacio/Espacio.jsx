import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormEspacio from "./FormEspacio";
import GridEspacio from "./GridEspacio";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Espacio() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Espacio: País → Depto → Municipio → Sede → Bloque
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [tiposEspacioItems, setTiposEspacioItems] = useState([]); // [{id, name}]
  const [bloquesItems, setBloquesItems] = useState([]);           // [{id, name}]

  // Datos principales
  const [espacios, setEspacios] = useState([]);

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
  const { getPaises, getDepartamentos, getMunicipios, getSedes, getBloques } = makeLoaders(headers);

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const tiposEspacioForm = tiposEspacioItems.map(t => ({ id: t.id, nombre: t.name }));
  const bloquesForm = bloquesItems.map(b => ({ id: b.id, nombre: b.name }));

  // Campos del modal para Espacio
  const fieldsEspacio = [
    { name: "paisId", label: "País", getOptions: getPaises, clearChildren: ["deptoId", "municipioId", "sedeId", "bloqueId"] },
    { name: "deptoId", label: "Departamento", getOptions: getDepartamentos, dependsOn: ["paisId"], disabled: (v) => !v.paisId, clearChildren: ["municipioId", "sedeId", "bloqueId"] },
    { name: "municipioId", label: "Municipio", getOptions: getMunicipios, dependsOn: ["deptoId"], disabled: (v) => !v.deptoId, clearChildren: ["sedeId", "bloqueId"] },
    { name: "sedeId", label: "Sede", getOptions: getSedes, dependsOn: ["municipioId"], disabled: (v) => !v.municipioId, clearChildren: ["bloqueId"] },
    { name: "bloqueId", label: "Bloque", getOptions: getBloques, dependsOn: ["sedeId"], disabled: (v) => !v.sedeId },
  ];

  // ===========================
  // EFECTOS - CARGA DE DATOS
  // ===========================
  
  // Cargar catálogos (items)
  useEffect(() => {
    // Tipos de espacio: intentar /v1/items/tipo_espacio/0 y si falla, caer a /v1/tipo_espacio
    (async () => {
      try {
        const r = await axios.get("/v1/items/tipo_espacio/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setTiposEspacioItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/tipo_espacio", {
            ...headers,
            params: { page: 0, size: 1000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((t) => ({
            id: t.id,
            name: t.nombre, // <-- importante
          }));
          setTiposEspacioItems(list);
        } catch {
          setTiposEspacioItems([]);
        }
      }
    })();

    // Bloques: intentar /v1/items/bloque/0 y si falla, caer a /v1/bloque
    (async () => {
      try {
        const r = await axios.get("/v1/items/bloque/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setBloquesItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/bloque", {
            ...headers,
            params: { page: 0, size: 2000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((b) => ({
            id: b.id,
            name: b.nombre, // <-- importante
          }));
          setBloquesItems(list);
        } catch {
          setBloquesItems([]);
        }
      }
    })();
  }, []);

  // Efectos para recargar espacios
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.bloqueId]); // al aplicar filtro de bloque
  useEffect(() => {
    if (tiposEspacioItems.length || bloquesItems.length) reloadData();
  }, [tiposEspacioItems, bloquesItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar espacios (CRUD)
  const reloadData = () => {
    const { bloqueId } = filters;

    const req = bloqueId
      ? axios.get("/v1/espacio", { ...headers, params: { bloqueId: Number(bloqueId), page: 0, size: 2000 } })
      : axios.get("/v1/espacio", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos "items"
        const normalizadas = lista.map((e) => {
          const tipoId = e.tipoEspacioId ?? e.tipo_espacio_id ?? e.tipoEspacio?.id ?? "";
          const bloqueIdNum = e.bloqueId ?? e.bloque?.id ?? e.bloque_id ?? "";

          const tipo = tiposEspacioItems.find((t) => Number(t.id) === Number(tipoId));
          const bloque = bloquesItems.find((b) => Number(b.id) === Number(bloqueIdNum));

          return {
            ...e,
            tipoEspacioId: Number(tipoId) || "",
            tipoEspacioNombre: tipo?.name ?? "",
            bloqueId: Number(bloqueIdNum) || "",
            bloqueNombre: bloque?.name ?? "",
          };
        });

        const final = bloqueId
          ? normalizadas.filter((e) => Number(e.bloqueId) === Number(bloqueId))
          : normalizadas;

        setEspacios(final);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar espacios." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  
  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar el espacio "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/espacio/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Espacio eliminado correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar espacio." });
    }
  };

  // Handlers del modal de filtros
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "" });

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
        <Typography variant="h5">Gestión de Espacios</Typography>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId || filters.sedeId || filters.bloqueId) && (
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

      {/* Grid de espacios */}
      <GridEspacio espacios={espacios} setSelectedRow={setSelectedRow} />

      {/* Formulario modal */}
      <FormEspacio
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        bloqueId={filters.bloqueId || ""}   // si hay filtro se precarga; si no, el form muestra select de bloque
        tiposEspacio={tiposEspacioForm}     // items → [{id,nombre}]
        bloques={bloquesForm}               // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Espacio"
        fields={fieldsEspacio}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
