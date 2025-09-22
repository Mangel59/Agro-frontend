import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from "@mui/material";
import axios from "../axiosConfig";
import StackButtons from "../StackButtons";

export default function FormOcupacion({ selectedRow, setSelectedRow, setMessage, reloadData }) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  const [tiposActividad, setTiposActividad] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    tipoActividadId: "",
    evaluacionId: "",
    estadoId: "1",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const resetForm = () => {
    setFormData({ nombre: "", tipoActividadId: "", evaluacionId: "", estadoId: "1" });
    setErrors({});
  };

  const loadData = async () => {
    try {
      const [resTipos, resEval] = await Promise.all([
        axios.get("/v1/items/tipo_actividad/0", headers),
        axios.get("/v1/items/evaluacion/0", headers),
      ]);
      setTiposActividad(resTipos.data || []);
      setEvaluaciones(resEval.data || []);
    } catch (err) {
      console.error("Error cargando catálogos:", err);
      setMessage({ open: true, severity: "error", text: "No se pudieron cargar catálogos." });
    }
  };

  const create = () => {
    resetForm();
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
    setErrors({});
    setMethodName("Editar");
    loadData();
    setOpen(true);
  };

  const deleteRow = async () => {
    if (!selectedRow?.id) return;
    try {
      await axios.delete(`/v1/ocupacion/${selectedRow.id}`, headers);
      setMessage({ open: true, severity: "success", text: "Ocupación eliminada correctamente." });
      setSelectedRow({});
      reloadData();
    } catch {
      setMessage({ open: true, severity: "error", text: "Error al eliminar ocupación." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nombre = (formData.nombre || "").trim();
    if (!nombre) newErrors.nombre = "El nombre es obligatorio.";
    else if (nombre.length < 3) newErrors.nombre = "Mínimo 3 caracteres.";
    else if (nombre.length > 120) newErrors.nombre = "Máximo 120 caracteres.";

    if (!formData.tipoActividadId) newErrors.tipoActividadId = "Selecciona un tipo de actividad.";
    if (!formData.evaluacionId) newErrors.evaluacionId = "Selecciona una evaluación.";

    if (!["1", "2"].includes(formData.estadoId?.toString()))
      newErrors.estadoId = "Estado inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      nombre: formData.nombre.trim(),
      tipoActividadId: parseInt(formData.tipoActividadId, 10),
      evaluacionId: parseInt(formData.evaluacionId, 10),
      estadoId: parseInt(formData.estadoId, 10),
    };

    const method = methodName === "Crear" ? axios.post : axios.put;
    const url = methodName === "Crear" ? "/v1/ocupacion" : `/v1/ocupacion/${selectedRow.id}`;

    try {
      setSubmitting(true);
      await method(url, payload, headers);
      setMessage({
        open: true,
        severity: "success",
        text: methodName === "Crear" ? "Ocupación creada!" : "Ocupación actualizada!",
      });
      setOpen(false);
      setSelectedRow({});
      reloadData();
    } catch (err) {
      console.error(err);
      const backendMsg = err?.response?.data?.message || "Error al guardar ocupación.";
      const violations = err?.response?.data?.violations || [];
      if (Array.isArray(violations) && violations.length) {
        const beErrors = {};
        violations.forEach(v => { if (v.field) beErrors[v.field] = v.message; });
        setErrors(prev => ({ ...prev, ...beErrors }));
      }
      setMessage({ open: true, severity: "error", text: backendMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  return (
    <>
      <StackButtons methods={{ create, update, deleteRow }} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>{methodName} Actividad Ocupación</DialogTitle>
          <DialogContent>

            <TextField
              fullWidth
              name="nombre"
              label="Nombre"
              margin="dense"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              inputProps={{ maxLength: 120 }}
            />

            <FormControl fullWidth margin="normal" error={!!errors.tipoActividadId}>
              <InputLabel>Tipo Actividad</InputLabel>
              <Select
                name="tipoActividadId"
                value={formData.tipoActividadId}
                label="Tipo Actividad"
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {tiposActividad.map(a => (
                  <MenuItem key={a.id} value={a.id.toString()}>{a.nombre}</MenuItem>
                ))}
              </Select>
              {!!errors.tipoActividadId && <FormHelperText>{errors.tipoActividadId}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.evaluacionId}>
              <InputLabel>Evaluación</InputLabel>
              <Select
                name="evaluacionId"
                value={formData.evaluacionId}
                label="Evaluación"
                onChange={handleChange}
              >
                <MenuItem value="">Seleccione...</MenuItem>
                {evaluaciones.map(ev => (
                  <MenuItem key={ev.id} value={ev.id.toString()}>
                    {ev.nombre ?? `Evaluación ${ev.id}`}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.evaluacionId && <FormHelperText>{errors.evaluacionId}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.estadoId}>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estadoId"
                value={formData.estadoId}
                label="Estado"
                onChange={handleChange}
              >
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="2">Inactivo</MenuItem>
              </Select>
              {!!errors.estadoId && <FormHelperText>{errors.estadoId}</FormHelperText>}
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={submitting}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>{methodName}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
