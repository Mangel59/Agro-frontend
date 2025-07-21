import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormKardex from "./FromKardex";
import GridKardex from "./GridKardex";
import GridArticuloKardex from "./GridArticuloKardex";
import FormArticuloKardex from "./FormArticuloKardex";
import VistaPreviaPDFKardex from "./vistapreviapdfkardex";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Typography, Divider, Grid, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";

export default function Kardex() {
  const [kardexes, setKardexes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [articuloItems, setArticuloItems] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState({});
  const [reloadArticulos, setReloadArticulos] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [reporteDialogOpen, setReporteDialogOpen] = useState(false);

  const [formReporte, setFormReporte] = useState({
    pais_id: "", departamento_id: "", municipio_id: "", sede_id: "",
    bloque_id: "", espacio_id: "", almacen_id: "",
    producto_id: "", producto_categoria_id: "",
    fecha_inicio: "", fecha_fin: ""
  });

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const token = localStorage.getItem("token");
  const empresaId = token ? JSON.parse(atob(token.split(".")[1]))?.empresaId : null;

  useEffect(() => {
    reloadData();
    axios.get("/v1/pais").then(res => setPaises(res.data));
    axios.get("/v1/producto").then(res => setProductos(res.data));
    axios.get("/v1/producto_categoria").then(res => setCategorias(res.data));
  }, []);

  useEffect(() => {
    if (!formReporte.pais_id) return setDepartamentos([]);
    axios.get("/v1/departamento").then(res => {
      setDepartamentos(res.data.filter(dep => dep.paisId === parseInt(formReporte.pais_id)));
    });
  }, [formReporte.pais_id]);

  useEffect(() => {
    if (!formReporte.departamento_id) return setMunicipios([]);
    axios.get(`/v1/municipio?departamentoId=${formReporte.departamento_id}`).then(res => {
      setMunicipios(res.data);
    });
  }, [formReporte.departamento_id]);

  useEffect(() => {
    if (!formReporte.municipio_id) return setSedes([]);
    axios.get("/v1/sede").then(res => {
      setSedes(res.data.filter(s => s.municipioId === parseInt(formReporte.municipio_id)));
    });
  }, [formReporte.municipio_id]);

  useEffect(() => {
    if (!formReporte.sede_id) return setBloques([]);
    axios.get("/v1/bloque").then(res => {
      setBloques(res.data.filter(b => b.sedeId === parseInt(formReporte.sede_id)));
    });
  }, [formReporte.sede_id]);

  useEffect(() => {
    if (!formReporte.bloque_id) return setEspacios([]);
    axios.get("/v1/espacio").then(res => {
      setEspacios(res.data.filter(e => e.bloqueId === parseInt(formReporte.bloque_id)));
    });
  }, [formReporte.bloque_id]);

  useEffect(() => {
    if (!formReporte.espacio_id) return setAlmacenes([]);
    axios.get("/v1/almacen").then(res => {
      setAlmacenes(res.data.filter(a => a.espacioId === parseInt(formReporte.espacio_id)));
    });
  }, [formReporte.espacio_id]);

  const reloadData = () => {
    axios.get("/v1/kardex").then((res) => {
      setKardexes(res.data);
      if (res.data.length > 0 && !selectedRow) {
        setSelectedRow(res.data[0]);
      }
    }).catch(() => {
      setMessage({ open: true, severity: "error", text: "Error al cargar kardexes" });
    });
  };

  const loadArticulos = (kardexId) => {
    axios.get(`/v1/kardex/${kardexId}/articulos`)
      .then(res => setArticuloItems(res.data))
      .catch(() => setArticuloItems([]));
  };

  useEffect(() => {
    if (selectedRow) loadArticulos(selectedRow.id);
    else setArticuloItems([]);
  }, [selectedRow, reloadArticulos]);

  const handleChangeReporte = (e) => {
    const { name, value } = e.target;
    setFormReporte(prev => ({ ...prev, [name]: value }));
  };
// formato "YYYY-MM-DD HH:mm"
const formatoFecha = (fecha) => {
  return fecha ? fecha.replace("T", " ").slice(0, 16) : "";
};

const construirParametros = () => ({
  empresa_id: parseInt(empresaId),
  fecha_inicio: formatoFecha(formReporte.fecha_inicio),
  fecha_fin: formatoFecha(formReporte.fecha_fin),
  logo_empresa: `${import.meta.env.VITE_RUTA_LOGO_EMPRESA}${empresaId}/logo_empresa.jpeg`
});

  const generarVistaPreviaPDF = () => {
    if (!formReporte.fecha_inicio || !formReporte.fecha_fin || !empresaId) {
      setMessage({
        open: true,
        severity: "warning",
        text: "Completa todos los campos requeridos."
      });
      return;
    }

    const datos = construirParametros();
    axios.post("/v2/report/kardex", datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      responseType: "blob"
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        setPreviewUrl(url);
        setReporteDialogOpen(false);
      })
      .catch((err) => {
        console.error("❌ Error al generar PDF Kardex:", err);
        setMessage({ open: true, severity: "error", text: "Error al generar vista previa PDF." });
      });
  };

  const imprimirPDFKardex = () => {
    if (!formReporte.fecha_inicio || !formReporte.fecha_fin || !empresaId) {
      setMessage({
        open: true,
        severity: "warning",
        text: "Completa todos los campos requeridos."
      });
      return;
    }

    const datos = construirParametros();
    axios.post("/v2/report/kardex", datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      responseType: "blob"
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reporte_kardex.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("❌ Error al descargar PDF Kardex:", err);
        setMessage({ open: true, severity: "error", text: "Error al descargar el PDF." });
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Gestión de Kardex</Typography>
        <Button variant="outlined" color="secondary" onClick={() => setReporteDialogOpen(true)}>
          Ver Reporte Kardex
        </Button>
      </Box>

      <FormKardex {...{ open: formOpen, setOpen: setFormOpen, formMode, setFormMode, selectedRow, setSelectedRow, reloadData, setMessage }} />

      <Box sx={{ height: 350, mb: 12 }}>
        <GridKardex {...{ kardexes, selectedRow, setSelectedRow }} pageSizeOptions={[5, 10, 15]} />
      </Box>

      <Divider sx={{ my: 10 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
        <Typography variant="h6">Artículos del Kardex seleccionado</Typography>
        <FormArticuloKardex {...{ selectedRow: selectedArticulo, kardexId: selectedRow?.id || "", setSelectedRow: setSelectedArticulo, setMessage, reloadData: () => setReloadArticulos(prev => !prev) }} />
      </Box>

      <GridArticuloKardex {...{ items: articuloItems, selectedRow: selectedArticulo, setSelectedRow: setSelectedArticulo }} />

      <Dialog open={reporteDialogOpen} onClose={() => setReporteDialogOpen(false)} fullWidth>
        <DialogTitle>Parámetros del Reporte Kardex</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {[{ label: "País", name: "pais_id", options: paises },
              { label: "Departamento", name: "departamento_id", options: departamentos },
              { label: "Municipio", name: "municipio_id", options: municipios },
              { label: "Sede", name: "sede_id", options: sedes },
              { label: "Bloque", name: "bloque_id", options: bloques },
              { label: "Espacio", name: "espacio_id", options: espacios },
              { label: "Almacén", name: "almacen_id", options: almacenes },
              { label: "Producto", name: "producto_id", options: productos },
              { label: "Categoría Producto", name: "producto_categoria_id", options: categorias }
            ].map(({ label, name, options }) => (
              <Grid item xs={6} key={name}>
                <FormControl fullWidth>
                  <InputLabel>{label}</InputLabel>
                  <Select name={name} value={formReporte[name]} onChange={handleChangeReporte}>
                    {options.map(opt => (
                      <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>
                    ))}
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
    value={formReporte.fecha_inicio || ""}
    onChange={handleChangeReporte}
    InputLabelProps={{ shrink: true }}
  />
</Grid>
<Grid item xs={6}>
  <TextField
    label="Fecha Fin"
    name="fecha_fin"
    type="datetime-local"
    fullWidth
    value={formReporte.fecha_fin || ""}
    onChange={handleChangeReporte}
    InputLabelProps={{ shrink: true }}
  />
</Grid>


          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReporteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={generarVistaPreviaPDF} variant="contained">Ver Reporte</Button>
          <Button onClick={imprimirPDFKardex} variant="outlined" color="secondary">Imprimir PDF</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(previewUrl)} onClose={() => setPreviewUrl("")} fullWidth maxWidth="xl">
        <DialogTitle>Vista Previa PDF</DialogTitle>
        <DialogContent>
          <VistaPreviaPDFKardex url={previewUrl} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewUrl("")}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <MessageSnackBar message={message} setMessage={setMessage} />
    </Box>
  );
}
