// src/components/RE_kardex.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFKardex from "../Kardex/vistapreviapdfkardex";
import GridArticuloKardex from "../Kardex/GridArticuloKardex";

// ⬇️ Mismo hook de ubicación que en RE_pedido / RE_productoVencimiento
import useUbicacionFilters from "../useUbicacionFilters";

export default function RE_kardex() {
  // ======== Auth / empresa ========
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const empresaId = decoded?.empresaId ?? localStorage.getItem("empresaId");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;

  // ======== Helpers ========
  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? []);
  const toNum = (v) => (v === "" || v == null ? NaN : Number(v));
  const toReportDT = (val) => {
    if (!val) return "";
    const [d, t] = String(val).split("T");
    const hhmm = (t || "00:00").slice(0, 5);
    return `${d} ${hhmm}:00`;
  };
  const getProdCatId = (p) =>
    p?.productoCategoriaId ??
    p?.categoriaProductoId ??
    p?.categoriaId ??
    p?.categoria?.id ??
    p?.productoCategoria?.id ??
    null;

  // ===== Hook unificado: ubicación =====
  const {
    form: ubi,
    handleChange: handleUbiChange,
    data: ubiData,
    resetTodo,
  } = useUbicacionFilters({
    empresaId,
    headers,
    autoselectSingle: true,
  });

  // ===== Filtros (los 4 campos principales) =====
  const [filtro, setFiltro] = useState({
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // ===== Estado UI =====
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);      // resultados UI
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openUbi, setOpenUbi] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [errors, setErrors] = useState({ fechas_rango: false });

  // ===== Cargar combos =====
  useEffect(() => {
    Promise.all([
      axios.get("/v1/producto", headers),
      axios.get("/v1/producto_categoria", headers),
    ])
      .then(([resProd, resCat]) => {
        setProductos(asArray(resProd.data));
        setCategorias(asArray(resCat.data));
      })
      .catch(() =>
        setMessage({ open: true, severity: "error", text: "No se pudieron cargar productos/categorías." })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Derivados =====
  useEffect(() => { setFiltro((f) => ({ ...f, producto_id: "" })); }, [filtro.producto_categoria_id]);

  const productosFiltrados = useMemo(() => {
    const catId = toNum(filtro.producto_categoria_id);
    const all = asArray(productos);
    if (!catId) return all;
    return all.filter((p) => Number(getProdCatId(p)) === catId);
  }, [productos, filtro.producto_categoria_id]);

  useEffect(() => {
    if (productosFiltrados.length === 1) {
      setFiltro((f) => ({ ...f, producto_id: String(productosFiltrados[0].id) }));
    }
  }, [productosFiltrados]);

  // ===== Handlers =====
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
        setMessage({
          open: true,
          severity: "warning",
          text: "La fecha de inicio no puede ser mayor que la fecha fin.",
        });
        return false;
      }
    }
    return true;
  };

  // Construcción de payload (igual patrón a los otros)
  const construirParametros = () => {
    const base = {
      empresa_id: Number(empresaId),
      fecha_inicio: toReportDT(filtro.fecha_inicio),
      fecha_fin: toReportDT(filtro.fecha_fin),
      logo_empresa: logoPath,
      // ubicación opcional
      pais_id: ubi.pais_id || "",
      departamento_id: ubi.departamento_id || "",
      municipio_id: ubi.municipio_id || "",
      sede_id: ubi.sede_id || "",
      bloque_id: ubi.bloque_id || "",
      espacio_id: ubi.espacio_id || "",
      almacen_id: ubi.almacen_id || "",
      // producto opcional
      producto_id: filtro.producto_id || "",
      producto_categoria_id: filtro.producto_categoria_id || "",
    };
    return base;
  };

  // ===== Buscar (solo UI, no PDF) =====
  const buscar = async () => {
    setArticulos([]);
    if (!validarRango()) return;

    try {
      const res = await axios.get("/v1/articulo-kardex", {
        ...headers,
        params: construirParametros(),
      });
      const lista = asArray(res.data);
      setArticulos(lista);
      setMessage({
        open: true,
        severity: "info",
        text: `Mostrando ${lista.length} registro(s) de kardex.`,
      });
    } catch (err) {
      console.error(err);
      setArticulos([]);
      setMessage({ open: true, severity: "error", text: "No se pudo obtener el Kardex." });
    }
  };

  // ===== Generar Reporte (PDF) =====
  const generarReporte = async () => {
    if (!filtro.fecha_inicio || !filtro.fecha_fin) {
      setMessage({ open: true, severity: "warning", text: "Completa el rango de fechas." });
      return;
    }
    if (!validarRango()) return;

    const payload = construirParametros();
    console.log("[kardex] payload:", payload);

    try {
      const res = await axios.post("/v2/report/kardex", payload, {
        ...headers,
        responseType: "blob",
      });

      const ct = res.headers?.["content-type"] || "";
      if (!ct.includes("pdf")) {
        const text = await res.data?.text?.();
        throw new Error(text || "El servidor no devolvió un PDF.");
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado correctamente." });
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          setMessage({ open: true, severity: "error", text: text?.slice(0, 500) || "Error al generar el PDF." });
          return;
        } catch {}
      }
      setMessage({ open: true, severity: "error", text: err?.message || "Error al generar el PDF." });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Kardex</Typography>

      {/* 4 campos principales (idéntico patrón que RE_pedido/RE_productoVencimiento) */}
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
              {asArray(productosFiltrados).map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.nombre ?? `Producto ${p.id}`}
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
              {asArray(categorias).length ? (
                asArray(categorias).map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.nombre ?? `Categoría ${c.id}`}
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

      {/* Acciones (idéntico patrón) */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={buscar}>Buscar</Button>
        <Button variant="outlined" onClick={generarReporte}>Generar Reporte</Button>
        <Button variant="text" onClick={() => setOpenUbi(true)}>Filtros (ubicación)</Button>
      </Stack>

      {/* Diálogo: filtros de Ubicación (igual estilo) */}
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
              { label: "País", name: "pais_id", options: ubiData.paises },
              { label: "Departamento", name: "departamento_id", options: ubiData.departamentos },
              { label: "Municipio", name: "municipio_id", options: ubiData.municipios },
              { label: "Sede", name: "sede_id", options: ubiData.sedes },
              { label: "Bloque", name: "bloque_id", options: ubiData.bloques },
              { label: "Espacio", name: "espacio_id", options: ubiData.espacios },
              { label: "Almacén", name: "almacen_id", options: ubiData.almacenes },
            ].map(({ label, name, options }) => (
              <Grid item xs={12} md={6} key={name}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select
                    label={label}
                    value={ubi[name] || ""}
                    onChange={(e) => handleUbiChange(name)(e.target.value)}
                  >
                    {asArray(options).map((it) => (
                      <MenuItem key={it.id} value={String(it.id)}>
                        {it.nombre ?? `${label} ${it.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={resetTodo}>Limpiar ubicación</Button>
            <Button variant="contained" onClick={() => { setOpenUbi(false); buscar(); }}>
              Aplicar y buscar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Vista previa PDF (idéntico patrón) */}
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

      {/* Resultados UI (igual estilo de tabla/lista) */}
      {articulos.length > 0 ? (
        <Box mt={4}>
          {/* Si tu componente soporta render local del kardex */}
          <VistaPreviaPDFKardex kardex={articulos} />
          <Typography variant="h6" gutterBottom>Detalle de artículos Kardex</Typography>
          <GridArticuloKardex items={articulos} />
        </Box>
      ) : (
        <Box mt={2}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sin resultados</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell align="center">Realiza una búsqueda</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
