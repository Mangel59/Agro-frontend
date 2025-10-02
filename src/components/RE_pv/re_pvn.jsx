// src/components/RE_productoVencimiento.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
  TableContainer, Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import useUbicacionFilters from "../useUbicacionFilters";

export default function RE_productoVencimiento() {
  // === Auth / empresa
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // === Helpers
  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? x?.data ?? []);

  // "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm:ss"
  const toSec = (val, end = false) => {
    if (!val) return null;
    const [d, t] = String(val).split("T");
    const hhmm = (t || (end ? "23:59" : "00:00")).slice(0, 5);
    return `${d} ${hhmm}:00`;
  };

  // 🔧 Cambia este alias si tu SQL usa otro nombre de columna/alias para la fecha de vencimiento
  const ALIAS_VENC = "v.venc_fecha"; // p.ej. "l.lot_fecha_vencimiento"

  // === Ubicación (por si luego la usas)
  const {
    form: ubi,
    handleChange: handleUbiChange,
    data: ubiData,
    resetTodo,
  } = useUbicacionFilters({ empresaId, headers, autoselectSingle: true });

  // === Filtros
  const [filtro, setFiltro] = useState({
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // === UI
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [errors, setErrors] = useState({ fechas_rango: false });
  const [openUbi, setOpenUbi] = useState(false);

  // === Cargar catálogos (todo vía /v1/items)
  useEffect(() => {
    Promise.all([
      axios.get("/v1/items/producto/0", headers).catch(() => ({ data: [] })),
      axios.get("/v1/items/producto_categoria/0", headers).catch(() => ({ data: [] })),
    ])
      .then(([pr, cat]) => {
        setProductos(asArray(pr.data));
        setCategorias(asArray(cat.data));
      })
      .catch(() => setMessage({ open: true, severity: "error", text: "No se pudieron cargar los catálogos." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltroChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setFiltro((prev) => ({ ...prev, [field]: value }));
  };

  const validarRango = () => {
    setErrors({ fechas_rango: false });
    if (filtro.fecha_inicio && filtro.fecha_fin) {
      const ini = new Date(filtro.fecha_inicio);
      const fin = new Date(filtro.fecha_fin);
      if (ini > fin) {
        setErrors({ fechas_rango: true });
        setMessage({ open: true, severity: "warning", text: "La fecha de inicio no puede ser mayor que la fecha fin." });
        return false;
      }
    }
    return true;
  };

  // === Buscar (lista/filtra en front)
  const buscar = useCallback(async () => {
    setResultados([]);
    if (!validarRango()) return;

    try {
      const r = await axios.get("/v1/items/producto/0", headers);
      let lista = asArray(r.data);

      if (filtro.producto_categoria_id) {
        lista = lista.filter((p) =>
          String(p.productoCategoriaId ?? p.producto_categoria_id ?? p.categoriaId ?? "") ===
          String(filtro.producto_categoria_id)
        );
      }
      if (filtro.producto_id) {
        lista = lista.filter((p) => String(p.id) === String(filtro.producto_id));
      }

      setResultados(lista);
      setMessage({ open: true, severity: "info", text: `Mostrando ${lista.length} producto(s).` });
    } catch (err) {
      console.error(err);
      setResultados([]);
      setMessage({ open: true, severity: "error", text: "No se pudieron cargar productos." });
    }
  }, [filtro, headers]);

  // === condicion compacta (sin huecos) 0..N (igual que pedido)
  const buildCondicion = () => {
    const parts = [];

    // 0) empresa (obligatorio)
    parts.push(`e.emp_id = $EMPRESA_ID$`);

    // Ubicación (opcional). Descomenta si el reporte las soporta:
    // if (ubi.municipio_id) parts.push(`AND m.mun_id = ${Number(ubi.municipio_id)}`);
    // if (ubi.sede_id)      parts.push(`AND s.sed_id = ${Number(ubi.sede_id)}`);
    // if (ubi.bloque_id)    parts.push(`AND blo.blo_id = ${Number(ubi.bloque_id)}`);
    // if (ubi.espacio_id)   parts.push(`AND esp.esp_id = ${Number(ubi.espacio_id)}`);
    // if (ubi.almacen_id)   parts.push(`AND al.alm_id = ${Number(ubi.almacen_id)}`);

    // Producto / Categoría (opcionales)
    if (filtro.producto_id) {
      parts.push(`AND p.pro_id = ${Number(filtro.producto_id)}`);
    }
    if (filtro.producto_categoria_id) {
      parts.push(`AND p.pro_producto_categoria_id = ${Number(filtro.producto_categoria_id)}`);
    }

    // Rango SIEMPRE, con segundos y comillas dobles (default si no eliges fechas)
    const ini = toSec(filtro.fecha_inicio, false) ?? "1900-01-01 00:00:00";
    const fin  = toSec(filtro.fecha_fin,   true)  ?? "2099-12-31 23:59:59";
    parts.push(`AND ${ALIAS_VENC} BETWEEN "${ini}" AND "${fin}"`);

    // Compacta índices 0..N (exacto como en RE_pedido)
    return Object.fromEntries(parts.map((v, i) => [String(i), v]));
  };

  // === POST PDF (nuevo) + lectura de error
  const postPdfNuevo = async (data) => {
    const res = await axios.post("/v2/report/nuevo/producto_vencimiento", data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      responseType: "blob",
    });
    const ct = res.headers?.["content-type"] || "";
    if (!ct.includes("pdf")) {
      const txt = await res.data.text?.();
      throw new Error(txt || "El servidor no devolvió un PDF.");
    }
    return res.data;
  };

  const generarPDF = async () => {
    if (!validarRango()) return;
    try {
      const condicion = buildCondicion();
      const blobData = await postPdfNuevo({ condicion, EMPRESA_ID: empresaId });

      const blob = new Blob([blobData], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado." });
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      if (err?.response?.data instanceof Blob) {
        try {
          const txt = await err.response.data.text();
          setMessage({ open: true, severity: "error", text: (txt || "").slice(0, 500) });
          return;
        } catch {}
      }
      setMessage({ open: true, severity: "error", text: err?.message || "Error al generar el PDF." });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Vencimiento de Producto</Typography>

      {/* Filtros (todos son ítems) */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select
              name="producto_id"
              value={filtro.producto_id || ""}
              label="Producto"
              onChange={handleFiltroChange("producto_id")}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {asArray(productos).map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.nombre ?? p.name ?? `Producto ${p.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría Producto</InputLabel>
            <Select
              name="producto_categoria_id"
              value={filtro.producto_categoria_id || ""}
              label="Categoría Producto"
              onChange={handleFiltroChange("producto_categoria_id")}
            >
              <MenuItem value=""><em>Todas</em></MenuItem>
              {asArray(categorias).length ? (
                asArray(categorias).map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.nombre ?? c.name ?? `Categoría ${c.id}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Sin opciones
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Fechas (opcionales) */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={filtro.fecha_inicio || ""}
            onChange={handleFiltroChange("fecha_inicio")}
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
            value={filtro.fecha_fin || ""}
            onChange={handleFiltroChange("fecha_fin")}
            InputLabelProps={{ shrink: true }}
            error={errors.fechas_rango}
            helperText={errors.fechas_rango ? "Fin debe ser >= Inicio." : ""}
          />
        </Grid>
      </Grid>

      {/* Acciones */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={buscar}>Buscar</Button>
        <Button variant="outlined" onClick={generarPDF}>Generar Reporte</Button>
        <Button variant="text" onClick={() => setOpenUbi(true)}>Filtros (ubicación)</Button>
      </Stack>

      {/* Diálogo Ubicación (opcional) */}
      <Dialog open={openUbi} onClose={() => setOpenUbi(false)} fullWidth maxWidth="md">
        <DialogTitle>
          Filtros de Ubicación
          <IconButton onClick={() => setOpenUbi(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              ["pais_id", "País", ubiData.paises],
              ["departamento_id", "Departamento", ubiData.departamentos],
              ["municipio_id", "Municipio", ubiData.municipios],
              ["sede_id", "Sede", ubiData.sedes],
              ["bloque_id", "Bloque", ubiData.bloques],
              ["espacio_id", "Espacio", ubiData.espacios],
              ["almacen_id", "Almacén", ubiData.almacenes],
            ].map(([name, label, list]) => (
              <Grid item xs={12} md={6} key={name}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select
                    label={label}
                    value={ubi[name] || ""}
                    onChange={(e) => handleUbiChange(name)(e.target.value)}
                  >
                    {asArray(list).map((it) => (
                      <MenuItem key={it.id} value={String(it.id)}>
                        {it.nombre ?? it.name ?? `${label} ${it.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
            <Button onClick={resetTodo}>Limpiar ubicación</Button>
            <Button variant="contained" onClick={() => { setOpenUbi(false); buscar(); }}>
              Aplicar y buscar
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

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

      {/* Resultados UI */}
      {resultados.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Productos encontrados</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.nombre ?? p.name ?? ""}</TableCell>
                    <TableCell>{p.productoCategoriaId ?? p.categoriaId ?? p.producto_categoria_id ?? ""}</TableCell>
                    <TableCell>{p.descripcion ?? ""}</TableCell>
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
