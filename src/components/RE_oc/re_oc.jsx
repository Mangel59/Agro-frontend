import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid, MenuItem,
  FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFOrdenCompra from "../OrdenCompra/vistapreviapdfordencompra";
import GridArticuloOrdenCompra from "../OrdenCompra/GridArticuloOrdenCompra";

export default function RE_ordenCompra() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(asArray(arr).map(o => [o.id, o])).values());
  const toNum = (v) => (v === "" || v == null ? NaN : Number(v));
  const getProdCatId = (p) =>
    p?.productoCategoriaId ?? p?.categoriaProductoId ?? p?.categoriaId ?? p?.categoria?.id ?? p?.productoCategoria?.id ?? null;

  const [form, setForm] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    categoria_estado_id: "", pedido_id: ""
  });

  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [],
    bloques: [], espacios: [], almacenes: [],
    productos: [], categorias: [], pedidos: []
  });

  const [ordenData, setOrdenData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // -------- Carga inicial
  useEffect(() => {
    Promise.all([
      axios.get("/v1/pais", headers),
      axios.get("/v1/producto", headers),
      axios.get("/v1/producto_categoria", headers),
      axios.get("/v1/pedido", headers),
    ])
      .then(([p, pr, c, pe]) => {
        setData(d => ({
          ...d,
          paises: asArray(p.data),
          productos: asArray(pr.data),
          categorias: asArray(c.data),
          pedidos: asArray(pe.data),
        }));
      })
      .catch(err => {
        console.error("Error carga base:", err?.response || err);
      });
  }, []);

  // ---- limpieza en cascada
  const limpiarDesde = (campo) => {
    const orden = ["pais_id","departamento_id","municipio_id","sede_id","bloque_id","espacio_id","almacen_id"];
    const i = orden.indexOf(campo);
    setForm(prev => {
      const n = { ...prev };
      orden.slice(i+1).forEach(k => n[k] = "");
      return n;
    });
  };

  // ---- País -> Departamentos
  useEffect(() => {
    if (!form.pais_id) return;
    limpiarDesde("pais_id");
    axios.get("/v1/departamento", headers).then(res => {
      const list = asArray(res.data).filter(d => Number(d.paisId) === Number(form.pais_id));
      setData(d => ({ ...d, departamentos: list }));
      if (list.length === 1) setForm(f => ({ ...f, departamento_id: String(list[0].id) }));
    });
  }, [form.pais_id]);

  // ---- Depto -> Municipios
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

  // ---- Municipio -> Sedes (opcional filtrar por empresaId si viene)
  useEffect(() => {
    if (!form.municipio_id) return;
    limpiarDesde("municipio_id");
    axios.get("/v1/sede", headers)
      .then(res => {
        const raw = asArray(res.data);
        const muni = Number(form.municipio_id);
        const emp = empresaId ? Number(empresaId) : null;
        const haveEmpresa = raw.some(s => s?.empresaId != null);
        const filtered = raw.filter(s => {
          const okM = Number(s.municipioId) === muni;
          if (!okM) return false;
          if (haveEmpresa && emp != null) return Number(s.empresaId) === emp;
          return true;
        });
        const list = uniqById(filtered);
        setData(d => ({ ...d, sedes: list }));
        if (list.length === 1) setForm(f => ({ ...f, sede_id: String(list[0].id) }));
      })
      .catch(() => setData(d => ({ ...d, sedes: [] })));
  }, [form.municipio_id, empresaId]);

  // ---- Sede -> Bloques
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

  // ---- Bloque -> Espacios
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

  // ---- Espacio -> Almacenes
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

  // ---- Filtro producto por categoría
  useEffect(() => {
    setForm(f => ({ ...f, producto_id: "" }));
  }, [form.producto_categoria_id]);

  const productosFiltrados = useMemo(() => {
    const cat = toNum(form.producto_categoria_id);
    const all = asArray(data.productos);
    if (!cat) return all;
    return all.filter(p => Number(getProdCatId(p)) === cat);
  }, [data.productos, form.producto_categoria_id]);

  useEffect(() => {
    if (productosFiltrados.length === 1) {
      setForm(f => ({ ...f, producto_id: String(productosFiltrados[0].id) }));
    }
  }, [productosFiltrados]);

  // ---- Buscar orden
  const buscarOrden = async () => {
    if (!form.pedido_id) {
      setMessage({ open: true, severity: "warning", text: "Debes seleccionar un pedido." });
      return;
    }
    try {
      const ordenesRes = await axios.get("/v1/orden_compra", { params: { page: 0, size: 200 }, ...headers });
      const ordenes = asArray(ordenesRes.data);
      const orden = ordenes.find(o => String(o.pedidoId) === String(form.pedido_id));
      if (!orden) {
        setMessage({ open: true, severity: "error", text: "No se encontró la orden para ese pedido." });
        return;
      }

      const [articulosRes, presentacionesRes] = await Promise.all([
        axios.get(`/v1/orden_compra/${orden.id}/articulos`, headers),
        axios.get("/v1/producto_presentacion", headers),
      ]);

      setOrdenData(orden);
      setArticulos(asArray(articulosRes.data));
      setPresentaciones(asArray(presentacionesRes.data));
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({ open: true, severity: "success", text: "Datos cargados correctamente." });
    } catch (error) {
      console.error("Error al buscar orden de compra:", error?.response || error);
      setOrdenData(null);
      setArticulos([]);
      setPresentaciones([]);
      setSelectedRows([]);
      setPreviewUrl("");
      setMessage({ open: true, severity: "error", text: "Error al cargar datos de la orden." });
    }
  };

  // ---- PDF
  const verPDF = () => {
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: Number(empresaId),
        pedido_id: Number(form.pedido_id),
        categoria_estado_id: Number(form.categoria_estado_id),
        logo_empresa: logoPath
      },
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "Reporte generado correctamente." });
    }).catch((err) => {
      console.error("Error al generar PDF:", err?.response || err);
      setPreviewUrl("");
      setMessage({ open: true, severity: "error", text: "Error al generar el reporte." });
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const fields = [
    { name: "pais_id",              label: "País",               items: data.paises,        disabled: false },
    { name: "departamento_id",      label: "Departamento",       items: data.departamentos, disabled: !form.pais_id },
    { name: "municipio_id",         label: "Municipio",          items: data.municipios,    disabled: !form.departamento_id },
    { name: "sede_id",              label: "Sede",               items: data.sedes,         disabled: !form.municipio_id },
    { name: "bloque_id",            label: "Bloque",             items: data.bloques,       disabled: !form.sede_id },
    { name: "espacio_id",           label: "Espacio",            items: data.espacios,      disabled: !form.bloque_id },
    { name: "almacen_id",           label: "Almacén",            items: data.almacenes,     disabled: !form.espacio_id },
    { name: "producto_categoria_id",label: "Categoría Producto", items: data.categorias,    disabled: false },
    { name: "producto_id",          label: "Producto",           items: productosFiltrados, disabled: false },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Gestión de Orden de Compra</Typography>

      <Grid container spacing={2} mb={3}>
        {fields.map(field => (
          <Grid item xs={12} md={6} key={field.name}>
            <FormControl fullWidth disabled={field.disabled}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={form[field.name]}
                label={field.label}
                onChange={handleChange}
              >
                {asArray(field.items).length
                  ? asArray(field.items).map(item => (
                      <MenuItem key={item.id} value={String(item.id)}>{item.nombre}</MenuItem>
                    ))
                  : <MenuItem disabled value="">Sin opciones</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pedido</InputLabel>
            <Select name="pedido_id" value={form.pedido_id} label="Pedido" onChange={handleChange}>
              {asArray(data.pedidos).map(p => (
                <MenuItem key={p.id} value={String(p.id)}>{`Pedido ${p.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Categoría Estado"
            name="categoria_estado_id"
            type="number"
            value={form.categoria_estado_id}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={buscarOrden}>Buscar</Button>
            <Button variant="outlined" onClick={verPDF} disabled={!form.pedido_id || !form.categoria_estado_id}>
              Ver Reporte
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          Vista previa del Reporte
          <IconButton onClick={() => setPreviewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewUrl && (
            <iframe src={previewUrl} width="100%" height="600px" title="Vista previa PDF" style={{ border: "none" }} />
          )}
        </DialogContent>
      </Dialog>

      {ordenData && (
        <>
          <VistaPreviaPDFOrdenCompra orden={ordenData} />
          <Box mt={4}>
            <Typography variant="h6">Artículos de la Orden</Typography>
            <GridArticuloOrdenCompra
              items={articulos}
              presentaciones={presentaciones}
              setSelectedRows={setSelectedRows}
              setSelectedRow={() => {}}
            />
          </Box>
        </>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
