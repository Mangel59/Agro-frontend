import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormProduccion from "./FormProduccion";
import GridProduccion from "./GridProduccion";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/* ===== Helpers robustos (como en Producto) ===== */
const toList = (payload) => {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content; // Spring Page<>
  if (Array.isArray(payload?.data)) return payload.data;       // { data: [...] }
  if (typeof payload === "string") {
    try { return toList(JSON.parse(payload)); } catch { return []; }
  }
  return [];
};

const toMap = (payload, key = "id", label = "name") => {
  const arr = toList(payload);
  return Object.fromEntries(arr.map((e) => [e?.[key], e?.[label]]));
};

export default function Produccion() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [producciones, setProducciones] = useState([]);

  // --- paginación (0-based como MUI DataGrid) ---
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const reloadData = useCallback(
    async (pageArg = page, sizeArg = size) => {
      try {
        setLoading(true);

        // Sanitiza argumentos
        const pageQ = Math.max(0, Number.isFinite(+pageArg) ? +pageArg : 0);
        const sizeQ = Math.max(1, Number.isFinite(+sizeArg) ? +sizeArg : 10);

        const [
          resProduccion,
          resTipos,
          resEspacios,
          resSubSecciones,
          // Si tienes endpoint de estados, agrégalo aquí:
          // resEstados
        ] = await Promise.all([
          axios.get("/v1/produccion", { params: { page: pageQ, size: sizeQ } }),
          axios.get("/v1/items/tipo_produccion/0"),
          axios.get("/v1/items/espacio/0"),
          axios.get("/v1/items/sub_seccion/0"),
        ]);

        const pagePayload = resProduccion?.data ?? {};
        const lista = toList(pagePayload);

        // catálogos → map<ID, NAME>
        const mapTipos       = toMap(resTipos?.data,       "id", "name") || {};
        const mapEspacios    = toMap(resEspacios?.data,    "id", "name") || {};
        const mapSubSeccion  = toMap(resSubSecciones?.data,"id", "name") || {};

        // Si no tienes endpoint de estados, usa un mapa local (ajústalo si cambia):
        const mapEstados = { 1: "Activo", 2: "Inactivo" };

        // Enriquecer filas con nombres derivados
        const filas = lista.map((p) => {
          // Si tu backend ya retorna objetos anidados (tipoProduccion, espacio, etc.), respeta eso primero.
          const tipoId       = p?.tipoProduccion?.id ?? p?.tipoProduccionId ?? null;
          const espacioId    = p?.espacio?.id ?? p?.espacioId ?? null;
          const subSeccionId = p?.subSeccion?.id ?? p?.subSeccionId ?? null;
          const estadoId     = p?.estado?.id ?? p?.estadoId ?? null;

          return {
            ...p,
            // Normaliza los IDs (útiles para editar)
            tipoProduccionId: tipoId,
            espacioId: espacioId,
            subSeccionId: subSeccionId,
            estadoId: estadoId,

            // Nombres para la grilla (prioriza objetos anidados si vienen)
            tipoProduccionNombre:
              p?.tipoProduccion?.nombre ?? p?.tipoProduccion?.name ?? mapTipos[tipoId] ?? "",
            espacioNombre:
              p?.espacio?.nombre ?? p?.espacio?.name ?? mapEspacios[espacioId] ?? "",
            subSeccionNombre:
              p?.subSeccion?.nombre ?? p?.subSeccion?.name ?? mapSubSeccion[subSeccionId] ?? "",
            estadoNombre:
              p?.estado?.nombre ?? p?.estado?.name ?? mapEstados[estadoId] ?? "",
          };
        });

        setProducciones(filas);

        // metadatos de Page<> (fallbacks)
        const pageServer  = Number.isFinite(pagePayload?.number) ? pagePayload.number : pageQ;
        const sizeServer  = Number.isFinite(pagePayload?.size) ? pagePayload.size : sizeQ;
        const totalElems  = Number.isFinite(pagePayload?.totalElements) ? pagePayload.totalElements : filas.length;
        const totalPgs    = Number.isFinite(pagePayload?.totalPages)
          ? pagePayload.totalPages
          : Math.ceil(totalElems / sizeServer);

        setPage(pageServer);
        setSize(sizeServer);
        setTotalElements(totalElems);
        setTotalPages(totalPgs);
      } catch (err) {
        const status = err?.response?.status;
        const body   = err?.response?.data;
        try {
          console.error("Error /v1/produccion", status, JSON.stringify(body));
        } catch {
          console.error("Error /v1/produccion", status, body);
        }
        setMessage({
          open: true,
          severity: "error",
          text: `Error al cargar producciones${status ? ` (HTTP ${status})` : ""}`,
        });
        setProducciones([]);
      } finally {
        setLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    reloadData(0, size); // carga inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // Handlers de paginación (server-side)
  const handleChangePage = (_evt, nextPage) => {
    setPage(nextPage);
    reloadData(nextPage, size);
  };

  const handleChangeRowsPerPage = (evt) => {
    const nextSize = parseInt(evt?.target?.value ?? evt, 10) || 10;
    setSize(nextSize);
    setPage(0);
    reloadData(0, nextSize);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await axios.delete(`/v1/produccion/${selectedRow.id}`);
      setMessage({ open: true, severity: "success", text: "Producción eliminada correctamente" });
      reloadData(page, size);
      setSelectedRow(null);
    } catch (err) {
      console.error("Error al eliminar producción:", err);
      setMessage({ open: true, severity: "error", text: "Error al eliminar producción" });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Producción</Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedRow(null);
            setMessage({ open: false, severity: "success", text: "" });
            // abrir el form en modo create
            window.setTimeout(() => {
              const ev = new Event("open-form-produccion-create");
              window.dispatchEvent(ev);
            }, 0);
          }}
        >
          Crear
        </Button>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          disabled={!selectedRow}
          onClick={() => {
            const ev = new CustomEvent("open-form-produccion-edit", { detail: selectedRow });
            window.dispatchEvent(ev);
          }}
        >
          Editar
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={!selectedRow}
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </Box>

      <GridProduccion
        loading={loading}
        producciones={producciones}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        // Paginación (server-side)
        page={page}
        rowsPerPage={size}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Form: escucha eventos para abrir en create/edit y reutiliza tu FormProduccion */}
      <FormProduccion
        open={false}               // controlado por eventos para simplificar (evita prop-drilling)
        setOpen={() => {}}
        selectedRow={selectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(page, size)}
        formMode="create"
      />

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
