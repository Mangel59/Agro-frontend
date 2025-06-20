import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormOcupacion({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [tiposActividad, setTiposActividad] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const initialData = {
    nombre: "",
    tipoActividadId: "",
    evaluacionId: "",
    estadoId: "1",
  };

  const [formData, setFormData] = useState(initialData);

  const loadData = () => {
    axios.get("/v1/tipo_actividad", headers)
      .then(res => setTiposActividad(res.data))
      .catch(err => console.error("Error al cargar tipos de actividad:", err));
  };

  const create = () => {
    setFormData(initialData);
    setMethodName("Crear");
    loadData();
    setOpen(true);
  };

  const update = () => {
    if (!selectedRow?.id) {
      setMessage({ open: true, severity: "error", text: "Selecciona una ocupación para editar." });
      return;
    }
    setFormData({
      nombre: selectedRow.nombre || "",
      tipoActividadId: selectedRow.tipoActividadId?.toString() || "",
      evaluacionId: selectedRow.evaluacionId?.toString() || "",
      estadoId: selectedRow.estadoId?.toString() || "1",
    });
    setMethodName("Editar");
    loadData();
    setOpen(true);
  };

  const deleteRow = () => {
    if (!selectedRow?.id) return;
    axios.delete(`/v1/ocupacion/${selectedRow.id}`, headers)
      .then(() => {
        setMessage({ open: true, severity: "success", text: "Ocupación eliminada correctamente." });
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        setMessage({ open: true, severity: "error", text: "Error al eliminar ocupación." });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      tipoActividadId: parseInt(formData.tipoActividadId),
      evaluacionId: parseInt(formData.evaluacionId),
      estadoId: parseInt(formData.estadoId),
    };
    const method = methodName === "Crear" ? axios.post : axios.put;
    const url = methodName === "Crear" ? "/v1/ocupacion" : `/v1/ocupacion/${selectedRow.id}`;
    method(url, payload, headers)
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: methodName === "Crear" ? "Ocupación creada!" : "Ocupación actualizada!"
        });
        setOpen(false);
        setSelectedRow({});
        reloadData();
      })
      .catch(err => {
        console.error(err);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al guardar ocupación."
        });
      });
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{methodName} Ocupación</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth name="nombre" label="Nombre" required
              margin="dense" value={formData.nombre} onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Tipo Actividad</InputLabel>
              <Select name="tipoActividadId" value={formData.tipoActividadId} onChange={handleChange}>
                <MenuItem value="">Seleccione...</MenuItem>
                {tiposActividad.map(a => (
                  <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth name="evaluacionId" label="Evaluación ID" required
              margin="dense" type="number" value={formData.evaluacionId} onChange={handleChange}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Estado</InputLabel>
              <Select name="estadoId" value={formData.estadoId} onChange={handleChange}>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
