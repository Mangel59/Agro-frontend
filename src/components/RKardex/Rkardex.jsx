import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Grid, TextField,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFKardex from "../Kardex/vistapreviapdfkardex";
import GridArticuloKardex from "../Kardex/GridArticuloKardex";

export default function RE_kardex() {
  const token = localStorage.getItem("token");
  const empresaId = token ? JSON.parse(atob(token.split(".")[1]))?.empresaId : null;
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const [form, setForm] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    fecha_inicio: "", fecha_fin: ""
  });

  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [], bloques: [], espacios: [],
    almacenes: [], productos: [], categorias: [], pedidos: []
  });

  const [articulos, setArticulos] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatoFecha = (fecha) => fecha ? fecha.replace("T", " ").slice(0, 16) : "";

  const construirParametros = () => ({
    empresa_id: parseInt(empresaId),
    fecha_inicio: formatoFecha(form.fecha_inicio),
    fecha_fin: formatoFecha(form.fecha_fin),
    logo_empresa: `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`
  });

  const buscarKardex = () => {
    if (!form.fecha_inicio || !form.fecha_fin || !empresaId) {
      setMessage({ open: true, severity: "warning", text: "Completa todos los campos requeridos." });
      return;
    }

    axios.get("/v1/articulo-kardex", {
      ...headers,
      params: construirParametros()
    })
      .then(res => {
        setArticulos(Array.isArray(res.data) ? res.data : []);
        setMessage({ open: true, severity: "success", text: "Datos cargados correctamente." });
      })
      .catch(() => {
        setArticulos([]);
        setMessage({ open: true, severity: "error", text: "No se pudo obtener el Kardex." });
      });
  };

  const verReportePDF = () => {
    axios.post("/v2/report/kardex", construirParametros(), {
      ...headers,
      responseType: "blob"
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        setPreviewUrl(url);
        setDialogOpen(true);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
      });
  };

  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setData(d => ({ ...d, paises: res.data })));
    axios.get("/v1/producto", headers).then(res => setData(d => ({ ...d, productos: res.data })));
    axios.get("/v1/producto_categoria", headers).then(res => setData(d => ({ ...d, categorias: res.data })));
    axios.get("/v1/pedido", headers).then(res => setData(d => ({ ...d, pedidos: res.data })));
  }, []);

  const limpiarCamposDesde = (campo) => {
    const orden = ["pais_id", "departamento_id", "municipio_id", "sede_id", "bloque_id", "espacio_id", "almacen_id"];
    const i = orden.indexOf(campo);
    const nuevoForm = { ...form };
    orden.slice(i + 1).forEach(c => nuevoForm[c] = "");
    setForm(nuevoForm);
  };

  useEffect(() => {
    if (!form.pais_id) return;
    limpiarCamposDesde("pais_id");
    axios.get("/v1/departamento", headers).then(res => {
      const filtered = res.data.filter(dep => dep.paisId === parseInt(form.pais_id));
      setData(d => ({ ...d, departamentos: filtered }));
      if (filtered.length === 1) setForm(f => ({ ...f, departamento_id: filtered[0].id }));
    });
  }, [form.pais_id]);

  useEffect(() => {
    if (!form.departamento_id) return;
    limpiarCamposDesde("departamento_id");
    axios.get(`/v1/municipio?departamentoId=${form.departamento_id}`, headers).then(res => {
      setData(d => ({ ...d, municipios: res.data }));
      if (res.data.length === 1) setForm(f => ({ ...f, municipio_id: res.data[0].id }));
    });
  }, [form.departamento_id]);

  useEffect(() => {
    if (!form.municipio_id) return;
    limpiarCamposDesde("municipio_id");
    axios.get("/v1/sede", headers).then(res => {
      const filtered = res.data.filter(s => s.municipioId === parseInt(form.municipio_id));
      setData(d => ({ ...d, sedes: filtered }));
      if (filtered.length === 1) setForm(f => ({ ...f, sede_id: filtered[0].id }));
    });
  }, [form.municipio_id]);

  useEffect(() => {
    if (!form.sede_id) return;
    limpiarCamposDesde("sede_id");
    axios.get("/v1/bloque", headers).then(res => {
      const filtered = res.data.filter(b => b.sedeId === parseInt(form.sede_id));
      setData(d => ({ ...d, bloques: filtered }));
      if (filtered.length === 1) setForm(f => ({ ...f, bloque_id: filtered[0].id }));
    });
  }, [form.sede_id]);

  useEffect(() => {
    if (!form.bloque_id) return;
    limpiarCamposDesde("bloque_id");
    axios.get("/v1/espacio", headers).then(res => {
      const filtered = res.data.filter(e => e.bloqueId === parseInt(form.bloque_id));
      setData(d => ({ ...d, espacios: filtered }));
      if (filtered.length === 1) setForm(f => ({ ...f, espacio_id: filtered[0].id }));
    });
  }, [form.bloque_id]);

  useEffect(() => {
    if (!form.espacio_id) return;
    limpiarCamposDesde("espacio_id");
    axios.get("/v1/almacen", headers).then(res => {
      const filtered = res.data.filter(a => a.espacioId === parseInt(form.espacio_id));
      setData(d => ({ ...d, almacenes: filtered }));
      if (filtered.length === 1) setForm(f => ({ ...f, almacen_id: filtered[0].id }));
    });
  }, [form.espacio_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Kardex</Typography>

      <Grid container spacing={2}>
        {[{ label: "País", name: "pais_id", options: data.paises },
          { label: "Departamento", name: "departamento_id", options: data.departamentos },
          { label: "Municipio", name: "municipio_id", options: data.municipios },
          { label: "Sede", name: "sede_id", options: data.sedes },
          { label: "Bloque", name: "bloque_id", options: data.bloques },
          { label: "Espacio", name: "espacio_id", options: data.espacios },
          { label: "Almacén", name: "almacen_id", options: data.almacenes },
          { label: "Producto", name: "producto_id", options: data.productos },
          { label: "Categoría Producto", name: "producto_categoria_id", options: data.categorias }
        ].map(({ label, name, options }) => (
          <Grid item xs={6} key={name}>
            <FormControl fullWidth>
              <InputLabel>{label}</InputLabel>
              <Select name={name} value={form[name]} onChange={handleChange}>
                {Array.isArray(options) ? (
                  options.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>No disponible</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid item xs={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={form.fecha_inicio || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="datetime-local"
            fullWidth
            value={form.fecha_fin || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" gap={2}>
        <Button variant="contained" onClick={buscarKardex}>Buscar</Button>
        <Button variant="outlined" onClick={verReportePDF}>Ver Reporte</Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Vista previa PDF Kardex</DialogTitle>
        <DialogContent dividers>
          <VistaPreviaPDFKardex url={previewUrl} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {articulos.length > 0 && (
        <Box mt={4}>
          <VistaPreviaPDFKardex kardex={articulos} />
          <Typography variant="h6" gutterBottom>Detalle de artículos Kardex</Typography>
          <GridArticuloKardex items={articulos} />
        </Box>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
