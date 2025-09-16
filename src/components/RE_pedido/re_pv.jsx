import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid, MenuItem,
  FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFPedido from "../r_pedido/VistaPreviaPDFPedido";
import GridArticuloPedido from "../r_pedido/GridArticuloPedido";

export default function RE_pedido() {
  const empresaId = localStorage.getItem("empresaId");
  const token = localStorage.getItem("token");
  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // helpers
  const asArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.content)) return payload.content;
    return [];
  };
  const uniqById = (arr) => Array.from(new Map(arr.map(o => [o.id, o])).values());
  const num = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));
  const getProdCatId = (p) =>
    p?.productoCategoriaId ??
    p?.categoriaProductoId ??
    p?.categoriaId ??
    p?.categoria?.id ??
    p?.productoCategoria?.id ??
    null;

  // convierte "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm"
  const toReportDT = (val) => (val ? String(val).replace("T", " ") : "");

  const [form, setForm] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    categoria_estado_id: "", pedido_id: "",
    fecha_inicio: "", fecha_fin: ""
  });

  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [],
    bloques: [], espacios: [], almacenes: [],
    productos: [], categorias: [], pedidos: []
  });

  const [pedidoData, setPedidoData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // ---------- Carga inicial
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res =>
      setData(d => ({ ...d, paises: asArray(res.data) }))
    );
    axios.get("/v1/producto", headers).then(res =>
      setData(d => ({ ...d, productos: asArray(res.data) }))
    );
    axios.get("/v1/producto_categoria", headers).then(res =>
      setData(d => ({ ...d, categorias: asArray(res.data) }))
    );
    axios.get("/v1/pedido", headers).then(res =>
      setData(d => ({ ...d, pedidos: asArray(res.data) }))
    );
  }, []);

  // limpiar en cascada desde un campo
  const limpiarCamposDesde = (campo) => {
    const orden = [
      "pais_id", "departamento_id", "municipio_id", "sede_id",
      "bloque_id", "espacio_id", "almacen_id"
    ];
    const i = orden.indexOf(campo);
    const limpiarDesde = orden.slice(i + 1);
    setForm(prev => {
      const nuevo = { ...prev };
      limpiarDesde.forEach(c => { nuevo[c] = ""; });
      return nuevo;
    });
  };

  // ---------- País -> Departamentos
  useEffect(() => {
    if (!form.pais_id) return;
    limpiarCamposDesde("pais_id");
    axios.get("/v1/departamento", headers).then(res => {
      const list = asArray(res.data).filter(dep => Number(dep.paisId) === Number(form.pais_id));
      setData(d => ({ ...d, departamentos: list }));
      if (list.length === 1) setForm(f => ({ ...f, departamento_id: String(list[0].id) }));
    });
  }, [form.pais_id]);

  // ---------- Depto -> Municipios
  useEffect(() => {
    if (!form.departamento_id) return;
    limpiarCamposDesde("departamento_id");
    axios.get(`/v1/municipio?departamentoId=${form.departamento_id}`, headers).then(res => {
      const list = asArray(res.data);
      setData(d => ({ ...d, municipios: list }));
      if (list.length === 1) setForm(f => ({ ...f, municipio_id: String(list[0].id) }));
    }).catch(() => setData(d => ({ ...d, municipios: [] })));
  }, [form.departamento_id]);

  // ---------- Municipio -> Sedes (filtra por empresa)
  useEffect(() => {
    if (!form.municipio_id) return;
    limpiarCamposDesde("municipio_id");
    axios.get("/v1/sede", headers).then(res => {
      const raw = asArray(res.data);
      const municipioId = Number(form.municipio_id);
      const empresaNum = empresaId ? Number(empresaId) : null;
      const itemsTienenEmpresa = raw.some(s => s.empresaId != null);

      const filtered = raw.filter(s => {
        const sameMun = Number(s.municipioId) === municipioId;
        if (!sameMun) return false;
        if (itemsTienenEmpresa && empresaNum != null) {
          return Number(s.empresaId) === empresaNum;
        }
        return true;
      });

      const list = uniqById(filtered);
      setData(d => ({ ...d, sedes: list }));
      if (list.length === 1) setForm(f => ({ ...f, sede_id: String(list[0].id) }));
    }).catch(() => setData(d => ({ ...d, sedes: [] })));
  }, [form.municipio_id, empresaId]);

  // ---------- Sede -> Bloques (siempre filtra en cliente)
  useEffect(() => {
    if (!form.sede_id) return;
    limpiarCamposDesde("sede_id");
    axios.get("/v1/bloque", headers).then(res => {
      let list = asArray(res.data).filter(b => String(b.sedeId) === String(form.sede_id));
      list = uniqById(list);
      setData(d => ({ ...d, bloques: list }));
      if (list.length === 1) setForm(f => ({ ...f, bloque_id: String(list[0].id) }));
    }).catch(() => setData(d => ({ ...d, bloques: [] })));
  }, [form.sede_id]);

  // ---------- Bloque -> Espacios
  useEffect(() => {
    if (!form.bloque_id) return;
    limpiarCamposDesde("bloque_id");
    axios.get("/v1/espacio", headers).then(res => {
      let list = asArray(res.data).filter(e => String(e.bloqueId) === String(form.bloque_id));
      list = uniqById(list);
      setData(d => ({ ...d, espacios: list }));
      if (list.length === 1) setForm(f => ({ ...f, espacio_id: String(list[0].id) }));
    }).catch(() => setData(d => ({ ...d, espacios: [] })));
  }, [form.bloque_id]);

  // ---------- Espacio -> Almacenes
  useEffect(() => {
    if (!form.espacio_id) return;
    limpiarCamposDesde("espacio_id");
    axios.get("/v1/almacen", headers).then(res => {
      let list = asArray(res.data).filter(a => String(a.espacioId) === String(form.espacio_id));
      list = uniqById(list);
      setData(d => ({ ...d, almacenes: list }));
      if (list.length === 1) setForm(f => ({ ...f, almacen_id: String(list[0].id) }));
    }).catch(() => setData(d => ({ ...d, almacenes: [] })));
  }, [form.espacio_id]);

  // reset producto al cambiar categoría
  useEffect(() => {
    setForm(f => ({ ...f, producto_id: "" }));
  }, [form.producto_categoria_id]);

  // --------- Productos filtrados por categoría
  const filteredProducts = useMemo(() => {
    const catId = num(form.producto_categoria_id);
    const all = asArray(data.productos);
    if (!catId) return all;
    return all.filter(p => Number(getProdCatId(p)) === catId);
  }, [data.productos, form.producto_categoria_id]);

  // Autoselect producto si queda uno tras el filtro
  useEffect(() => {
    if (filteredProducts.length === 1) {
      setForm(f => ({ ...f, producto_id: String(filteredProducts[0].id) }));
    }
  }, [filteredProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // ---------- Buscar pedido
  const buscarPedido = async () => {
    if (!form.pedido_id) {
      setMessage({ open: true, severity: "warning", text: "Debes seleccionar un pedido." });
      return;
    }
    try {
      const [pedidoRes, articulosRes, presentacionesRes] = await Promise.all([
        axios.get(`/v1/pedido/${form.pedido_id}`, headers),
        axios.get(`/v1/pedido/${form.pedido_id}/articulos`, headers),
        axios.get("/v1/presentacion", headers)
      ]);
      setPedidoData(pedidoRes.data);
      setArticulos(asArray(articulosRes.data));
      setPresentaciones(asArray(presentacionesRes.data));
      setPreviewUrl("");
      setSelectedRows([]);
      setMessage({ open: true, severity: "success", text: "Datos cargados correctamente." });
    } catch (error) {
      console.error("Error al buscar pedido:", error?.response || error);
      setMessage({ open: true, severity: "error", text: "No se encontró el pedido." });
    }
  };

  // ---------- PDF (incluye fechas si existen)
  const verPDF = () => {
    // Validación simple de rango si ambos están
    if (form.fecha_inicio && form.fecha_fin) {
      const ini = new Date(form.fecha_inicio);
      const fin = new Date(form.fecha_fin);
      if (ini > fin) {
        setMessage({ open: true, severity: "warning", text: "La fecha de inicio no puede ser mayor que la fecha fin." });
        return;
      }
    }

    const payload = {
      categoria_estado_id: Number(form.categoria_estado_id),
      emp_id: Number(empresaId),
      ped_id: Number(form.pedido_id),
      logo_empresa: logoPath,
      ...(form.fecha_inicio ? { fecha_inicio: toReportDT(form.fecha_inicio) } : {}),
      ...(form.fecha_fin ? { fecha_fin: toReportDT(form.fecha_fin) } : {}),
    };

    axios({
      url: "/v2/report/pedido",
      method: "POST",
      data: payload,
      responseType: "blob",
      ...headers
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
      setMessage({ open: true, severity: "success", text: "PDF generado correctamente." });
    }).catch((err) => {
      console.error("Error al generar PDF:", err?.response || err);
      setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
    });
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
    { name: "producto_id",          label: "Producto",           items: filteredProducts,   disabled: false },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Pedido</Typography>

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
                {asArray(field.items).length > 0 ? (
                  asArray(field.items).map(item => (
                    <MenuItem key={item.id} value={String(item.id)}>{item.nombre}</MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">Sin opciones</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pedido</InputLabel>
            <Select
              name="pedido_id"
              value={form.pedido_id}
              label="Pedido"
              onChange={handleChange}
            >
              {asArray(data.pedidos).map(pedido => (
                <MenuItem key={pedido.id} value={String(pedido.id)}>
                  {`Pedido ${pedido.id}`}
                </MenuItem>
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

        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={buscarPedido}>Buscar</Button>
            <Button
              variant="outlined"
              onClick={verPDF}
              disabled={!form.pedido_id || !form.categoria_estado_id}
            >
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
            <iframe
              src={previewUrl}
              width="100%"
              height="600px"
              title="Vista previa PDF"
              style={{ border: "none" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {pedidoData && (
        <>
          <VistaPreviaPDFPedido pedido={pedidoData} articulos={articulos} presentaciones={presentaciones} />
          <Box mt={4}>
            <Typography variant="h6">Artículos del Pedido</Typography>
            <GridArticuloPedido
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
