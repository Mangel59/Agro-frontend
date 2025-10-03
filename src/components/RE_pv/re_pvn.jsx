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

// Hook de ubicación (mismo patrón que re_pv)
import useUbicacionFilters from "../useUbicacionFilters";

export default function RE_productoVencimiento() {
  // ===== Auth / empresa =====
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // ===== Helpers =====
  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? []);

  // normaliza a "YYYY-MM-DD HH:mm" (como en tu Postman)
  const toReportDTmm = (val) => {
    if (!val) return "";
    const [d, t] = String(val).split("T");
    const hhmm = (t || "00:00").slice(0, 5);
    return `${d} ${hhmm}`;
  };

  // ===== Hook: ubicación =====
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

  // ===== Filtros =====
  const [filtro, setFiltro] = useState({
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // ===== UI State =====
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [errors, setErrors] = useState({ fechas_rango: false });
  const [openUbi, setOpenUbi] = useState(false);

  // ===== Cargar combos =====
  useEffect(() => {
    Promise.all([
      axios.get("/v1/producto", headers),
      axios.get("/v1/producto_categoria", headers),
    ])
      .then(([resProductos, resCategorias]) => {
        setProductos(asArray(resProductos.data));
        setCategorias(asArray(resCategorias.data));
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "No se pudieron cargar combos." });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // ===== Buscar (UI) =====
  const buscar = useCallback(async () => {
    setResultados([]);
    if (!validarRango()) return;

    try {
      const r = await axios.get("/v1/producto", headers);
      let lista = asArray(r.data);

      if (filtro.producto_categoria_id) {
        lista = lista.filter((p) =>
          String(p.productoCategoriaId ?? p.producto_categoria_id ?? "") === String(filtro.producto_categoria_id)
        );
      }
      if (filtro.producto_id) {
        lista = lista.filter((p) => String(p.id) === String(filtro.producto_id));
      }

      setResultados(lista);
      setMessage({
        open: true,
        severity: "info",
        text: `Mostrando ${lista.length} producto(s).`,
      });
    } catch (err) {
      console.error(err);
      setResultados([]);
      setMessage({ open: true, severity: "error", text: "No se pudieron cargar productos." });
    }
  }, [filtro, headers]);

  // ===== Generar Reporte (PDF) =====
  const generarPDF = async () => {
    if (!filtro.producto_id || !filtro.producto_categoria_id || !filtro.fecha_inicio || !filtro.fecha_fin) {
      setMessage({ open: true, severity: "warning", text: "Completa producto, categoría y el rango de fechas." });
      return;
    }
    const ini = new Date(filtro.fecha_inicio);
    const fin = new Date(filtro.fecha_fin);
    if (ini > fin) {
      setMessage({ open: true, severity: "warning", text: "La fecha de inicio no puede ser mayor que la fecha fin." });
      return;
    }

    // Payload idéntico a tu Postman (sin empresa_id)
    const payload = {
      producto_id: Number(filtro.producto_id),
      producto_categoria_id: Number(filtro.producto_categoria_id),
      fecha_inicio: toReportDTmm(filtro.fecha_inicio),
      fecha_fin: toReportDTmm(filtro.fecha_fin),
    };
    console.log("[producto_vencimiento] payload:", payload);

    const tryEndpoint = async (url) => {
      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        responseType: "blob",
      });
      const ct = res.headers?.["content-type"] || "";
      if (!ct.includes("pdf")) {
        const text = await res.data.text?.();
        throw new Error(text || `El servidor no devolvió un PDF en ${url}.`);
      }
      return res.data;
    };

    try {
      let dataBlob;
      // 1) Primero el legacy (el que te funciona en Postman)
      try {
        dataBlob = await tryEndpoint("/v2/report/producto_vencimiento");
      } catch (eLegacy) {
        // 2) Si falla por cualquier motivo, intenta el "nuevo"
        console.warn("Legacy falló, probando /nuevo:", eLegacy?.response?.status);
        dataBlob = await tryEndpoint("/v2/report/nuevo/producto_vencimiento");
      }

      const blob = new Blob([dataBlob], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
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

  // ===== Render =====
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Vencimiento de Producto</Typography>

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
              {asArray(productos).map((p) => (
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

      <Stack direction="row" spacing={2} mb={3}>
        <Button variant="contained" onClick={buscar}>Buscar</Button>
        <Button variant="outlined" onClick={generarPDF}>Generar Reporte</Button>
        <Button variant="text" onClick={() => setOpenUbi(true)}>Filtros (ubicación)</Button>
      </Stack>

      {/* Diálogo (ubicación) */}
      <Dialog open={openUbi} onClose={() => setOpenUbi(false)} fullWidth maxWidth="md">
        <DialogTitle>
          Filtros de Ubicación
          <IconButton onClick={() => setOpenUbi(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>País</InputLabel>
                <Select
                  label="País"
                  value={ubi.pais_id || ""}
                  onChange={(e) => handleUbiChange("pais_id")(e.target.value)}
                >
                  {asArray(ubiData.paises).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `País ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Departamento</InputLabel>
                <Select
                  label="Departamento"
                  value={ubi.departamento_id || ""}
                  onChange={(e) => handleUbiChange("departamento_id")(e.target.value)}
                >
                  {asArray(ubiData.departamentos).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Depto ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Municipio</InputLabel>
                <Select
                  label="Municipio"
                  value={ubi.municipio_id || ""}
                  onChange={(e) => handleUbiChange("municipio_id")(e.target.value)}
                >
                  {asArray(ubiData.municipios).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Municipio ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Sede</InputLabel>
                <Select
                  label="Sede"
                  value={ubi.sede_id || ""}
                  onChange={(e) => handleUbiChange("sede_id")(e.target.value)}
                >
                  {asArray(ubiData.sedes).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Sede ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Bloque</InputLabel>
                <Select
                  label="Bloque"
                  value={ubi.bloque_id || ""}
                  onChange={(e) => handleUbiChange("bloque_id")(e.target.value)}
                >
                  {asArray(ubiData.bloques).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Bloque ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Espacio</InputLabel>
                <Select
                  label="Espacio"
                  value={ubi.espacio_id || ""}
                  onChange={(e) => handleUbiChange("espacio_id")(e.target.value)}
                >
                  {asArray(ubiData.espacios).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Espacio ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Almacén</InputLabel>
                <Select
                  label="Almacén"
                  value={ubi.almacen_id || ""}
                  onChange={(e) => handleUbiChange("almacen_id")(e.target.value)}
                >
                  {asArray(ubiData.almacenes).map((it) => (
                    <MenuItem key={it.id} value={String(it.id)}>{it.nombre ?? `Almacén ${it.id}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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

      {/* Resultados UI simples */}
      {resultados.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Productos encontrados</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {resultados.map((p) => (
    <TableRow key={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.nombre ?? ""}</TableCell>
      <TableCell>{p.productoCategoriaId ?? p.categoriaId ?? ""}</TableCell>
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
