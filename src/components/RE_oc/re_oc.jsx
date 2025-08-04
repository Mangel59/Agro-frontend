import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Stack, Grid, MenuItem, FormControl, InputLabel, Select
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
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
  const [previewOpen, setPreviewOpen] = useState(false);


  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const [form, setForm] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    categoria_estado_id: "", pedido_id: ""
  });

  const [data, setData] = useState({
    paises: [], departamentos: [], municipios: [], sedes: [],
    bloques: [], espacios: [], almacenes: [],
    productos: [], categorias: [], pedidos: [], categorias_estado: []
  });


  const [ordenData, setOrdenData] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  // ---------- Cargar listas (paises, departamentos, etc.) ----------
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


 // ---------- Imprimir pdf ----------
  const verPDF = () => {
    axios({
      url: "/v2/report/orden_compra",
      method: "POST",
      data: {
        empresa_id: parseInt(empresaId),
        pedido_id: parseInt(form.pedido_id),
        categoria_estado_id: parseInt(form.categoria_estado_id),
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
      console.error("Error al generar reporte PDF:", err?.response || err);
      setPreviewUrl("");
      setMessage({ open: true, severity: "error", text: "Error al generar el reporte." });
    });
  };


  // ---------- Buscar orden ----------
  const buscarOrden = async () => {
    if (!form.pedido_id) {
      setMessage({ open: true, severity: "warning", text: "Debes ingresar un ID de pedido." });
      return;
    }

    try {
      const ordenesRes = await axios.get("/v1/orden_compra", { params: { page: 0, size: 100 }, ...headers });
      const ordenes = ordenesRes.data.data || ordenesRes.data;
      const orden = ordenes.find((o) => String(o.pedidoId) === String(form.pedido_id));

      if (!orden) {
        setMessage({ open: true, severity: "error", text: "No se encontró la orden para ese pedido." });
        return;
      }

      const [articulosRes, presentacionesRes] = await Promise.all([
        axios.get(`/v1/orden_compra/${orden.id}/articulos`, headers),
        axios.get("/v1/producto_presentacion", headers),
      ]);

      setOrdenData(orden);
      setArticulos(articulosRes.data);
      setPresentaciones(presentacionesRes.data);
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
      setMessage({
        open: true,
        severity: "error",
        text: `Error ${error?.response?.status || ""}: ${error?.response?.statusText || "al cargar datos de la orden"}`
      });
    }
  };

  const handleChange = (event) => {
  const { name, value } = event.target;
  setForm(prev => ({
    ...prev,
    [name]: value
  }));
};

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Gestión de Orden de Compra</Typography>

      <Grid container spacing={2} mb={3}>
        {[
          { name: "pais_id", label: "País", items: data.paises },
          { name: "departamento_id", label: "Departamento", items: data.departamentos },
          { name: "municipio_id", label: "Municipio", items: data.municipios },
          { name: "sede_id", label: "Sede", items: data.sedes },
          { name: "bloque_id", label: "Bloque", items: data.bloques },
          { name: "espacio_id", label: "Espacio", items: data.espacios },
          { name: "almacen_id", label: "Almacén", items: data.almacenes },
          { name: "producto_id", label: "Producto", items: data.productos },
          { name: "producto_categoria_id", label: "Categoría Producto", items: data.categorias },
        ].map((field, index) => (
          <Grid item xs={12} md={6} key={field.name}>
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select name={field.name} value={form[field.name]} label={field.label} onChange={handleChange}>
                {field.items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.nombre}</MenuItem>
                ))}
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
            {data.pedidos.map((pedido) => (
              <MenuItem key={pedido.id} value={pedido.id}>
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
        <Grid item xs={12}>
  <Stack direction="row" spacing={2}>
    <Button variant="contained" onClick={buscarOrden}>Buscar</Button>
    <Button
      variant="outlined"
      onClick={verPDF}
      disabled={!form.pedido_id || !form.categoria_estado_id}
    >
      Ver Reporte
    </Button>
  </Stack>
</Grid>

        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="lg">
      <DialogTitle>
        Vista previa del Reporte
        <IconButton
          aria-label="close"
          onClick={() => setPreviewOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
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

      </Grid>
      

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
