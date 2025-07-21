import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem,
  TextField, Button
} from "@mui/material";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import VistaPreviaPDFKardex from "../Kardex/vistapreviapdfkardex";

export default function RE_productoVencimiento() {
  const token = localStorage.getItem("token");
  const empresaId = token ? JSON.parse(atob(token.split(".")[1]))?.empresaId : null;
  const logoPath = `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`;

  const [formReporte, setFormReporte] = useState({
    producto_id: "",
    producto_categoria_id: "",
    fecha_inicio: "",
    fecha_fin: ""
  });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormReporte(prev => ({ ...prev, [name]: value }));
  };

  const formatoFecha = (fecha) => fecha ? fecha.replace("T", " ").slice(0, 16) : "";

  const construirParametros = () => ({
    empresa_id: parseInt(empresaId),
    fecha_inicio: formatoFecha(formReporte.fecha_inicio),
    fecha_fin: formatoFecha(formReporte.fecha_fin),
    logo_empresa: `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`
  });

  const generarPDF = () => {
    if (!formReporte.producto_id || !formReporte.producto_categoria_id || !formReporte.fecha_inicio || !formReporte.fecha_fin) {
      setMessage({ open: true, severity: "warning", text: "Completa todos los campos." });
      return;
    }

    const datos = construirParametros();
    axios.post("/v2/report/producto_vencimiento", datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      responseType: "blob"
    }).then((res) => {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setMessage({ open: true, severity: "success", text: "PDF generado correctamente." });
    }).catch((err) => {
      console.error("❌ Error al generar PDF:", err);
      setMessage({ open: true, severity: "error", text: "Error al generar el PDF." });
    });
  };

  useEffect(() => {
    axios.get("/v1/producto").then(res => setProductos(res.data));
    axios.get("/v1/producto_categoria").then(res => setCategorias(res.data));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Reporte de Vencimiento de Producto</Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select name="producto_id" value={formReporte.producto_id} onChange={handleChange}>
              {productos.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Categoría Producto</InputLabel>
            <Select name="producto_categoria_id" value={formReporte.producto_categoria_id} onChange={handleChange}>
              {categorias.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="datetime-local"
            fullWidth
            value={formReporte.fecha_inicio}
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
            value={formReporte.fecha_fin}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Button variant="contained" onClick={generarPDF}>Ver Reporte</Button>
      </Box>

      {previewUrl && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Vista previa del PDF</Typography>
          <VistaPreviaPDFKardex url={previewUrl} />
        </Box>
      )}

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
