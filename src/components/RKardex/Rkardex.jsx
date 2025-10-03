// src/components/RKardex/Rkardex.jsx
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

export default function RE_kardexPedido() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // ===== Utils
  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? x?.data ?? []);
  const getFechaKdx = (o) => o?.karFechaHora ?? o?.fechaHora ?? o?.fecha ?? o?.createdAt ?? null;
  const toLocal = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? String(val) : d.toLocaleString();
  };

  // "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm"
  const toDateStr = (val, end = false) => {
    if (!val) return null;
    const [d, t] = String(val).split("T");
    if (!d) return null;
    const hhmm = t ? t.slice(0, 5) : (end ? "23:59" : "00:00");
    return `${d} ${hhmm}`;
  };

  // ===== Filtros (todos opcionales; provienen de /v1/items)
  const [form, setForm] = useState({
    municipio_id: "",
    sede_id: "",
    bloque_id: "",
    espacio_id: "",
    almacen_id: "",
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const handleChange = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  // ===== Catálogos
  const [items, setItems] = useState({
    municipios: [], sedes: [], bloques: [], espacios: [],
    almacenes: [], productos: [], categorias: [],
  });

  useEffect(() => {
    Promise.all([
      axios.get("/v1/items/municipio/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/sede/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/bloque/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/espacio/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/almacen/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/producto/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/producto_categoria/0", headers).catch(() => ({ data: [] })),
    ])
      .then(([mun, sed, blo, esp, alm, pro, cat]) => {
        setItems({
          municipios: asArray(mun.data),
          sedes: asArray(sed.data),
          bloques: asArray(blo.data),
          espacios: asArray(esp.data),
          almacenes: asArray(alm.data),
          productos: asArray(pro.data),
          categorias: asArray(cat.data),
        });
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "No fue posible cargar los catálogos." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Estado UI
  const [resultados, setResultados] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // ===== Listado (igual que Pedido/OC): fetchAll con rutas candidatas + paginado
  const fetchAllKardex = async () => {
    const CANDIDATES = [
      "/v1/kardexpedido",
      "/v1/kardex_pedido",
      "/v1/kardex",
    ];
    const size = 200;
    for (const basePath of CANDIDATES) {
      try {
        // sin paginación
        const r0 = await axios.get(basePath, headers);
        const list0 = asArray(r0.data);
        if (list0.length) return list0;

        // con paginación
        let page = 0, acc = [];
        for (let i = 0; i < 15; i++) {
          const r = await axios.get(basePath, { params: { page, size }, ...headers });
          const list = asArray(r.data);
          if (!list.length) break;
          acc = acc.concat(list);
          page += 1;
        }
        if (acc.length) return acc;
      } catch (err) {
        if (import.meta.env.DEV) console.debug("[fetchAllKardex] fallo", basePath, err?.response?.status);
        // sigue al siguiente candidato
      }
    }
    const e = new Error("No se encontró endpoint para listar kardex.");
    e.code = "NO_KARDEX_ENDPOINT";
    throw e;
  };

  // ===== Buscar (misma UX): lista TODO si no hay filtros; aplica rango si hay fechas
  const buscar = async () => {
    setResultados([]);
    try {
      const all = await fetchAllKardex();

      // filtro por rango de fechas si el usuario lo puso (igual que haces en Pedido)
      const ini = form.fecha_inicio ? new Date(form.fecha_inicio) : null;
      const fin = form.fecha_fin ? new Date(form.fecha_fin) : null;

      const lista = all.filter((row) => {
        const f = getFechaKdx(row);
        if (!f || (!ini && !fin)) return true;
        const d = new Date(f);
        if (isNaN(d.getTime())) return true;
        if (ini && d < ini) return false;
        if (fin && d > fin) return false;
        return true;
      });

      setResultados(lista);
      setMessage({ open: true, severity: "info", text: `Mostrando ${lista.length} movimiento(s) de kardex.` });
    } catch (err) {
      const msg = err?.code === "NO_KARDEX_ENDPOINT"
        ? "No se encontró el endpoint de listado de kardex (404)."
        : "No se pudo cargar el kardex.";
      console.error(err);
      setMessage({ open: true, severity: "error", text: msg });
    }
  };

  // ===== PDF: payload indexado 0..8 EXACTO. Si no hay fechas → rango amplio (para “ver todo”)
  const buildCondicion = () => {
    const DEF_INI = "1900-01-01 00:00";
    const DEF_FIN = "2099-12-31 23:59";
    const userIni = toDateStr(form.fecha_inicio, false);
    const userFin = toDateStr(form.fecha_fin, true);

    const c = {};
    c["0"] = `e.emp_id = $EMPRESA_ID$`;
    c["1"] = form.municipio_id           ? `AND m.mun_id = ${Number(form.municipio_id)}` : "";
    c["2"] = form.sede_id                ? `AND s.sed_id = ${Number(form.sede_id)}` : "";
    c["3"] = form.bloque_id              ? `AND blo.blo_id = ${Number(form.bloque_id)}` : "";
    c["4"] = form.espacio_id             ? `AND esp.esp_id = ${Number(form.espacio_id)}` : "";
    c["5"] = form.almacen_id             ? `AND al.alm_id = ${Number(form.almacen_id)}` : "";
    c["6"] = form.producto_id            ? `AND p.pro_id = ${Number(form.producto_id)}` : "";
    c["7"] = form.producto_categoria_id  ? `AND p.pro_producto_categoria_id = ${Number(form.producto_categoria_id)}` : "";
    c["8"] = `AND k.kar_fecha_hora BETWEEN '${userIni ?? DEF_INI}' AND '${userFin ?? DEF_FIN}'`;
    return c;
  };

  const requestPDF = async (condicion) => {
    try {
      return await axios({
        url: "/v2/report/nuevo/kardex",
        method: "POST",
        data: { condicion, EMPRESA_ID: empresaId },
        responseType: "blob",
        ...headers,
      });
    } catch (e1) {
      if (e1?.response?.status !== 404) throw e1;
      return await axios({
        url: "/v2/report/nuevo/kardex",
        method: "POST",
        data: { condicion, EMPRESA_ID: empresaId },
        responseType: "blob",
        ...headers,
      });
    }
  };

  const extractServerError = async (err) => {
    try {
      if (err?.response?.data instanceof Blob) {
        const t = await err.response.data.text();
        return t?.slice(0, 400) || err.message;
      }
    } catch {}
    return err?.message || "Error desconocido";
  };

  const generarReporte = async () => {
    try {
      const condicion = buildCondicion();
      const res = await requestPDF(condicion);
      const blob = new Blob([res.data], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado." });
    } catch (err) {
      const txt = await extractServerError(err);
      console.error(err);
      setMessage({
        open: true,
        severity: "error",
        text: `No se pudo generar el PDF (HTTP ${err?.response?.status ?? "?"}). ${txt}`,
      });
    }
  };

  // ===== UI
  const fields = [
    { name: "municipio_id",          label: "Municipio",          items: items.municipios },
    { name: "sede_id",               label: "Sede",               items: items.sedes },
    { name: "bloque_id",             label: "Bloque",             items: items.bloques },
    { name: "espacio_id",            label: "Espacio",            items: items.espacios },
    { name: "almacen_id",            label: "Almacén",            items: items.almacenes },
    { name: "producto_id",           label: "Producto",           items: items.productos },
    { name: "producto_categoria_id", label: "Categoría Producto", items: items.categorias },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte Kardex</Typography>

      {/* Filtros arriba (mismo patrón) */}
      <Grid container spacing={2} mb={2}>
        {fields.map((f) => (
          <Grid key={f.name} item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{f.label}</InputLabel>
              <Select
                label={f.label}
                value={form[f.name] || ""}
                onChange={handleChange(f.name)}
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                {asArray(f.items).map((it) => (
                  <MenuItem key={it.id} value={String(it.id)}>
                    {it.nombre ?? it.name ?? `#${it.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={form.fecha_inicio || ""}
            onChange={(e) => setForm((s) => ({ ...s, fecha_inicio: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="datetime-local"
            fullWidth
            value={form.fecha_fin || ""}
            onChange={(e) => setForm((s) => ({ ...s, fecha_fin: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Acciones (igual que en Pedido/OC) */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={buscar}>Buscar</Button>
        <Button variant="outlined" onClick={generarReporte}>Generar Reporte</Button>
      </Stack>

      {/* Tabla resultados (como en RE_pedido) */}
      {resultados.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Kardex encontrado</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha/Hora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.map((row, idx) => (
                  <TableRow key={row.id ?? idx}>
                    <TableCell>{row.id ?? ""}</TableCell>
                    <TableCell>{toLocal(getFechaKdx(row))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Preview PDF */}
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

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
