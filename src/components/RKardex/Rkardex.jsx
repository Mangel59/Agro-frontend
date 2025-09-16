import React, { useEffect, useMemo, useState } from "react";
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
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const empresaId = decoded?.empresaId ?? localStorage.getItem("empresaId");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(asArray(arr).map(o => [o.id, o])).values());
  const toNum = (v) => (v === "" || v == null ? NaN : Number(v));
  const toReportDT = (val) => (val ? String(val).replace("T", " ").slice(0, 16) : "");

  // distintos nombres posibles del id de categoría del producto
  const getProdCatId = (p) =>
    p?.productoCategoriaId ??
    p?.categoriaProductoId ??
    p?.categoriaId ??
    p?.categoria?.id ??
    p?.productoCategoria?.id ??
    null;

  const [form, setForm] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    fecha_inicio: "", fecha_fin: ""
  });

  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [], bloques: [], espacios: [],
    almacenes: [], productos: [], categorias: []
  });

  const [articulos, setArticulos] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  // -------- Carga inicial
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setData(d => ({ ...d, paises: asArray(res.data) })));
    axios.get("/v1/producto", headers).then(res => setData(d => ({ ...d, productos: asArray(res.data) })));
    axios.get("/v1/producto_categoria", headers).then(res => setData(d => ({ ...d, categorias: asArray(res.data) })));
  }, []);

  // Limpia dependientes en cascada
  const limpiarDesde = (campo) => {
    const orden = ["pais_id", "departamento_id", "municipio_id", "sede_id", "bloque_id", "espacio_id", "almacen_id"];
    const i = orden.indexOf(campo);
    const nuevo = { ...form };
    orden.slice(i + 1).forEach(k => { nuevo[k] = ""; });
    setForm(nuevo);
  };

  // País -> Deptos
  useEffect(() => {
    if (!form.pais_id) return;
    limpiarDesde("pais_id");
    axios.get("/v1/departamento", headers).then(res => {
      const list = asArray(res.data).filter(d => Number(d.paisId) === Number(form.pais_id));
      setData(d => ({ ...d, departamentos: list }));
      if (list.length === 1) setForm(f => ({ ...f, departamento_id: String(list[0].id) }));
    });
  }, [form.pais_id]);

  // Depto -> Municipios
  useEffect(() => {
    if (!form.departamento_id) return;
    limpiarDesde("departamento_id");
    axios.get(`/v1/municipio?departamentoId=${form.departamento_id}`, headers)
      .then(res => {
        const list = asArray(res.data);
        setData(d => ({ ...d, municipios: list }));
        if (list.length === 1) setForm(f => ({ ...f, municipio_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, municipios: [] })));
  }, [form.departamento_id]);

  // Municipio -> Sedes (filtra por empresa si existe ese campo)
  useEffect(() => {
    if (!form.municipio_id) return;
    limpiarDesde("municipio_id");
    axios.get("/v1/sede", headers)
      .then(res => {
        const raw = asArray(res.data);
        const muniId = Number(form.municipio_id);
        const empNum = empresaId ? Number(empresaId) : null;
        const itemsTienenEmpresa = raw.some(s => s?.empresaId != null);

        const filtered = raw.filter(s => {
          const sameMuni = Number(s.municipioId) === muniId;
          if (!sameMuni) return false;
          if (itemsTienenEmpresa && empNum != null) {
            return Number(s.empresaId) === empNum;
          }
          return true;
        });

        const list = uniqById(filtered);
        setData(d => ({ ...d, sedes: list }));
        if (list.length === 1) setForm(f => ({ ...f, sede_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, sedes: [] })));
  }, [form.municipio_id, empresaId]);

  // Sede -> Bloques (filtra en cliente)
  useEffect(() => {
    if (!form.sede_id) return;
    limpiarDesde("sede_id");
    axios.get("/v1/bloque", headers)
      .then(res => {
        const list = uniqById(asArray(res.data).filter(b => String(b.sedeId) === String(form.sede_id)));
        setData(d => ({ ...d, bloques: list }));
        if (list.length === 1) setForm(f => ({ ...f, bloque_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, bloques: [] })));
  }, [form.sede_id]);

  // Bloque -> Espacios
  useEffect(() => {
    if (!form.bloque_id) return;
    limpiarDesde("bloque_id");
    axios.get("/v1/espacio", headers)
      .then(res => {
        const list = uniqById(asArray(res.data).filter(e => String(e.bloqueId) === String(form.bloque_id)));
        setData(d => ({ ...d, espacios: list }));
        if (list.length === 1) setForm(f => ({ ...f, espacio_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, espacios: [] })));
  }, [form.bloque_id]);

  // Espacio -> Almacenes
  useEffect(() => {
    if (!form.espacio_id) return;
    limpiarDesde("espacio_id");
    axios.get("/v1/almacen", headers)
      .then(res => {
        const list = uniqById(asArray(res.data).filter(a => String(a.espacioId) === String(form.espacio_id)));
        setData(d => ({ ...d, almacenes: list }));
        if (list.length === 1) setForm(f => ({ ...f, almacen_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, almacenes: [] })));
  }, [form.espacio_id]);

  // Filtro de producto por categoría
  useEffect(() => {
    setForm(f => ({ ...f, producto_id: "" }));
  }, [form.producto_categoria_id]);

  const productosFiltrados = useMemo(() => {
    const catId = toNum(form.producto_categoria_id);
    const all = asArray(data.productos);
    if (!catId) return all;
    return all.filter(p => Number(getProdCatId(p)) === catId);
  }, [data.productos, form.producto_categoria_id]);

  useEffect(() => {
    if (productosFiltrados.length === 1) {
      setForm(f => ({ ...f, producto_id: String(productosFiltrados[0].id) }));
    }
  }, [productosFiltrados]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Construye params con todos los filtros presentes
  const construirParametros = () => {
    const base = {
      empresa_id: Number(empresaId),
      fecha_inicio: toReportDT(form.fecha_inicio),
      fecha_fin: toReportDT(form.fecha_fin),
      logo_empresa: `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`,
    };
    const opcionales = {
      pais_id: form.pais_id, departamento_id: form.departamento_id, municipio_id: form.municipio_id,
      sede_id: form.sede_id, bloque_id: form.bloque_id, espacio_id: form.espacio_id, almacen_id: form.almacen_id,
      producto_id: form.producto_id, producto_categoria_id: form.producto_categoria_id
    };
    Object.entries(opcionales).forEach(([k, v]) => {
      if (v !== "" && v != null) base[k] = Number(v);
    });
    return base;
  };

  const buscarKardex = () => {
    if (!form.fecha_inicio || !form.fecha_fin || !empresaId) {
      setMessage({ open: true, severity: "warning", text: "Completa fechas y empresa." });
      return;
    }
    const ini = new Date(form.fecha_inicio), fin = new Date(form.fecha_fin);
    if (ini > fin) {
      setMessage({ open: true, severity: "warning", text: "La fecha inicio no puede ser mayor a la fecha fin." });
      return;
    }

    axios.get("/v1/articulo-kardex", {
      ...headers,
      params: construirParametros()
    })
      .then(res => {
        setArticulos(asArray(res.data));
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Kardex</Typography>

      <Grid container spacing={2}>
        {[
          { label: "País", name: "pais_id", options: data.paises, disabled: false },
          { label: "Departamento", name: "departamento_id", options: data.departamentos, disabled: !form.pais_id },
          { label: "Municipio", name: "municipio_id", options: data.municipios, disabled: !form.departamento_id },
          { label: "Sede", name: "sede_id", options: data.sedes, disabled: !form.municipio_id },
          { label: "Bloque", name: "bloque_id", options: data.bloques, disabled: !form.sede_id },
          { label: "Espacio", name: "espacio_id", options: data.espacios, disabled: !form.bloque_id },
          { label: "Almacén", name: "almacen_id", options: data.almacenes, disabled: !form.espacio_id },
          { label: "Categoría Producto", name: "producto_categoria_id", options: data.categorias, disabled: false },
          { label: "Producto", name: "producto_id", options: productosFiltrados, disabled: false },
        ].map(({ label, name, options, disabled }) => (
          <Grid item xs={12} md={6} key={name}>
            <FormControl fullWidth disabled={disabled}>
              <InputLabel>{label}</InputLabel>
              <Select name={name} value={form[name]} label={label} onChange={handleChange}>
                {asArray(options).length
                  ? asArray(options).map(opt => (
                      <MenuItem key={opt.id} value={String(opt.id)}>{opt.nombre}</MenuItem>
                    ))
                  : <MenuItem value="" disabled>No disponible</MenuItem>}
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
            onChange={handleChange}
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
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
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
