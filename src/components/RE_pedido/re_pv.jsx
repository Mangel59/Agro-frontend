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
import VistaPreviaPDFPedido from "../r_pedido/VistaPreviaPDFPedido";
import GridArticuloPedido from "../r_pedido/GridArticuloPedido";

import useUbicacionFilters, {
  buildPedidoCondicionEmpresa,
  buildPedidoReporteEspecifico,
} from "../useUbicacionFilters";

import UbicacionPedidoFilters from "../UbicacionPedidoFilters.jsx"; 
export default function RE_pedido() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const asArray = (x) => (Array.isArray(x) ? x : x?.content ?? []);
  const getFecha = (p) =>
    p?.fechaHora ?? p?.pedFechaHora ?? p?.fecha ?? p?.createdAt ?? null;
  const fmt = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? String(val) : d.toLocaleString();
  };

  // ===== Hook unificado: ubicación + filtros de pedido (LOS 4 CAMPOS) =====
  const {
    // ubicación
    form: ubi,
    handleChange: handleUbiChange,
    data: ubiData,
    resetTodo,

    // pedido (dentro del hook)
    pedido,
    setPedido,
    handlePedidoChange,
    pedidos,
    categoriasEstado,
  } = useUbicacionFilters({
    empresaId,
    headers,
    autoselectSingle: true,
  });

  // ===== estado UI (no filtros)
  const [pedidoData, setPedidoData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [errors, setErrors] = useState({ fechas_rango: false });
  const [openUbi, setOpenUbi] = useState(false);

  // combos (compatibilidad por si algo no llegó aún del hook; no rompe si ya están)
  useEffect(() => {
    if (!pedidos?.length) {
      axios.get("/v1/pedido", headers).catch(() => {});
    }
    if (!categoriasEstado?.length) {
      axios.get("/v1/items/estado_categoria/0", headers).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validarRango = () => {
    if (pedido.fecha_inicio && pedido.fecha_fin) {
      const ini = new Date(pedido.fecha_inicio);
      const fin = new Date(pedido.fecha_fin);
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

  // Buscar: solo UI (nunca PDF)
  const buscar = async () => {
    setPedidoData(null);
    setArticulos([]);
    setPresentaciones([]);
    setResultados([]);
    setErrors({ fechas_rango: false });

    if (!validarRango()) return;

    // Sin pedido -> lista de pedidos en tabla con posible rango de fecha
    if (!pedido.pedido_id) {
      try {
        const r = await axios.get("/v1/pedido", headers);
        const all = asArray(r.data);
        const ini = pedido.fecha_inicio ? new Date(pedido.fecha_inicio) : null;
        const fin = pedido.fecha_fin ? new Date(pedido.fecha_fin) : null;
        const lista = all.filter((p) => {
          const f = getFecha(p);
          if (!f || (!ini && !fin)) return true;
          const d = new Date(f);
          if (isNaN(d.getTime())) return true;
          if (ini && d < ini) return false;
          if (fin && d > fin) return false;
          return true;
        });
        setResultados(lista);
        setMessage({
          open: true,
          severity: "info",
          text: `Mostrando ${lista.length} pedido(s).`,
        });
      } catch {
        setResultados([]);
        setMessage({ open: true, severity: "error", text: "No se pudieron cargar pedidos." });
      }
      return;
    }

    // Con pedido -> detalle
    try {
      const [pRes, aRes, prRes] = await Promise.all([
        axios.get(`/v1/pedido/${pedido.pedido_id}`, headers),
        axios.get(`/v1/pedido/${pedido.pedido_id}/articulos`, headers),
        axios.get("/v1/presentacion", headers),
      ]);
      setPedidoData(pRes.data);
      setArticulos(asArray(aRes.data));
      setPresentaciones(asArray(prRes.data));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setMessage({ open: true, severity: "success", text: "Datos del pedido cargados." });
    } catch (err) {
      console.error(err);
      setMessage({ open: true, severity: "error", text: "No se encontró el pedido." });
    }
  };

  // Generar Reporte (PDF)
  const generarReporte = async () => {
    if (!validarRango()) return;

    try {
      // Caso específico (pedido + categoría)
      if (pedido.pedido_id && pedido.categoria_estado_id) {
        const payload = buildPedidoReporteEspecifico({
          empresaId,
          pedido_id: pedido.pedido_id,
          categoria_estado_id: pedido.categoria_estado_id,
          fecha_inicio: pedido.fecha_inicio,
          fecha_fin: pedido.fecha_fin,
          logoPath,
        });

        const res = await axios({
          url: "/v2/report/pedido",
          method: "POST",
          data: payload,
          responseType: "blob",
          ...headers,
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
        setPreviewOpen(true);
        setMessage({ open: true, severity: "success", text: "PDF del pedido generado." });
        return;
      }

      // Caso empresa (con ubicación opcional)
      const payloadEmpresa = buildPedidoCondicionEmpresa({
        empresaId,
        pedido_id: pedido.pedido_id,
        categoria_estado_id: pedido.categoria_estado_id,
        fecha_inicio: pedido.fecha_inicio,
        fecha_fin: pedido.fecha_fin,
        ubicacion: ubi, // ← pais/departamento/municipio/sede/bloque/espacio/almacen
      });

      const res = await axios({
        url: "/v2/report/nuevo/pedidov2",
        method: "POST",
        data: payloadEmpresa,
        responseType: "blob",
        ...headers,
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado (empresa)." });
    } catch (err) {
      console.error(err);
      setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Pedido</Typography>

      {/* 4 campos (provienen del hook) */}
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
                <MenuItem key={p.id} value={String(p.id)}>
                  {`Pedido ${p.id}`}
                </MenuItem>
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
            value={pedido.fecha_inicio || ""}
            onChange={handlePedidoChange("fecha_inicio")}
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
            value={pedido.fecha_fin || ""}
            onChange={handlePedidoChange("fecha_fin")}
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
        <Button variant="text" onClick={() => setOpenUbi(true)}>Filtros (ubicación)</Button>
      </Stack>

      {/* Diálogo: filtros Ubicación + Pedido (reutilizable) */}
      <UbicacionPedidoFilters
        variant="dialog"
        title="Filtros (ubicación + pedido)"
        open={openUbi}
        onClose={() => setOpenUbi(false)}
        // Ubicación
        ubiForm={ubi}
        ubiData={ubiData}
        handleUbiChange={handleUbiChange}
        onUbiReset={resetTodo}
        // Pedido
        pedido={pedido}
        pedidos={pedidos}
        categoriasEstado={categoriasEstado}
        handlePedidoChange={handlePedidoChange}
        fechasError={errors.fechas_rango}
        // Aplicar
        onApply={() => { setOpenUbi(false); buscar(); }}
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

      {/* Resultados UI */}
      {pedidoData && (
        <>
          <VistaPreviaPDFPedido pedido={pedidoData} articulos={articulos} presentaciones={presentaciones} />
          <Box mt={4}>
            <Typography variant="h6">Artículos del Pedido</Typography>
            <GridArticuloPedido
              items={articulos}
              presentaciones={presentaciones}
              setSelectedRows={() => {}}
              setSelectedRow={() => {}}
            />
          </Box>
        </>
      )}

      {!pedidoData && resultados.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Pedidos encontrados</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha/Hora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{fmt(getFecha(p))}</TableCell>
                    <TableCell>{p?.empresaId ?? p?.pedEmpresaId ?? ""}</TableCell>
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
