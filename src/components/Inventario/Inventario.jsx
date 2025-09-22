import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormInventario from "./FormInventario";
import GridInventario from "./GridInventario";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

export default function Inventario() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Inventario: País → Depto → Municipio → Sede → Bloque → Espacio → Sección → Subsección
  const [filters, setFilters] = useState({
    paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: "", seccionId: "", subseccionId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [tiposInventarioItems, setTiposInventarioItems] = useState([]); // [{id, name}]
  const [subseccionesItems, setSubseccionesItems] = useState([]);       // [{id, name}]

  // Datos principales
  const [inventarios, setInventarios] = useState([]);

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
  const empresaId = localStorage.getItem("empresaId");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Loaders del modal (usan /v1)
  const { getPaises, getDepartamentos, getMunicipios, getSedes, getBloques, getEspacios, getSecciones, getSubsecciones } = makeLoaders(headers, { empresaId });

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const tiposInventarioForm = tiposInventarioItems.map(t => ({ id: t.id, nombre: t.name }));
  const subseccionesForm = subseccionesItems.map(s => ({ id: s.id, nombre: s.name }));

  // Campos del modal para Inventario
  const fieldsInventario = [
    { name: "paisId", label: "País", getOptions: getPaises, clearChildren: ["deptoId", "municipioId", "sedeId", "bloqueId", "espacioId", "seccionId", "subseccionId"] },
    { name: "deptoId", label: "Departamento", getOptions: getDepartamentos, dependsOn: ["paisId"], disabled: (v) => !v.paisId, clearChildren: ["municipioId", "sedeId", "bloqueId", "espacioId", "seccionId", "subseccionId"] },
    { name: "municipioId", label: "Municipio", getOptions: getMunicipios, dependsOn: ["deptoId"], disabled: (v) => !v.deptoId, clearChildren: ["sedeId", "bloqueId", "espacioId", "seccionId", "subseccionId"] },
    { name: "sedeId", label: "Sede", getOptions: getSedes, dependsOn: ["municipioId"], disabled: (v) => !v.municipioId, clearChildren: ["bloqueId", "espacioId", "seccionId", "subseccionId"] },
    { name: "bloqueId", label: "Bloque", getOptions: getBloques, dependsOn: ["sedeId"], disabled: (v) => !v.sedeId, clearChildren: ["espacioId", "seccionId", "subseccionId"] },
    { name: "espacioId", label: "Espacio", getOptions: getEspacios, dependsOn: ["bloqueId"], disabled: (v) => !v.bloqueId, clearChildren: ["seccionId", "subseccionId"] },
    { name: "seccionId", label: "Sección", getOptions: getSecciones, dependsOn: ["espacioId"], disabled: (v) => !v.espacioId, clearChildren: ["subseccionId"] },
    { name: "subseccionId", label: "Subsección", getOptions: getSubsecciones, dependsOn: ["seccionId"], disabled: (v) => !v.seccionId },
  ];

  // ===========================
  // EFECTOS - CARGA DE DATOS
  // ===========================
  
  // Cargar catálogos (items)
  useEffect(() => {
    // Tipos de inventario: intentar /v1/items/tipo_inventario/0 y si falla, caer a /v1/tipo_inventario
    (async () => {
      try {
        const r = await axios.get("/v1/items/tipo_inventario/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setTiposInventarioItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/tipo_inventario", {
            ...headers,
            params: { page: 0, size: 1000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((t) => ({
            id: t.id,
            name: t.nombre, // <-- importante
          }));
          setTiposInventarioItems(list);
        } catch {
          setTiposInventarioItems([]);
        }
      }
    })();

    // Subsecciones: intentar /v1/items/subseccion/0 y si falla, caer a /v1/subseccion
    (async () => {
      try {
        const r = await axios.get("/v1/items/subseccion/0", headers);
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setSubseccionesItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/subseccion", {
            ...headers,
            params: { page: 0, size: 2000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((s) => ({
            id: s.id,
            name: s.nombre, // <-- importante
          }));
          setSubseccionesItems(list);
        } catch {
          setSubseccionesItems([]);
        }
      }
    })();
  }, []);

  // Efectos para recargar inventarios
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.subseccionId]); // al aplicar filtro de subsección
  useEffect(() => {
    if (tiposInventarioItems.length || subseccionesItems.length) reloadData();
  }, [tiposInventarioItems, subseccionesItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar inventarios (CRUD)
  const reloadData = () => {
    const { subseccionId } = filters;

    const req = subseccionId
      ? axios.get("/v1/inventario", { ...headers, params: { subseccionId: Number(subseccionId), page: 0, size: 2000 } })
      : axios.get("/v1/inventario", { ...headers, params: { page: 0, size: 2000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos "items"
        const normalizadas = lista.map((i) => {
          const tipoId = i.tipoInventarioId ?? i.tipo_inventario_id ?? i.tipoInventario?.id ?? "";
          const subseccionIdNum = i.subseccionId ?? i.subseccion?.id ?? i.subseccion_id ?? "";

          const tipo = tiposInventarioItems.find((t) => Number(t.id) === Number(tipoId));
          const subseccion = subseccionesItems.find((s) => Number(s.id) === Number(subseccionIdNum));

          return {
            ...i,
            tipoInventarioId: Number(tipoId) || "",
            tipoInventarioNombre: tipo?.name ?? "",
            subseccionId: Number(subseccionIdNum) || "",
            subseccionNombre: subseccion?.name ?? "",
          };
        });

        const final = subseccionId
          ? normalizadas.filter((i) => Number(i.subseccionId) === Number(subseccionId))
          : normalizadas;

        setInventarios(final);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar inventarios." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  
  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar el inventario "${selectedRow.nombre}"?`)) return;
    try {
      await axios.delete(`/v1/inventario/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Inventario eliminado correctamente." });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar inventario." });
    }
  };

  // Handlers del modal de filtros
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "", deptoId: "", municipioId: "", sedeId: "", bloqueId: "", espacioId: "", seccionId: "", subseccionId: "" });

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
        <Typography variant="h5">Gestión de Inventarios</Typography>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId || filters.deptoId || filters.municipioId || filters.sedeId || filters.bloqueId || filters.espacioId || filters.seccionId || filters.subseccionId) && (
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

      {/* Grid de inventarios */}
      <GridInventario inventarios={inventarios} setSelectedRow={setSelectedRow} />

      {/* Formulario modal */}
      <FormInventario
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        subseccionId={filters.subseccionId || ""}   // si hay filtro se precarga; si no, el form muestra select de subsección
        tiposInventario={tiposInventarioForm}       // items → [{id,nombre}] para el select en el form
        subsecciones={subseccionesForm}             // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Inventario"
        fields={fieldsInventario}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
