/**
 * @file Departamento.jsx
 * @module Departamento
 * @description Componente principal para la gestión de departamentos.
 *
 * Este componente maneja la lógica del módulo de departamentos, incluyendo la carga
 * de países, filtrado por país, y renderizado del formulario y la tabla de departamentos.
 */

import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import GridDepartamento from "./GridDepartamento";
import FormDepartamento from "./FormDepartamento";
import MessageSnackBar from "../MessageSnackBar";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Modal genérico de filtros + loaders
import CrudFilterModal from "../common/CrudFilterModal";
import { makeLoaders, unwrap as unwrapPage } from "../common/filtersLoaders";

/**
 * @typedef {Object} DepartamentoRow
 * @property {number} id - ID del departamento
 * @property {string} nombre - Nombre del departamento
 * @property {number} paisId - ID del país asociado
 * @property {string} paisNombre - Nombre del país (solo para visualización)
 * @property {number} estadoId - Estado del departamento
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad ("success", "error", etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de departamentos.
 *
 * @returns {JSX.Element} El módulo de gestión de departamentos
 */
export default function Departamento() {
  // ===========================
  // ESTADO Y CONFIGURACIÓN
  // ===========================
  
  // Filtros (vía modal) - Para Departamento: Solo País
  const [filters, setFilters] = useState({
    paisId: ""
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Catálogos "items" (única fuente de nombres)
  const [paisesItems, setPaisesItems] = useState([]); // [{id, name}]

  // Datos principales
  const [departamentos, setDepartamentos] = useState([]);

  // UI CRUD
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({
    open: false,
    severity: "success",
    text: "",
  });

  // ===========================
  // CONFIGURACIÓN Y HELPERS
  // ===========================
  
  // Auth / headers
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Loaders del modal (usan /v1)
  const { getPaises } = makeLoaders(headers);

  // Normalizaciones para los formularios (esperan [{id, nombre}])
  const paisesForm = paisesItems.map(p => ({ id: p.id, nombre: p.name }));

  // Campos del modal SOLO para Departamento
  const fieldsDepartamento = [
    { name: "paisId", label: "País", getOptions: getPaises },
  ];

  // ===========================
  // EFECTOS - CARGA DE DATOS
  // ===========================
  
  // Cargar países (items)
  useEffect(() => {
    // Países: intentar /v1/items/pais/0 y si falla, caer a /v1/pais
    (async () => {
      try {
        const r = await axios.get("/v1/items/pais/0");
        const arr = Array.isArray(r.data) ? r.data : [];
        if (arr.length) {
          setPaisesItems(arr); // [{id,name}]
          return;
        }
        throw new Error("empty");
      } catch {
        try {
          const { data } = await axios.get("/v1/pais", {
            ...headers,
            params: { page: 0, size: 1000 },
          });
          // normaliza a shape "items"
          const list = (Array.isArray(data) ? data : data?.content ?? []).map((p) => ({
            id: p.id,
            name: p.nombre, // <-- importante
          }));
          setPaisesItems(list);
        } catch {
          setPaisesItems([]);
          setMessage({
            open: true,
            severity: "error",
            text: "Error al cargar países",
          });
        }
      }
    })();
  }, []);

  // Efectos para recargar departamentos
  useEffect(() => { reloadData(); }, []); // mount
  useEffect(() => { reloadData(); }, [filters.paisId]); // al aplicar filtro de país
  useEffect(() => {
    if (paisesItems.length) reloadData();
  }, [paisesItems]);

  // ===========================
  // FUNCIONES DE DATOS
  // ===========================
  
  // Cargar departamentos (CRUD)
  const reloadData = () => {
    const { paisId } = filters;

    const req = paisId
      ? axios.get("/v1/departamento", { ...headers, params: { paisId: Number(paisId), page: 0, size: 1000 } })
      : axios.get("/v1/departamento", { ...headers, params: { page: 0, size: 1000 } });

    req
      .then((res) => {
        const lista = unwrapPage(res.data);

        // Mapear IDs → nombres usando ÚNICAMENTE los catálogos "items"
        const normalizadas = lista.map((d) => {
          const paisIdNum = d.paisId ?? d.pais?.id ?? d.pais_id ?? "";
          const pais = paisesItems.find((p) => Number(p.id) === Number(paisIdNum));

          return {
            ...d,
            paisId: Number(paisIdNum) || "",
            paisNombre: pais?.name ?? "",
            name: d.nombre, // Para compatibilidad con código existente
          };
        });

        const final = paisId
          ? normalizadas.filter((d) => Number(d.paisId) === Number(paisId))
          : normalizadas;

        setDepartamentos(final);
        setSelectedRow(null);
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "Error al cargar departamentos." })
      );
  };

  // ===========================
  // HANDLERS DE EVENTOS
  // ===========================
  
  // Acciones CRUD
  const handleDelete = async () => {
    if (!selectedRow) return;
    if (!window.confirm(`¿Eliminar el departamento "${selectedRow.name}"?`)) return;
    try {
      await axios.delete(`/v1/departamento/${selectedRow.id}`, headers);
      setMessage({
        open: true,
        severity: "success",
        text: "Departamento eliminado correctamente.",
      });
      setSelectedRow(null);
      reloadData();
    } catch {
      setMessage({
        open: true,
        severity: "error",
        text: "Error al eliminar departamento.",
      });
    }
  };

  // Handlers del modal de filtros
  const handleFiltersChange = ({ name, value }) =>
    setFilters((f) => ({ ...f, [name]: value }));

  const handleFiltersClear = () =>
    setFilters({ paisId: "" });

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
        <Typography variant="h5">Gestión de Departamento</Typography>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => setOpenFilters(true)}>
            Mostrar filtros
          </Button>
          {Boolean(filters.paisId) && (
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

      {/* Grid de departamentos */}
      <GridDepartamento
        departamentos={departamentos}
        setSelectedRow={setSelectedRow}
      />

      {/* Formulario modal */}
      <FormDepartamento
        open={formOpen}
        setOpen={setFormOpen}
        formMode={formMode}
        selectedRow={selectedRow}
        reloadData={reloadData}
        setMessage={setMessage}
        paisId={filters.paisId || ""}     // si hay filtro se precarga; si no, el form muestra select de país
        paises={paisesForm}               // items → [{id,nombre}] para el select en el form
        authHeaders={headers}
      />

      {/* Componentes auxiliares */}
      <MessageSnackBar message={message} setMessage={setMessage} />

      {/* Modal de filtros */}
      <CrudFilterModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        title="Filtros de Departamento"
        fields={fieldsDepartamento}
        values={filters}
        onChange={handleFiltersChange}
        onClear={handleFiltersClear}
        onApply={handleFiltersApply}
      />
    </Box>
  );
}
