import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormProduccion({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  reloadData = () => {},
  setMessage = () => {},
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
    tipoProduccionId: "",
    productoId: "",
    espacioId: "",
    estadoId: 1,
  });

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposProduccion, setTiposProduccion] = useState([]);
  const [productos, setProductos] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (open && formMode === "edit" && selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFinal: "",
        tipoProduccionId: "",
        productoId: "",
        espacioId: "",
        estadoId: 1,
      });
    }
  }, [open]);

  // Carga inicial
  useEffect(() => {
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
    axios.get("/v1/tipo_produccion", headers).then(res => setTiposProduccion(res.data));
    axios.get("/v1/producto", headers).then(res => {
  const data = res.data;
  if (Array.isArray(data)) {
    setProductos(data);
  } else if (Array.isArray(data?.data)) {
    setProductos(data.data); // por si viene dentro de un objeto
  } else {
    console.warn("Respuesta inesperada en /v1/producto:", data);
    setProductos([]);
  }
});

  }, []);

  // Cascadas
  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedPais) return;
    axios.get("/v1/departamento", headers).then(res => {
      setDepartamentos(res.data.filter(dep => dep.paisId === parseInt(selectedPais)));
    });
  }, [selectedPais]);

  useEffect(() => {
    setMunicipios([]); setSelectedMunicipio("");
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedDepto) return;
    axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
      setMunicipios(res.data);
    });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedMunicipio) return;
    axios.get("/v1/sede", headers).then(res => {
      setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
    });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedSede) return;
    axios.get(`/v1/bloque?sedeId=${selectedSede}`, headers).then(res => {
      setBloques(res.data);
    });
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setFormData(f => ({ ...f, espacioId: "" }));
    if (!selectedBloque) return;
    axios.get(`/v1/espacio?bloqueId=${selectedBloque}`, headers).then(res => {
      setEspacios(res.data);
    });
  }, [selectedBloque]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const method = formMode === "edit" ? axios.put : axios.post;
    const url = formMode === "edit" ? `/v1/produccion/${formData.id}` : "/v1/produccion";
    method(url, formData, headers)
      .then(() => {
        reloadData();
        setMessage({ open: true, severity: "success", text: `Producción ${formMode === "edit" ? "actualizada" : "creada"}` });
        setOpen(false);
      })
      .catch(() => {
        setMessage({ open: true, severity: "error", text: "Error al guardar producción" });
      });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Producción" : "Nueva Producción"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
        <TextField label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} fullWidth />
        <TextField label="Fecha Inicio" name="fechaInicio" type="datetime-local" value={formData.fechaInicio} onChange={handleChange} fullWidth />
        <TextField label="Fecha Final" name="fechaFinal" type="datetime-local" value={formData.fechaFinal} onChange={handleChange} fullWidth />

        {/* Tipo Producción */}
        <FormControl fullWidth>
          <InputLabel>Tipo Producción</InputLabel>
          <Select
            name="tipoProduccionId"
            value={formData.tipoProduccionId}
            onChange={handleChange}
          >
            {tiposProduccion.map(tp => (
              <MenuItem key={tp.id} value={tp.id}>{tp.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Producto */}
        <FormControl fullWidth>
          <InputLabel>Producto</InputLabel>
          <Select
            name="productoId"
            value={formData.productoId}
            onChange={handleChange}
          >
            {productos.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cascada de espacio */}
        <FormControl fullWidth><InputLabel>País</InputLabel>
          <Select value={selectedPais} onChange={(e) => setSelectedPais(e.target.value)}>
            {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedPais}><InputLabel>Departamento</InputLabel>
          <Select value={selectedDepto} onChange={(e) => setSelectedDepto(e.target.value)}>
            {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedDepto}><InputLabel>Municipio</InputLabel>
          <Select value={selectedMunicipio} onChange={(e) => setSelectedMunicipio(e.target.value)}>
            {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedMunicipio}><InputLabel>Sede</InputLabel>
          <Select value={selectedSede} onChange={(e) => setSelectedSede(e.target.value)}>
            {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedSede}><InputLabel>Bloque</InputLabel>
          <Select value={selectedBloque} onChange={(e) => setSelectedBloque(e.target.value)}>
            {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedBloque}><InputLabel>Espacio</InputLabel>
          <Select name="espacioId" value={formData.espacioId} onChange={handleChange}>
            {espacios.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
