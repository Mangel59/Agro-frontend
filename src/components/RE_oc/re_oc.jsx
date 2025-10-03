import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFOrdenCompra from "../OrdenCompra/vistapreviapdfordencompra";
import GridArticuloOrdenCompra from "../OrdenCompra/GridArticuloOrdenCompra";

import useUbicacionFilters from "../useUbicacionFilters";
import UbicacionProductoVencimientoFilters from "../UbicacionProductoVencimientoFilters.jsx";

export default function RE_ordenCompra() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // ===== Utils
  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? x?.data ?? []);
  const getFechaOC = (o) => o?.orcFechaHora ?? o?.fechaHora ?? o?.fecha ?? o?.createdAt ?? null;
  const toDateTimeStr = (val) => {
    if (!val) return null;             // "YYYY-MM-DDTHH:mm"
    const [d, t = "00:00"] = String(val).split("T");
    return `${d} ${t}:00`;
  };

  // ===== Hook unificado: ubicación + (pedido_id, categoria_estado_id, fecha_inicio, fecha_fin)
  const {
    form: ubi,
    handleChange: handleUbiChange,
    data: ubiData,
    resetTodo,

    pedido,
    handlePedidoChange,
    pedidos,
    categoriasEstado,
  } = useUbicacionFilters({ empresaId, headers, autoselectSingle: true });

  // ===== Estado para el diálogo (producto/categoría/fechas)
  const [formReporte, setFormReporte] = useState({
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: ""
  });

  // Catálogos para el diálogo (items endpoints)
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("/v1/items/producto/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/producto_categoria/0", headers).catch(() => ({ data: [] })),
    ]).then(([pr, cat]) => {
      const productosArr = Array.isArray(pr.data) ? pr.data : pr.data?.content ?? [];
      const categoriasArr = Array.isArray(cat.data) ? cat.data : cat.data?.content ?? [];

      setProductos(productosArr.map(p => ({
        id: p.id,
        name: p.nombre ?? p.name ?? `Producto ${p.id}`,
      })));
      setCategorias(categoriasArr.map(c => ({
        id: c.id,
        name: c.nombre ?? c.name ?? `Categoría ${c.id}`,
      })));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Estado UI
  const [ordenData, setOrdenData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [errors, setErrors] = useState({ fechas_rango: false });
  const [openUbi, setOpenUbi] = useState(false);

  // Respaldos por si el hook aún no cargó combos (no interfiere si ya están)
  useEffect(() => {
    if (!pedidos?.length) axios.get("/v1/pedido", headers).catch(() => {});
    if (!categoriasEstado?.length) axios.get("/v1/items/pedido_estado/0", headers).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validación de rango (usa formReporte.fecha_*)
  const validarRango = () => {
    if (formReporte.fecha_inicio && formReporte.fecha_fin) {
      const ini = new Date(formReporte.fecha_inicio);
      const fin = new Date(formReporte.fecha_fin);
      if (ini > fin) {
        setErrors({ fechas_rango: true });
        setMessage({ open: true, severity: "warning", text: "Inicio no puede ser mayor que fin." });
        return false;
      }
    }
    return true;
  };

  // ---- Traer TODAS las órdenes paginando
// === Reemplaza la función existente por esta versión tolerante a 404 ===
const fetchAllOrdenes = async () => {
  // Rutas candidatas según convenciones que he visto en tu código base
  const CANDIDATES = [
    "/v1/orden_compra",
    "/v1/orden-compra",
    "/v1/ordenCompra",
  ];

  const size = 200;
  let all = [];

  for (const basePath of CANDIDATES) {
    try {
      // 1) prueba sin paginación (algunos endpoints devuelven lista plana)
      const r0 = await axios.get(basePath, headers);
      const list0 = Array.isArray(r0.data) ? r0.data : r0.data?.content ?? [];
      if (list0.length) return list0; // ✅ listo

      // 2) si no hay datos, intenta paginado
      let page = 0;
      for (let i = 0; i < 15; i++) {
        const r = await axios.get(basePath, { params: { page, size }, ...headers });
        const list = Array.isArray(r.data) ? r.data : r.data?.content ?? [];
        if (!list.length) break;
        all = all.concat(list);
        page += 1;
      }
      if (all.length) return all; // ✅ listo
    } catch (err) {
      // 404 u otro error: intenta con la siguiente ruta
      if (import.meta.env.DEV) {
        // log útil en dev, sin romper flujo
        console.debug(`[fetchAllOrdenes] fallo en ${basePath}:`, err?.response?.status, err?.message);
      }
      continue;
    }
  }

  // Si ninguna ruta funcionó, lanza un error controlado
  const e = new Error("No se encontró un endpoint válido para listar órdenes de compra.");
  e.code = "NO_OC_ENDPOINT";
  throw e;
};


  // ---- Buscar: lista todas o muestra detalle cuando hay pedido_id
const buscar = async () => {
  setOrdenData(null);
  setArticulos([]);
  setPresentaciones([]);
  setResultados([]);
  setErrors({ fechas_rango: false });
  if (!validarRango()) return;

  try {
    const all = await fetchAllOrdenes();

    const ini = formReporte.fecha_inicio ? new Date(formReporte.fecha_inicio) : null;
    const fin = formReporte.fecha_fin ? new Date(formReporte.fecha_fin) : null;

    const byDate = all.filter((oc) => {
      const f = getFechaOC(oc);
      if (!f || (!ini && !fin)) return true;
      const d = new Date(f);
      if (isNaN(d.getTime())) return true;
      if (ini && d < ini) return false;
      if (fin && d > fin) return false;
      return true;
    });

    if (!pedido.pedido_id) {
      setResultados(byDate);
      setMessage({ open: true, severity: "info", text: `Mostrando ${byDate.length} orden(es).` });
      return;
    }

    const orden = byDate.find((o) => String(o.pedidoId) === String(pedido.pedido_id));
    if (!orden) {
      setMessage({ open: true, severity: "warning", text: "No se encontró la orden para ese pedido." });
      return;
    }

    const [aRes, prRes] = await Promise.all([
      axios.get(`/v1/orden_compra/${orden.id}/articulos`, headers).catch(async () => {
        // fallback por si también cambia el path del detalle
        const alt = await axios.get(`/v1/orden-compra/${orden.id}/articulos`, headers).catch(async () => {
          return axios.get(`/v1/ordenCompra/${orden.id}/articulos`, headers);
        });
        return alt;
      }),
      axios.get("/v1/producto_presentacion", headers).catch(() => axios.get("/v1/presentacion", headers)),
    ]);

    setOrdenData(orden);
    setArticulos(Array.isArray(aRes.data) ? aRes.data : aRes.data?.content ?? []);
    setPresentaciones(Array.isArray(prRes.data) ? prRes.data : prRes.data?.content ?? []);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setMessage({ open: true, severity: "success", text: "Datos de la orden cargados." });
  } catch (err) {
    const msg = err?.code === "NO_OC_ENDPOINT"
      ? "No se encontró el endpoint de órdenes de compra (404). Revisa la ruta en axiosConfig o el nombre del recurso."
      : "No fue posible cargar las órdenes.";
    console.error(err);
    setMessage({ open: true, severity: "error", text: msg });
  }
};

  // ---- construir condicion indexada EXACTA ("0".."3")
  const buildCondicion = () => {
    const out = {};
    let idx = 0;

    // 0) empresa (obligatoria)
    out[String(idx++)] = `oc.orc_empresa_id = $EMPRESA_ID$`;

    // 1) pedido (si viene)
    if (pedido.pedido_id) {
      out[String(idx++)] = `AND oc.orc_pedido_id = ${Number(pedido.pedido_id)}`;
    }

    // 2) categoría de estado (si viene)
    if (pedido.categoria_estado_id) {
      out[String(idx++)] = `AND est.est_estado_categoria_id= ${Number(pedido.categoria_estado_id)}`;
    }

    // 3) between (si hay ambas fechas)
    const ini = toDateTimeStr(formReporte.fecha_inicio);
    const fin = toDateTimeStr(formReporte.fecha_fin);
    if (ini && fin) {
      out[String(idx++)] = `AND oc.orc_fecha_hora BETWEEN "${ini}" AND "${fin}"`;
    }

    return out;
  };

  // ---- Generar PDF (abre Dialog) — POST /v2/report/nuevo/orden_compra
  const generarReporte = async () => {
    if (!validarRango()) return;
    try {
      const condicion = buildCondicion();
      const res = await axios({
        url: "/v2/report/nuevo/orden_compra",
        method: "POST",
        data: { condicion, EMPRESA_ID: empresaId }, // EMPRESA_ID opcional si el back hace el replace
        responseType: "blob",
        ...headers,
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado." });
    } catch (err) {
      console.error(err);
      setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Orden de Compra</Typography>

      {/* 4 campos (idénticos a RE_pedido; vienen del hook) */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pedido</InputLabel>
            <Select
              name="pedido_id"
              value={pedido.pedido_id || ""}
              label="Pedido"
              onChange={handlePedidoChange("pedido_id")}
            >
              {asArray(pedidos).map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>{`Pedido ${p.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría de estado</InputLabel>
            <Select
              name="categoria_estado_id"
              value={pedido.categoria_estado_id || ""}
              label="Categoría de estado"
              onChange={handlePedidoChange("categoria_estado_id")}
            >
              {asArray(categoriasEstado).length ? (
                asArray(categoriasEstado).map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>{c.nombre ?? `Categoría ${c.id}`}</MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">Sin opciones</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Fechas que usa el diálogo (formReporte) para PDF y búsqueda */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={formReporte.fecha_inicio || ""}
            onChange={(e) => setFormReporte(fr => ({ ...fr, fecha_inicio: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            error={errors.fechas_rango}
            helperText={errors.fechas_rango ? "Inicio no puede ser mayor que fin." : ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="datetime-local"
            fullWidth
            value={formReporte.fecha_fin || ""}
            onChange={(e) => setFormReporte(fr => ({ ...fr, fecha_fin: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            error={errors.fechas_rango}
            helperText={errors.fechas_rango ? "Fin debe ser >= Inicio." : ""}
          />
        </Grid>
      </Grid>

      {/* Acciones */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={buscar}>Buscar</Button>
        <Button variant="outlined" onClick={generarReporte}>Generar Reporte</Button>
        <Button variant="text" onClick={() => setOpenUbi(true)}>Filtros (producto + ubicación)</Button>
      </Stack>

      {/* Diálogo de filtros (como pediste) */}
      <UbicacionProductoVencimientoFilters
        variant="dialog"
        title="Filtros (producto + ubicación)"
        open={openUbi}
        onClose={() => setOpenUbi(false)}
        onApply={() => { setOpenUbi(false); buscar(); }}

        // Reporte (el diálogo usa estos 4 campos)
        formReporte={formReporte}
        setFormReporte={setFormReporte}
        productos={productos}
        categorias={categorias}
        fechasError={errors.fechas_rango}
        tried={false}

        // Ubicación (hook)
        ubiForm={ubi}
        ubiData={ubiData}
        handleUbiChange={handleUbiChange}
        onUbiReset={resetTodo}
      />

      {/* Vista previa PDF */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          Vista previa del Reporte
          <IconButton onClick={() => setPreviewOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewUrl && (
            <iframe src={previewUrl} width="100%" height="600" title="PDF" style={{ border: "none" }} />
          )}
        </DialogContent>
      </Dialog>

      {/* Resultados UI (como en pedido) */}
      {ordenData && (
        <>
          <VistaPreviaPDFOrdenCompra orden={ordenData} />
          <Box mt={4}>
            <Typography variant="h6">Artículos de la Orden</Typography>
            <GridArticuloOrdenCompra
              items={articulos}
              presentaciones={presentaciones}
              setSelectedRows={() => {}}
              setSelectedRow={() => {}}
            />
          </Box>
        </>
      )}

      {!ordenData && resultados.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Órdenes de compra encontradas</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
             
<TableHead>
  <TableRow>
    <TableCell>ID</TableCell>
    <TableCell>Fecha/Hora</TableCell>
  </TableRow>
</TableHead>

              <TableBody>
                {resultados.map((oc) => (
                  <TableRow key={oc.id}>
                    <TableCell>{oc.id}</TableCell>
                    <TableCell>{getFechaOC(oc) ? new Date(getFechaOC(oc)).toLocaleString() : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
