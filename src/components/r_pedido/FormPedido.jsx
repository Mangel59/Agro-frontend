// FormPedido.jsx con jerarquía para seleccionar almacén
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel,
  Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";

export default function FormPedido({
  open = false,
  setOpen = () => {},
  formMode = "create",
  selectedRow = null,
  almacenId = "",
  reloadData = () => {},
  setMessage = () => {},
}) {
  const [producciones, setProducciones] = useState([]);
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  const [selectedPais, setSelectedPais] = useState("");
  const [selectedDepto, setSelectedDepto] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedSede, setSelectedSede] = useState("");
  const [selectedBloque, setSelectedBloque] = useState("");
  const [selectedEspacio, setSelectedEspacio] = useState("");

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const initialData = {
    id: null,
    almacenId: almacenId || "",
    produccionId: "",
    descripcion: "",
    fechaHora: "",
    estadoId: 1,
    empresaId: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("/v1/produccion", headers)
      .then(res => setProducciones(res.data || []))
      .catch(() => setProducciones([]));
    axios.get("/v1/pais", headers).then(res => setPaises(res.data));
  }, []);

  useEffect(() => {
    if (open) {
      if (formMode === "edit" && selectedRow) {
        setFormData({ ...selectedRow });
      } else {
        setFormData({ ...initialData, almacenId });
      }
      setErrors({});
    }
  }, [open, formMode, selectedRow, almacenId]);

  useEffect(() => {
    setDepartamentos([]); setSelectedDepto("");
    if (selectedPais)
      axios.get("/v1/departamento", headers).then(res => {
        setDepartamentos(res.data.filter(d => d.paisId === parseInt(selectedPais)));
      });
  }, [selectedPais]);

  useEffect(() => {
    setMunicipios([]); setSelectedMunicipio("");
    if (selectedDepto)
      axios.get(`/v1/municipio?departamentoId=${selectedDepto}`, headers).then(res => {
        setMunicipios(res.data);
      });
  }, [selectedDepto]);

  useEffect(() => {
    setSedes([]); setSelectedSede("");
    if (selectedMunicipio)
      axios.get("/v1/sede", headers).then(res => {
        setSedes(res.data.filter(s => s.municipioId === parseInt(selectedMunicipio)));
      });
  }, [selectedMunicipio]);

  useEffect(() => {
    setBloques([]); setSelectedBloque("");
    if (selectedSede)
      axios.get("/v1/bloque", headers).then(res => {
        setBloques(res.data.filter(b => b.sedeId === parseInt(selectedSede)));
      });
  }, [selectedSede]);

  useEffect(() => {
    setEspacios([]); setSelectedEspacio("");
    if (selectedBloque)
      axios.get("/v1/espacio", headers).then(res => {
        setEspacios(res.data.filter(e => e.bloqueId === parseInt(selectedBloque)));
      });
  }, [selectedBloque]);

  useEffect(() => {
    setAlmacenes([]);
    if (selectedEspacio)
      axios.get("/v1/almacen", headers).then(res => {
        setAlmacenes(res.data.filter(a => a.espacioId === parseInt(selectedEspacio)));
      });
  }, [selectedEspacio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.produccionId) newErrors.produccionId = "Seleccione una producción.";
    if (!formData.fechaHora) newErrors.fechaHora = "La fecha es obligatoria.";
    if (!formData.estadoId && formData.estadoId !== 0) newErrors.estadoId = "Seleccione estado.";
    if (!formData.almacenId) newErrors.almacenId = "Almacén no asignado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (formMode === "edit" && formData.id) {
        await axios.put(`/v1/pedido/${formData.id}`, formData, headers);
        setMessage({ open: true, severity: "success", text: "Pedido actualizado correctamente." });
      } else {
        await axios.post("/v1/pedido", formData, headers);
        setMessage({ open: true, severity: "success", text: "Pedido creado correctamente." });
      }
      setOpen(false);
      reloadData();
    } catch (err) {
      setMessage({
        open: true,
        severity: "error",
        text: err.response?.data?.message || "Error al guardar pedido.",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{formMode === "edit" ? "Editar Pedido" : "Nuevo Pedido"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>País</InputLabel>
          <Select value={selectedPais} onChange={(e) => setSelectedPais(e.target.value)}>
            {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedPais}>
          <InputLabel>Departamento</InputLabel>
          <Select value={selectedDepto} onChange={(e) => setSelectedDepto(e.target.value)}>
            {departamentos.map(d => <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedDepto}>
          <InputLabel>Municipio</InputLabel>
          <Select value={selectedMunicipio} onChange={(e) => setSelectedMunicipio(e.target.value)}>
            {municipios.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedMunicipio}>
          <InputLabel>Sede</InputLabel>
          <Select value={selectedSede} onChange={(e) => setSelectedSede(e.target.value)}>
            {sedes.map(s => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedSede}>
          <InputLabel>Bloque</InputLabel>
          <Select value={selectedBloque} onChange={(e) => setSelectedBloque(e.target.value)}>
            {bloques.map(b => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedBloque}>
          <InputLabel>Espacio</InputLabel>
          <Select value={selectedEspacio} onChange={(e) => setSelectedEspacio(e.target.value)}>
            {espacios.map(e => <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedEspacio} error={!!errors.almacenId}>
          <InputLabel>Almacén</InputLabel>
          <Select
            name="almacenId"
            value={formData.almacenId}
            onChange={handleChange}
          >
            {almacenes.map(a => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
          </Select>
          {errors.almacenId && <FormHelperText>{errors.almacenId}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.produccionId}>
          <InputLabel>Producción</InputLabel>
          <Select
            name="produccionId"
            value={formData.produccionId}
            onChange={handleChange}
            label="Producción"
          >
            {producciones.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </Select>
          {errors.produccionId && <FormHelperText>{errors.produccionId}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Fecha y Hora"
          name="fechaHora"
          type="datetime-local"
          value={formData.fechaHora}
          onChange={handleChange}
          error={!!errors.fechaHora}
          helperText={errors.fechaHora}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estadoId"
            value={formData.estadoId}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
          </Select>
          {errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
